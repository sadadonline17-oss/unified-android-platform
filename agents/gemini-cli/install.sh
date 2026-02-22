#!/bin/bash
AGENT_DIR="$(cd "$(dirname "$0")" && pwd)"; AGENT_NAME="$(basename "$AGENT_DIR")"
MODEL=$(python3 -c "import json; print(json.load(open('$AGENT_DIR/agent.json'))['required_model'])" 2>/dev/null || echo "unknown")
echo "Installing $AGENT_NAME (model: $MODEL)"
command -v ollama &>/dev/null && { ollama list 2>/dev/null | grep -q "$MODEL" && echo "Model ready" || { ollama pull "$MODEL" 2>/dev/null || echo "Cloud/unavailable: $MODEL"; }; } || echo "ollama not found"
echo "$AGENT_NAME installed"
