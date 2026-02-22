#!/bin/bash
PROJECT_DIR="$(cd "$(dirname "$0")/../.." && pwd)"
PID_FILE="$PROJECT_DIR/services/.gateway.pid"

export PORT=3000
export NODE_ENV=production

echo "Starting Gateway service..."
nohup node "$PROJECT_DIR/backend/gateway/index.js" > "$PROJECT_DIR/services/gateway.log" 2>&1 &
echo $! > "$PID_FILE"
echo "Gateway started (PID: $(cat "$PID_FILE"))"
