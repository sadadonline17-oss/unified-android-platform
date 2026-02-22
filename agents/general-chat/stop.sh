#!/bin/bash
AGENT_DIR="$(cd "$(dirname "$0")" && pwd)"
PID_FILE="$AGENT_DIR/.agent.pid"
AGENT_NAME="$(basename "$AGENT_DIR")"
if [ -f "$PID_FILE" ]; then
    PID=$(cat "$PID_FILE")
    kill "$PID" 2>/dev/null && echo "$AGENT_NAME stopped (PID $PID)" || echo "$AGENT_NAME was not running"
    rm -f "$PID_FILE"
else
    echo "No PID file for $AGENT_NAME"
fi
