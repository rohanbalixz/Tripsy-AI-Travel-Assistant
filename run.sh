#!/usr/bin/env bash
set -e

BACKEND_PORT=8012
FRONTEND_PORT=3000

pkill -f "uvicorn tripsy.main:app" 2>/dev/null || true
pkill -f "next dev" 2>/dev/null || true

nohup uvicorn tripsy.main:app --host 127.0.0.1 --port $BACKEND_PORT --reload > backend.log 2>&1 &

sleep 3

NEXT_PUBLIC_TRIPSY_API="http://127.0.0.1:$BACKEND_PORT" \
  nohup npm run dev -- -p $FRONTEND_PORT > frontend.log 2>&1 &

echo "Backend → http://127.0.0.1:$BACKEND_PORT"
echo "Frontend → http://127.0.0.1:$FRONTEND_PORT"
