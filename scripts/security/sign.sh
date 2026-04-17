#!/bin/bash
set -e

PROJECT_DIR=$(pwd)
COMPOSE_FILE="${PROJECT_DIR}/DevSecOps-tools/docker-compose.yml"


SIGN_TARGET="${IMAGE_DIGEST:-${REGISTRY}/${IMAGE_NAME}:${IMAGE_TAG}}"

echo "🔏 Signing: ${SIGN_TARGET}"

docker compose -f "$COMPOSE_FILE" run --rm \
  -e COSIGN_PASSWORD="${COSIGN_PASSWORD}" \
  -e DOCKER_CONFIG=/tmp \
  cosign sign \
  --key /app/cosign.key \
  "${SIGN_TARGET}"

echo "✅ Image signed."