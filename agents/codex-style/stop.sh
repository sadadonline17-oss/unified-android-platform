#!/bin/bash
AGENT_DIR="$(cd "$(dirname "$0")" && pwd)"; PID_FILE="$AGENT_DIR/.agent.pid"
AGENT_NAME="$(basename "$AGENT_DIR")"
[ -f "$PID_FILE" ] && { PID=$(cat "$PID_FILE"); kill "$PID" 2>/dev/null && echo "$AGENT_NAME stopped" || echo "not running"; rm -f "$PID_FILE"; } || echo "No PID file"
