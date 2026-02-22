#!/bin/bash
AGENT_DIR="$(cd "$(dirname "$0")" && pwd)"; PID_FILE="$AGENT_DIR/.agent.pid"; AGENT_NAME="$(basename "$AGENT_DIR")"
[ -f "$PID_FILE" ] && { kill "$(cat "$PID_FILE")" 2>/dev/null; rm -f "$PID_FILE"; echo "$AGENT_NAME stopped"; } || echo "Not running"
