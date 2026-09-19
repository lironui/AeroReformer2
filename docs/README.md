# Project page

Static GitHub Pages site. Serve this directory with any static web server;
there are no frontend packages or build steps.

## Revised-paper examples

The viewer contains the paper's six clean successes, six clean failures, six
Aerial-D / Qwen3-TTS examples and six human-speech examples. Each case includes
the original paired 16-kHz mono PCM WAV, RGB, ground truth, and saved predictions
from AeroReformer2-Swin-B, AeroReformer2-ResNet-101 and the LSCF audio adapter.
The homepage uses `test_014110`, including its actual referring expression.
Waveforms are derived from the audio samples. No new inference is performed.

`cases.js` holds descriptions, original paper scores and media paths.
`assets/examples/provenance.json` records source-relative paths and SHA-256
hashes. No machine-specific absolute paths are published. The media exporter
verifies the original figure audit hashes before writing assets:

```sh
python scripts/build_project_media.py --source-root /path/to/AVSBench
```

Run that command from the repository root with Pillow and NumPy installed.
The research source datasets, prediction exports and figure audits must be
available under the source root; they are not bundled with this repository.

RGB is encoded as WebP. Binary masks are retained as lossless PNGs. Colored
RGBA overlays add a translucent fill and foreground boundary without changing
mask geometry. Layers share the full image field of view; nothing is cropped.
External predictions exported at 800 × 800 are scaled to the same display area
as the RGB crop. The external IoUs are the original 352 × 352 evaluation
results, not scores recomputed from display images. Clean-case IoUs retain the
native-mask evaluation used in the paper's figure audits.

All examples are selected illustrations; selection does not support an
unbiased comparison or an estimate of failure frequency. The benchmark table
reports the paper's aggregate mIoU. Human10 is an exploratory ten-case paired
study, separate from the full Qwen100 evaluation. Source imagery and audio
retain their upstream terms; the repository's code license does not replace
those terms.

Six complete comparison figures are available under `assets/results/`:
clean successes, clean failures, paired noise/SNR, three-model noisy-speech
comparison, Qwen100, and human-recorded speech. Original figure pixels are
copied from the revised paper assets.
