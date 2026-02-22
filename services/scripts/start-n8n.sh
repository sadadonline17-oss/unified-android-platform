#!/bin/bash
PROJECT_DIR="$(cd "$(dirname "$0")/../.." && pwd)"
PID_FILE="$PROJECT_DIR/services/.n8n.pid"

export N8N_PORT=5678
export WEBHOOK_URL="http://localhost:5678/"

echo "Starting n8n service..."
nohup npx n8n start > "$PROJECT_DIR/services/n8n.log" 2>&1 &
echo $! > "$PID_FILE"
echo "n8n started (PID: $(cat "$PID_FILE"))"
