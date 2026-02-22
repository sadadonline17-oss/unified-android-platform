#!/bin/bash
# Daemon for background monitoring of services

PROJECT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
SERVICES_DIR="$PROJECT_DIR/services"

echo "Starting Unified Platform Daemon..."

while true; do
    # Health check for essential services
    for config in "$SERVICES_DIR"/configs/*.json; do
        SERVICE_NAME=$(basename "$config" .service.json)
        PID_FILE="$SERVICES_DIR/.$SERVICE_NAME.pid"

        if [ -f "$PID_FILE" ]; then
            PID=$(cat "$PID_FILE")
            if ! kill -0 "$PID" 2>/dev/null; then
                echo "[$(date)] Service $SERVICE_NAME crashed! Restarting..."
                bash "$SERVICES_DIR/scripts/start-$SERVICE_NAME.sh" &
            fi
        fi
    done
    sleep 10
done
