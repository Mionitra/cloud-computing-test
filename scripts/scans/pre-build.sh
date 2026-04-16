#!/bin/bash
set -e

PROJECT_DIR=$(pwd)
COMPOSE_FILE="${PROJECT_DIR}/DevSecOps-tools/docker-compose.yml"
TOOLS_DIR="${PROJECT_DIR}/DevSecOps-tools"

# This is what the container sees as /app/security-reports/pre-build/
mkdir -p "${TOOLS_DIR}/security-reports/pre-build"
mkdir -p "${TOOLS_DIR}/security-reports/build"

echo "🔐 Running PRE-BUILD security scans..."

# Bandit
echo "▶ Running Bandit..."
docker compose -f "$COMPOSE_FILE" run --rm bandit \
  -r /app/src \
  -f json \
  -o /app/security-reports/pre-build/bandit.json || true
echo "✅ Bandit done"

# Semgrep
echo "▶ Running Semgrep..."
docker compose -f "$COMPOSE_FILE" run --rm semgrep \
  scan --config auto --json \
  --output /app/security-reports/pre-build/semgrep.json \
  /app/src || true
echo "✅ Semgrep done"

# Gitleaks - --no-git because the container has no git binary
echo "▶ Running Gitleaks..."
docker compose -f "$COMPOSE_FILE" run --rm gitleaks \
  detect \
  --source /app \
  --no-git \
  --report-format json \
  --report-path /app/security-reports/pre-build/gitleaks.json || true
echo "✅ Gitleaks done"

echo "✅ PRE-BUILD scans complete. Reports in ${REPORTS_DIR}/pre-build"