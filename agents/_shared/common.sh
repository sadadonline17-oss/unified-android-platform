#!/bin/bash
# Generic Agent Scripts Generator
# Creates install.sh, start.sh, stop.sh for agents that don't have custom ones
# Each agent auto-reads its model from agent.json

AGENT_DIR="$(cd "$(dirname "$0")" && pwd)"
AGENT_NAME="$(basename "$AGENT_DIR")"

get_model() {
    python3 -c "import json; print(json.load(open('$AGENT_DIR/agent.json'))['required_model'])" 2>/dev/null || echo "llama3"
}

get_system_prompt() {
    python3 -c "import json; print(json.load(open('$AGENT_DIR/agent.json')).get('config',{}).get('system_prompt','You are a helpful assistant.'))" 2>/dev/null || echo "You are a helpful assistant."
}
