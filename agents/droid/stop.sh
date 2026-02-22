#!/bin/bash
AGENT_DIR="$(cd "$(dirname "$0")" && pwd)"; PID_FILE="$AGENT_DIR/.agent.pid"
[ -f "$PID_FILE" ] && { kill "$(cat "$PID_FILE")" 2>/dev/null; rm -f "$PID_FILE"; echo "$(basename "$AGENT_DIR") stopped"; } || echo "Not running"
