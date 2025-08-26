#!/usr/bin/env bash
set -euo pipefail
STAMP="$(date +%Y%m%d-%H%M%S)"
OUT="backups/milvus-${STAMP}.tar.gz"
cd "$(dirname "$0")/../.."
(cd infra && docker compose ps >/dev/null)
tar -czf "${OUT}" volumes
echo "${OUT}"
