#!/bin/bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/../.." && pwd)"

COSIGN_DIR="${PROJECT_ROOT}/DevSecOps-tools/cosign"
COMPOSE_FILE="${PROJECT_ROOT}/DevSecOps-tools/docker-compose.yml"

echo "🔎 Verifying: ${IMAGE_NAME}:${IMAGE_TAG}"

test -f "${COSIGN_DIR}/cosign.pub" || { echo "❌ Missing cosign.pub at ${COSIGN_DIR}"; exit 1; }

docker compose -f "$COMPOSE_FILE" run --rm \
  -v "${COSIGN_DIR}/cosign.pub:/signing/cosign.pub:ro" \
  cosign \
  verify \
  --key /signing/cosign.pub \
  "${IMAGE_NAME}:${IMAGE_TAG}"

echo "✅ Signature verified."