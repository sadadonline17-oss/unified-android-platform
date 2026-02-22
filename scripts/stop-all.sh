#!/bin/bash
PROJECT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
SERVICES_DIR="$PROJECT_DIR/services"

echo "Stopping all platform services..."

# Stop daemon
if [ -f "$SERVICES_DIR/.daemon.pid" ]; then
    kill "$(cat "$SERVICES_DIR/.daemon.pid")" 2>/dev/null
    rm -f "$SERVICES_DIR/.daemon.pid"
    echo "Daemon stopped."
fi

# Stop gateway
if [ -f "$SERVICES_DIR/.gateway.pid" ]; then
    kill "$(cat "$SERVICES_DIR/.gateway.pid")" 2>/dev/null
    rm -f "$SERVICES_DIR/.gateway.pid"
    echo "Gateway stopped."
fi

# Stop n8n
if [ -f "$SERVICES_DIR/.n8n.pid" ]; then
    kill "$(cat "$SERVICES_DIR/.n8n.pid")" 2>/dev/null
    rm -f "$SERVICES_DIR/.n8n.pid"
    echo "n8n stopped."
fi

# Stop ollama
if [ -f "$SERVICES_DIR/.ollama.pid" ]; then
    kill "$(cat "$SERVICES_DIR/.ollama.pid")" 2>/dev/null
    rm -f "$SERVICES_DIR/.ollama.pid"
    echo "Ollama stopped."
fi

# Stop agents
for agent_dir in "$PROJECT_DIR"/agents/*/; do
    if [ -f "$agent_dir/stop.sh" ]; then
        bash "$agent_dir/stop.sh" >/dev/null 2>&1
    fi
done

echo "Platform stopped."
