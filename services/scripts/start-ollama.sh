#!/bin/bash
PROJECT_DIR="$(cd "$(dirname "$0")/../.." && pwd)"
PID_FILE="$PROJECT_DIR/services/.ollama.pid"

export OLLAMA_HOST="0.0.0.0:11434"

echo "Starting Ollama service..."
nohup ollama serve > "$PROJECT_DIR/services/ollama.log" 2>&1 &
echo $! > "$PID_FILE"
echo "Ollama started (PID: $(cat "$PID_FILE"))"
