#!/usr/bin/env python
"""Download VoiceAeroRef shards, extract WAV files, and build JSONL manifests."""

from __future__ import annotations

import argparse
import hashlib
import json
import shutil
import tarfile
from collections import Counter, defaultdict
from pathlib import Path


REPO_ID = "lironui/VoiceAeroRef"
CONFIG_SPLITS = {
    "clean": ("train", "validation", "test"),
    "hard": ("validation", "test"),
}


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--repo-id", default=REPO_ID)
    parser.add_argument(
        "--output", type=Path, default=Path("data/VoiceAeroRef")
    )
    parser.add_argument(
        "--snapshot-dir",
        type=Path,
        help="Use an existing Hugging Face snapshot instead of downloading",
    )
    parser.add_argument(
        "--configs",
        nargs="+",
        choices=("clean", "hard"),
        default=["clean"],
    )
    parser.add_argument(
        "--splits",
        nargs="+",
        choices=("train", "validation", "test"),
    )
    parser.add_argument("--verify-checksums", action="store_true")
    parser.add_argument("--risbench-root", type=Path)
    parser.add_argument("--max-shards", type=int)
    return parser.parse_args()


def download_snapshot(repo_id: str, directory: Path) -> Path:
    try:
        from huggingface_hub import snapshot_download
    except ImportError as exc:
        raise RuntimeError("Install `huggingface-hub` first.") from exc
    directory.mkdir(parents=True, exist_ok=True)
    return Path(snapshot_download(
        repo_id=repo_id,
        repo_type="dataset",
        local_dir=directory,
        allow_patterns=[
            "README.md",
            "release_manifest.json",
            "checksums.sha256",
            "excluded_samples.jsonl",
            "data/**/*.tar",
            "clean/*.tar",
            "hard/*.tar",
            "audio/clean/*.tar",
            "audio/hard/*.tar",
        ],
    ))


def find_shards(snapshot: Path, config: str, split: str) -> list[Path]:
    directories = (
        snapshot / "data" / config,
        snapshot / config,
        snapshot / "audio" / config,
    )
    for directory in directories:
        shards = sorted(directory.glob(f"{split}-*.tar"))
        if shards:
            return shards
    return []


def load_checksums(snapshot: Path) -> dict[str, str]:
    path = snapshot / "checksums.sha256"
    if not path.is_file():
        return {}
    checksums = {}
    for line in path.read_text(encoding="utf-8").splitlines():
        if not line.strip():
            continue
        digest, relative = line.split(maxsplit=1)
        checksums[relative.strip().replace("\\", "/")] = digest
    return checksums


def checksum_for(
    shard: Path, snapshot: Path, checksums: dict[str, str]
) -> str | None:
    relative = shard.relative_to(snapshot).as_posix()
    candidates = {
        relative,
        f"data/{relative}",
        relative.removeprefix("audio/"),
        f"data/{relative.removeprefix('audio/')}",
    }
    return next(
        (checksums[key] for key in candidates if key in checksums), None
    )


def verify_shard(
    shard: Path, snapshot: Path, checksums: dict[str, str]
) -> None:
    expected = checksum_for(shard, snapshot, checksums)
    if expected is None:
        raise ValueError(f"no checksum entry for {shard}")
    digest = hashlib.sha256()
    with shard.open("rb") as handle:
        for chunk in iter(lambda: handle.read(8 * 1024**2), b""):
            digest.update(chunk)
    if digest.hexdigest() != expected:
        raise ValueError(f"checksum mismatch: {shard}")


def safe_output_path(root: Path, relative: str) -> Path:
    path = (root / relative).resolve()
    root_resolved = root.resolve()
    if root_resolved not in path.parents:
        raise ValueError(f"unsafe output path: {relative}")
    return path


