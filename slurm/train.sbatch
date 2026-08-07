#!/bin/bash
#SBATCH --job-name=aero-train
#SBATCH --partition=mit_normal_gpu
#SBATCH --gres=gpu:l40s:1
#SBATCH --nodes=1
#SBATCH --ntasks=1
#SBATCH --cpus-per-task=8
#SBATCH --mem=96G
#SBATCH --time=12:00:00
#SBATCH --output=logs/%x-%j.out
#SBATCH --error=logs/%x-%j.err

set -euo pipefail

module purge
module load miniforge
source activate aeroreformer2

PROJECT="${PROJECT:-$HOME/AeroReformer2}"
MODEL="${MODEL:-aeroreformer2_swin_b}"
SEED="${SEED:-20260721}"
DATA_ROOT="${DATA_ROOT:-$HOME/orcd/scratch/VoiceAeroRef}"
RISBENCH_ROOT="${RISBENCH_ROOT:-$HOME/orcd/scratch/RISBench}"
RUN="${RUN:-$HOME/orcd/pool/aeroreformer2_runs/${MODEL}_${SEED}}"
BATCH_SIZE="${BATCH_SIZE:-4}"

mkdir -p "$PROJECT/logs" "$RUN"
cd "$PROJECT"

srun python -u -m aeroreformer2.train \
  --model "$MODEL" \
  --audio-encoder wav2vec2 \
  --risbench-root "$RISBENCH_ROOT" \
  --audio-root "$DATA_ROOT" \
  --train-manifest "$DATA_ROOT/manifests/train.jsonl" \
  --val-manifest "$DATA_ROOT/manifests/validation.jsonl" \
  --backend auto \
  --output "$RUN" \
  --epochs 40 \
  --batch-size "$BATCH_SIZE" \
  --workers 8 \
  --image-size 352 \
  --lr 2e-4 \
  --backbone-lr 2e-5 \
  --seed "$SEED" \
  --device cuda

