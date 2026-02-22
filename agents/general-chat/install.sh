#!/bin/bash
AGENT_DIR="$(cd "$(dirname "$0")" && pwd)"
AGENT_NAME="$(basename "$AGENT_DIR")"
MODEL=$(python3 -c "import json; print(json.load(open('$AGENT_DIR/agent.json'))['required_model'])" 2>/dev/null || echo "llama3")

echo "=== Installing $AGENT_NAME ==="
echo "Required model: $MODEL"

if command -v ollama &>/dev/null; then
    if ! ollama list 2>/dev/null | grep -q "$MODEL"; then
        echo "Pulling model $MODEL..."
        ollama pull "$MODEL" || echo "Warning: Could not pull $MODEL (may be a cloud model)"
    else
        echo "Model $MODEL already available"
    fi
else
    echo "Warning: ollama not found. Install ollama first."
fi

echo "$AGENT_NAME installed successfully"