def process_shard(shard: Path, output: Path) -> list[dict]:
    rows = []
    with tarfile.open(shard, "r:") as archive:
        members = {member.name: member for member in archive.getmembers()}
        json_names = sorted(
            name for name in members if name.endswith(".json")
        )
        for json_name in json_names:
            metadata_handle = archive.extractfile(members[json_name])
            if metadata_handle is None:
                raise ValueError(f"cannot read {json_name} in {shard}")
            row = json.loads(metadata_handle.read())
            key = str(row.get("__key__", Path(json_name).stem))
            wav_name = f"{key}.wav"
            if wav_name not in members:
                raise ValueError(f"missing {wav_name} in {shard}")
            audio_relative = str(row["source_audio_path"])
            destination = safe_output_path(output, audio_relative)
            destination.parent.mkdir(parents=True, exist_ok=True)
            audio_member = members[wav_name]
            if (
                not destination.is_file()
                or destination.stat().st_size != audio_member.size
            ):
                source = archive.extractfile(audio_member)
                if source is None:
                    raise ValueError(f"cannot read {wav_name} in {shard}")
                with destination.open("wb") as target:
                    shutil.copyfileobj(source, target, 1024 * 1024)
            row["audio"] = audio_relative.replace("\\", "/")
            for internal in (
                "__key__",
                "source_audio_path",
                "source_clean_audio_path",
            ):
                row.pop(internal, None)
            rows.append(row)
    return rows


def risbench_path(root: Path, relative: str) -> Path:
    direct = root / relative
    if direct.is_file():
        return direct
    path = Path(relative)
    if path.parts and path.parts[0] == "img_rgb":
        alternate = root / "rgb" / Path(*path.parts[1:])
        if alternate.is_file():
            return alternate
    return direct


def verify_risbench(rows: list[dict], root: Path) -> None:
    missing = []
    seen = set()
    for row in rows:
        key = (row["image"], row["mask"])
        if key in seen:
            continue
        seen.add(key)
        for field in ("image", "mask"):
            if not risbench_path(root, row[field]).is_file():
                missing.append(row[field])
                if len(missing) >= 10:
                    break
        if len(missing) >= 10:
            break
    if missing:
        raise FileNotFoundError(
            "RISBench files are missing; examples: " + ", ".join(missing)
        )


def validate_training_voices(rows: list[dict]) -> None:
    counts = Counter(int(row["source_index"]) for row in rows)
    invalid = {key: value for key, value in counts.items() if value != 8}
    if invalid:
        raise ValueError(
            "clean training sources must have eight voices; "
            f"examples={list(invalid.items())[:5]}"
        )


def write_manifest(path: Path, rows: list[dict]) -> None:
    rows.sort(
        key=lambda row: (
            int(row["source_index"]),
            str(row.get("voice_id", "")),
            str(row.get("noise_type", "")),
        )
    )
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8", newline="\n") as handle:
        for row in rows:
            handle.write(
                json.dumps(row, ensure_ascii=False, separators=(",", ":"))
                + "\n"
            )


def main() -> None:
    args = parse_args()
    if args.max_shards is not None and args.max_shards <= 0:
        raise ValueError("--max-shards must be positive")
    snapshot = (
        args.snapshot_dir
        if args.snapshot_dir
        else download_snapshot(args.repo_id, args.output / "snapshot")
    )
    snapshot = snapshot.resolve()
    checksums = load_checksums(snapshot)
    all_rows: list[dict] = []
    statistics: dict[str, int] = {}

    for config in args.configs:
        requested_splits = (
            tuple(args.splits)
            if args.splits
            else CONFIG_SPLITS[config]
        )
        for split in requested_splits:
            if split not in CONFIG_SPLITS[config]:
                continue
            shards = find_shards(snapshot, config, split)
            if args.max_shards:
                shards = shards[:args.max_shards]
            if not shards:
                raise FileNotFoundError(
                    f"no {config}/{split} shards found under {snapshot}"
                )
            rows = []
            for index, shard in enumerate(shards, 1):
                if args.verify_checksums:
                    verify_shard(shard, snapshot, checksums)
                rows.extend(process_shard(shard, args.output))
                print(
                    f"{config}/{split}: {index}/{len(shards)} "
                    f"shards, {len(rows)} records",
                    flush=True,
                )
            if config == "clean" and split == "train":
                validate_training_voices(rows)
            name = (
                f"{split}.jsonl"
                if config == "clean"
                else f"{split}_hard.jsonl"
            )
            write_manifest(args.output / "manifests" / name, rows)
            statistics[f"{config}/{split}"] = len(rows)
            all_rows.extend(rows)

    if args.risbench_root:
        verify_risbench(all_rows, args.risbench_root)
        print("RISBench image/mask verification passed.", flush=True)
    (args.output / "stats.json").write_text(
        json.dumps(statistics, indent=2) + "\n", encoding="utf-8"
    )
    print(json.dumps(statistics, indent=2))


if __name__ == "__main__":
    main()
