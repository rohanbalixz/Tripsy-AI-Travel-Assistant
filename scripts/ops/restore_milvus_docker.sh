#!/usr/bin/env bash
set -euo pipefail
ARCHIVE="${1:-}"; [ -f "$ARCHIVE" ] || { echo "usage: $0 backups/FILE.tar.gz"; exit 1; }
cd "$(dirname "$0")/../.."
(cd infra && docker compose down) || true
STAMP="$(date +%Y%m%d-%H%M%S)"
tar -tzf "$ARCHIVE" >/dev/null
mv volumes "volumes.old-${STAMP}"
mkdir -p /tmp/mrestore && tar -xzf "$ARCHIVE" -C /tmp/mrestore
mv /tmp/mrestore/volumes volumes
(cd infra && docker compose up -d)
echo "restore complete"
