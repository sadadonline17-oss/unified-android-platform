#!/bin/bash
PROJECT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
CONFIG_FILE="$PROJECT_DIR/config/ollama.config.json"

echo "Pulling recommended models based on RAM..."

TIER=$(bash "$PROJECT_DIR/scripts/detect-ram.sh" | grep "Tier:" | awk '{print $2}')
MODEL=$(bash "$PROJECT_DIR/scripts/detect-ram.sh" | grep "Recommended Local Model:" | awk '{print $4}')

if [ -n "$MODEL" ]; then
    echo "Pulling $MODEL..."
    ollama pull "$MODEL"
else
    echo "Failed to detect recommended model."
fi
