from __future__ import annotations

import io
import json
import tarfile
import tempfile
import unittest
import wave
from pathlib import Path

import numpy as np
import torch
from PIL import Image

from aeroreformer2.data import VoiceAeroRefDataset
from aeroreformer2.metrics import METRIC_KEYS, SegmentationMetrics
from aeroreformer2.model import MODEL_NAMES, build_model
from scripts.prepare_voiceaeroref import process_shard


def wav_bytes(samples: int = 1600) -> bytes:
    buffer = io.BytesIO()
    values = (np.sin(np.arange(samples) * 0.1) * 1000).astype("<i2")
    with wave.open(buffer, "wb") as handle:
        handle.setnchannels(1)
        handle.setsampwidth(2)
        handle.setframerate(16000)
        handle.writeframes(values.tobytes())
    return buffer.getvalue()


class ReleaseTests(unittest.TestCase):
    def test_release_contains_only_aeroreformer2(self):
        self.assertEqual(
            MODEL_NAMES,
            ("aeroreformer2_resnet101", "aeroreformer2_swin_b"),
        )
        with self.assertRaises(ValueError):
            build_model(
                "unet",
                audio_encoder_name="conv",
                pretrained_backbone=False,
            )
        with self.assertRaises(ValueError):
            build_model(
                "aeroreformer2_swin_b",
                audio_encoder_name="conv",
                pretrained_backbone=False,
                aeroreformer2_variant="no_detail_path",
            )

    def test_both_backbones_forward(self):
        for architecture in MODEL_NAMES:
            with self.subTest(architecture=architecture):
                model = build_model(
                    architecture,
                    audio_encoder_name="conv",
                    audio_dim=16,
                    pretrained_backbone=False,
                ).eval()
                with torch.inference_mode():
                    output = model(
                        torch.randn(1, 3, 64, 64),
                        torch.randn(1, 1600),
                        torch.tensor([1600]),
                    )
                self.assertEqual(tuple(output.shape), (1, 1, 64, 64))
                self.assertTrue(torch.isfinite(output).all())

    def test_all_pr_thresholds(self):
        target = torch.tensor([[[[0.0, 1.0], [1.0, 0.0]]]])
        logits = torch.where(
            target > 0, torch.tensor(10.0), torch.tensor(-10.0)
        )
        metrics = SegmentationMetrics()
        metrics.update(logits, target)
        result = metrics.compute()
        self.assertEqual(tuple(result), METRIC_KEYS)
        self.assertTrue(all(value == 1.0 for value in result.values()))

    def test_webdataset_extraction_and_files_loader(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            shard = root / "test-00000.tar"
            metadata = {
                "sample_id": "test_000000",
                "source_index": 0,
                "image": "img_rgb/test_0.png",
                "mask": "mask/test_0.png",
                "phrase": "the plane",
                "voice_id": "us_female",
                "__key__": "test_000000__us_female",
                "source_audio_path":
                    "audio/clean/test/us_female/test_000000.wav",
            }
            with tarfile.open(shard, "w") as archive:
                for name, payload in (
                    ("test_000000__us_female.wav", wav_bytes()),
                    (
                        "test_000000__us_female.json",
                        json.dumps(metadata).encode(),
                    ),
                ):
                    info = tarfile.TarInfo(name)
                    info.size = len(payload)
                    archive.addfile(info, io.BytesIO(payload))
            output = root / "prepared"
            rows = process_shard(shard, output)
            manifest = output / "manifests/test.jsonl"
            manifest.parent.mkdir(parents=True)
            manifest.write_text(json.dumps(rows[0]) + "\n", encoding="utf-8")
            risbench = root / "RISBench"
            (risbench / "rgb").mkdir(parents=True)
            (risbench / "mask").mkdir()
            Image.new("RGB", (16, 16), "white").save(
                risbench / "rgb/test_0.png"
            )
            Image.new("L", (16, 16), 255).save(
                risbench / "mask/test_0.png"
            )
            dataset = VoiceAeroRefDataset(
                manifest,
                risbench,
                output,
                image_size=32,
                max_audio_seconds=0.2,
                backend="files",
            )
            sample = dataset[0]
            dataset.close()
        self.assertEqual(tuple(sample["image"].shape), (3, 32, 32))
        self.assertEqual(tuple(sample["mask"].shape), (1, 32, 32))
        self.assertEqual(len(sample["audio"]), 3200)


if __name__ == "__main__":
    unittest.main()

