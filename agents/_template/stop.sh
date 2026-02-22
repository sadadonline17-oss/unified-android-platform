#!/bin/bash
# Agent Stop Script
AGENT_DIR="$(cd "$(dirname "$0")" && pwd)"
AGENT_NAME="$(basename "$AGENT_DIR")"
PID_FILE="$AGENT_DIR/.agent.pid"

echo "Stopping agent: $AGENT_NAME"

if [ -f "$PID_FILE" ]; then
    PID=$(cat "$PID_FILE")
    if kill -0 "$PID" 2>/dev/null; then
        kill "$PID"
        echo "Agent $AGENT_NAME (PID $PID) stopped"
    else
        echo "Agent $AGENT_NAME was not running"
    fi
    rm -f "$PID_FILE"
else
    echo "No PID file found for $AGENT_NAME"
fi
