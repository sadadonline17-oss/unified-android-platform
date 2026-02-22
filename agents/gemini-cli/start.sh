#!/bin/bash
AGENT_DIR="$(cd "$(dirname "$0")" && pwd)"; PID_FILE="$AGENT_DIR/.agent.pid"; OLLAMA_HOST="${OLLAMA_HOST:-http://localhost:11434}"
AGENT_MODEL="${AGENT_MODEL:-$(python3 -c "import json; print(json.load(open('$AGENT_DIR/agent.json'))['required_model'])" 2>/dev/null || echo 'llama3')}"
echo "Starting $(basename "$AGENT_DIR") (model: $AGENT_MODEL)"; echo $$ > "$PID_FILE"
while IFS= read -r line; do [ -z "$line" ] && continue
curl -s "$OLLAMA_HOST/api/chat" -H "Content-Type: application/json" -d "{\"model\":\"$AGENT_MODEL\",\"messages\":[{\"role\":\"user\",\"content\":$(echo "$line" | python3 -c 'import json,sys; print(json.dumps(sys.stdin.read().strip()))')}],\"stream\":false}" 2>/dev/null | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('message',{}).get('content',''))" 2>/dev/null; done
