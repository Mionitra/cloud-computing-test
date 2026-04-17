#!/bin/bash
set -e

PROJECT_DIR=$(pwd)
COMPOSE_FILE="${PROJECT_DIR}/DevSecOps-tools/docker-compose.yml"

# Always rebuild full image reference with registry
SIGN_TARGET="${REGISTRY}/${IMAGE_NAME}@${IMAGE_DIGEST##*@}"

echo "🔏 Signing: ${SIGN_TARGET}"

docker compose -f "$COMPOSE_FILE" run --rm \
  -e COSIGN_PASSWORD="${COSIGN_PASSWORD}" \
  -v ${PROJECT_DIR}/cosign:/app \
  -v $HOME/.docker:/root/.docker \
  cosign sign \
  --key /app/cosign.key \
  "${SIGN_TARGET}"

echo "✅ Image signed."