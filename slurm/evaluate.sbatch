#!/bin/bash
#SBATCH --job-name=aero-eval
#SBATCH --partition=mit_normal_gpu
#SBATCH --gres=gpu:l40s:1
#SBATCH --nodes=1
#SBATCH --ntasks=1
#SBATCH --cpus-per-task=8
#SBATCH --mem=64G
#SBATCH --time=06:00:00
#SBATCH --output=logs/%x-%j.out
#SBATCH --error=logs/%x-%j.err

set -euo pipefail

module purge
module load miniforge
source activate aeroreformer2

PROJECT="${PROJECT:-$HOME/AeroReformer2}"
DATA_ROOT="${DATA_ROOT:-$HOME/orcd/scratch/VoiceAeroRef}"
RISBENCH_ROOT="${RISBENCH_ROOT:-$HOME/orcd/scratch/RISBench}"
CHECKPOINT="${CHECKPOINT:?Set CHECKPOINT=/path/to/best.pt}"
OUTPUT="${OUTPUT:-$HOME/orcd/pool/aeroreformer2_results}"

mkdir -p "$PROJECT/logs" "$OUTPUT"
cd "$PROJECT"

srun python -u -m aeroreformer2.evaluate \
  --checkpoint "$CHECKPOINT" \
  --manifests clean="$DATA_ROOT/manifests/test.jsonl" \
  --risbench-root "$RISBENCH_ROOT" \
  --audio-root "$DATA_ROOT" \
  --backend auto \
  --output "$OUTPUT/metrics.json" \
  --prediction-root "$OUTPUT/predictions" \
  --batch-size 8 \
  --workers 8 \
  --device cuda
