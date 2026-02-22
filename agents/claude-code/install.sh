#!/bin/bash
AGENT_DIR="$(cd "$(dirname "$0")" && pwd)"; echo "Installing $(basename "$AGENT_DIR")"
MODEL=$(python3 -c "import json; print(json.load(open('$AGENT_DIR/agent.json'))['required_model'])" 2>/dev/null || echo "unknown")
echo "Required: $MODEL (cloud model - no local pull needed)"
echo "$(basename "$AGENT_DIR") installed"
