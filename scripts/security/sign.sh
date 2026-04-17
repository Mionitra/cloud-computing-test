#!/bin/bash
set -euo pipefail

echo "🔏 Starting image signing..."

# --- Resolve paths (robust for Jenkins + local) ---
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/../.." && pwd)"

COSIGN_DIR="${PROJECT_ROOT}/DevSecOps-tools/cosign"
COMPOSE_FILE="${PROJECT_ROOT}/DevSecOps-tools/docker-compose.yml"

# --- Validate inputs ---
if [ -z "${IMAGE_DIGEST:-}" ]; then
  echo "❌ IMAGE_DIGEST is not set"
  exit 1
fi

if [ -z "${COSIGN_PASSWORD:-}" ]; then
  echo "❌ COSIGN_PASSWORD is not set"
  exit 1
fi

if [ ! -f "${COSIGN_DIR}/cosign.key" ]; then
  echo "❌ cosign.key not found at ${COSIGN_DIR}/cosign.key"
  exit 1
fi

# --- Build target (digest format required) ---
SIGN_TARGET="${IMAGE_DIGEST}"

echo "📍 Using key: ${COSIGN_DIR}/cosign.key"
echo "📦 Signing: ${SIGN_TARGET}"

# --- Sign image ---
docker compose -f "${COMPOSE_FILE}" run --rm \
  -e COSIGN_PASSWORD="${COSIGN_PASSWORD}" \
  -v "${COSIGN_DIR}:/app" \
  -v "$HOME/.docker:/root/.docker" \
  cosign sign \
  --key /app/cosign.key \
  "${SIGN_TARGET}"

echo "✅ Image signed successfully."