"""Export the paper's saved examples for the static project page; no inference.

Usage: python scripts/build_project_media.py --source-root D:/AVSBench
Requires Pillow and numpy. Source assets are local research artifacts, not
included in this code release. Scores retain the paper's evaluation resolution.
"""
import argparse
import hashlib
import json
import shutil
import wave
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter


def sha(path):
    return hashlib.sha256(Path(path).read_bytes()).hexdigest()


def build(root, docs):
    generated = root / 'paper_labcnet/generated'
    success = json.loads((generated / 'qualitative_revision_20260915/success_six_scenes_audit.json').read_text())
    failure = json.loads((generated / 'qualitative_revision_20260915/selection_audit.json').read_text())
    external = json.loads((generated / 'aeriald_qualitative_20260916/selection_audit.json').read_text())
    manifest = {r['sample_id']: r for r in map(json.loads, (root / 'AudioRISBench/manifests/test.jsonl').read_text().splitlines())}
    methods = {'swin': 'aeroreformer2_swin_b_full_20260805', 'resnet': 'aeroreformer2_resnet101_full_20260805', 'lscf': 'lscf2025_swin_b_audio_adapter_full_20260721'}
    records = []
    failure_titles = ['Tennis court · wrong target', 'Service area · wrong target', 'Ship · incomplete coverage', 'Stadium · incomplete coverage', 'Courts · extra foreground', 'Bridge · extra foreground']
    for group, rows in [('success', success['records']), ('failure', failure['records'][3:])]:
        for i, r in enumerate(rows):
            meta = manifest[r['sample_id']]
            assert meta['phrase'].strip() == r['phrase']
            sources = {k: Path(v['path']) for k, v in r['sources'].items()}
            for k, v in r['sources'].items():
                assert sha(v['path']) == v['sha256'], (r['sample_id'], k)
            records.append(dict(id=r['sample_id'], group=group, title=r['category'] if group == 'success' else failure_titles[i],
                phrase=r['phrase'], speech='VoiceAeroRef · synthesized speech',
                image=sources['image'], gt=sources['ground_truth'], audio=root / 'AudioRISBench' / meta['audio'],
                predictions={k: sources[v] for k, v in methods.items()}, scores={k: r['scores'][v] for k, v in methods.items()},
                metric='Paper IoU at native mask resolution.'))
    for group, kind in [('external', 'synthetic'), ('human', 'human')]:
        for r in external[kind]['records']:
            paths = {'image': r['image'], 'mask': r['mask'], 'audio': r['audio'], **r['preds']}
            for k, v in paths.items():
                assert sha(v) == r['sha256'][k], (r['sample_id'], k)
            names = {'swin': 'Swin-B', 'resnet': 'ResNet101', 'lscf': 'LSCF'}
            records.append(dict(id=r['sample_id'], group=group, title=r['title'], phrase=r['phrase'],
                speech='Aerial-D · ' + ('Qwen3-TTS speech' if kind == 'synthetic' else 'human-recorded speech'),
                image=Path(r['image']), gt=Path(r['mask']), audio=Path(r['audio']),
                predictions={k: Path(r['preds'][v]) for k, v in names.items()}, scores={k: r['scores'][v] for k, v in names.items()},
                metric='Paper IoU evaluated at 352 × 352; exported 800 × 800 masks are used for display.'))
    assets = docs / 'assets/examples'
    assets.mkdir(parents=True, exist_ok=True)
    public, audit = [], []
    colors = {'gt': (93, 238, 139), 'swin': (66, 222, 232), 'resnet': (151, 163, 255), 'lscf': (255, 177, 79)}
    for r in records:
        key = r['group'] + '-' + r['id']
        dest = assets / key
        dest.mkdir(exist_ok=True)
        rgb = Image.open(r['image']).convert('RGB')
        rgb.save(dest / 'rgb.webp', quality=92, method=6)
        masks = {'gt': r['gt'], **r['predictions']}
        for name, path in masks.items():
            raw = Image.open(path).convert('L')
            # External predictions are exported at 800px, while RGB/GT crops
            # can be 480px. They share the complete field of view; the browser
            # scales the layers together without cropping or changing scores.
            assert raw.width * rgb.height == raw.height * rgb.width, (key, name)
            binary = raw.point(lambda p: 255 if p >= 128 else 0)
            binary.save(dest / (name + '-mask.png'), optimize=True)
            edge = np.asarray(binary) != np.asarray(binary.filter(ImageFilter.MinFilter(3)))
            alpha = np.where(edge, 245, np.where(np.asarray(binary) > 0, 125, 0)).astype('uint8')
            overlay = Image.new('RGBA', binary.size, colors[name] + (0,))
            overlay.putalpha(Image.fromarray(alpha))
            overlay.save(dest / (name + '-overlay.png'), optimize=True)
        shutil.copyfile(r['audio'], dest / 'query.wav')
        with wave.open(str(r['audio']), 'rb') as w:
            assert w.getnchannels() == 1 and w.getframerate() == 16000 and w.getsampwidth() == 2
            duration = w.getnframes() / w.getframerate()
            signal = np.frombuffer(w.readframes(w.getnframes()), dtype='<i2').astype(float)
        peaks = np.array([np.max(np.abs(chunk)) for chunk in np.array_split(signal, 80)])
        heights = 3 + peaks / max(peaks.max(), 1) * 45
        bars = ''.join(f'<rect x="{i*5}" y="{(52-h)/2:.2f}" width="2.8" height="{h:.2f}" rx="1.4"/>' for i, h in enumerate(heights))
        (dest / 'waveform.svg').write_text(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 52"><g fill="#e6612d">{bars}</g></svg>')
        public.append({k: r[k] for k in ['id', 'group', 'title', 'phrase', 'speech', 'scores', 'metric']} | dict(base='assets/examples/' + key, duration=round(duration, 2), width=rgb.width, height=rgb.height))
        audit.append(dict(id=r['id'], group=r['group'], sources={k: dict(path=str(Path(v).relative_to(root)).replace('\\', '/'), sha256=sha(v)) for k, v in {'image':r['image'],'gt':r['gt'],'audio':r['audio'],**r['predictions']}.items()}))
    data = json.dumps(public, ensure_ascii=False, indent=2).replace('<', '\\u003c')
    (docs / 'cases.js').write_text('window.PROJECT_CASES = ' + data + ';\n', encoding='utf-8')
    (assets / 'provenance.json').write_text(json.dumps(dict(note='Saved predictions and paired audio from the revised paper. Display overlays only; no new inference or metric recomputation.', records=audit), indent=2), encoding='utf-8')
    figures = ['qualitative_success_six_scenes', 'qualitative_failure_cases', 'paired_snr_failure_groups', 'paired_snr_three_model_comparison', 'aeriald_qwen100_success_six_scenes', 'aeriald_human_six_scenes']
    for name in figures:
        shutil.copyfile(root / 'paper_labcnet/figures' / (name + '.png'), docs / 'assets/results' / (name + '.png'))
    shutil.copyfile(root / 'paper_labcnet/figures/aeroreformer2.png', docs / 'assets/aeroreformer2.png')
    print(f'Exported {len(public)} cases with verified source hashes, RGB, four masks/overlays, paired 16-kHz audio, and measured waveforms; copied six paper figures.')


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--source-root', required=True, type=Path)
    args = parser.parse_args()
    build(args.source_root, Path(__file__).resolve().parents[1] / 'docs')
