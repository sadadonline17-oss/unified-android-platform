#!/bin/bash
PROJECT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
SERVICES_DIR="$PROJECT_DIR/services"

echo "Starting all platform services..."

bash "$SERVICES_DIR/scripts/start-ollama.sh"
sleep 2
bash "$SERVICES_DIR/scripts/start-gateway.sh"
sleep 2
bash "$SERVICES_DIR/scripts/start-n8n.sh"

echo "Starting background daemon..."
nohup bash "$SERVICES_DIR/daemon.sh" > "$SERVICES_DIR/daemon.log" 2>&1 &
echo $! > "$SERVICES_DIR/.daemon.pid"

echo "Platform started successfully!"
