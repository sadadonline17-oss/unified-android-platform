#!/bin/bash
# Agent Start Script
AGENT_DIR="$(cd "$(dirname "$0")" && pwd)"
AGENT_NAME="$(basename "$AGENT_DIR")"
PID_FILE="$AGENT_DIR/.agent.pid"

echo "Starting agent: $AGENT_NAME"

OLLAMA_HOST="${OLLAMA_HOST:-http://localhost:11434}"
AGENT_MODEL="${AGENT_MODEL:-llama3}"

echo "Using model: $AGENT_MODEL"
echo "Ollama endpoint: $OLLAMA_HOST"

# Write PID
echo $$ > "$PID_FILE"

# Agent main loop - waits for input on stdin
while IFS= read -r line; do
    if [ -n "$line" ]; then
        curl -s "$OLLAMA_HOST/api/chat" \
            -d "{\"model\":\"$AGENT_MODEL\",\"messages\":[{\"role\":\"user\",\"content\":\"$line\"}],\"stream\":false}" \
            2>/dev/null | python3 -c "import sys,json; print(json.load(sys.stdin).get('message',{}).get('content',''))" 2>/dev/null
    fi
done

echo "Agent $AGENT_NAME stopped"
