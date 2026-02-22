#!/bin/bash
# Agent Install Script
AGENT_DIR="$(cd "$(dirname "$0")" && pwd)"
AGENT_NAME="$(basename "$AGENT_DIR")"

echo "Installing agent: $AGENT_NAME"

# Check if required model is available
if command -v ollama &> /dev/null; then
    MODEL=$(python3 -c "import json; print(json.load(open('$AGENT_DIR/agent.json'))['required_model'])" 2>/dev/null || echo "llama3")
    echo "Checking model: $MODEL"
    if ! ollama list 2>/dev/null | grep -q "$MODEL"; then
        echo "Model $MODEL not found. Pull with: ollama pull $MODEL"
    else
        echo "Model $MODEL is available"
    fi
fi

echo "Agent $AGENT_NAME installed successfully"
