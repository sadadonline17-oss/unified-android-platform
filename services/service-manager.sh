#!/bin/bash
# Service Manager CLI

PROJECT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
AGENTS_DIR="$PROJECT_DIR/agents"
SERVICES_DIR="$PROJECT_DIR/services"

usage() {
    echo "Usage: $0 <command> <agent_name>"
    echo "Commands:"
    echo "  install_agent <name>"
    echo "  start_agent   <name>"
    echo "  stop_agent    <name>"
    echo "  restart_agent <name>"
    echo "  status_agent  <name>"
    echo "  view_logs     <name>"
    exit 1
}

[ $# -lt 2 ] && usage

COMMAND=$1
AGENT_NAME=$2
AGENT_PATH="$AGENTS_DIR/$AGENT_NAME"

if [ ! -d "$AGENT_PATH" ] && [ "$COMMAND" != "install_agent" ]; then
    echo "Error: Agent '$AGENT_NAME' not found in $AGENTS_DIR"
    exit 1
fi

case "$COMMAND" in
    install_agent)
        if [ -f "$AGENT_PATH/install.sh" ]; then
            bash "$AGENT_PATH/install.sh"
        else
            echo "No install.sh found for $AGENT_NAME"
        fi
        ;;
    start_agent)
        if [ -f "$AGENT_PATH/start.sh" ]; then
            bash "$AGENT_PATH/start.sh" &
        else
            echo "No start.sh found for $AGENT_NAME"
        fi
        ;;
    stop_agent)
        if [ -f "$AGENT_PATH/stop.sh" ]; then
            bash "$AGENT_PATH/stop.sh"
        else
            echo "No stop.sh found for $AGENT_NAME"
        fi
        ;;
    restart_agent)
        $0 stop_agent "$AGENT_NAME"
        sleep 1
        $0 start_agent "$AGENT_NAME"
        ;;
    status_agent)
        if [ -f "$AGENT_PATH/.agent.pid" ]; then
            PID=$(cat "$AGENT_PATH/.agent.pid")
            if kill -0 "$PID" 2>/dev/null; then
                echo "Agent '$AGENT_NAME' is running (PID: $PID)"
            else
                echo "Agent '$AGENT_NAME' is NOT running (stale PID file)"
            fi
        else
            echo "Agent '$AGENT_NAME' is stopped"
        fi
        ;;
    view_logs)
        LOG_FILE="$AGENT_PATH/agent.log"
        if [ -f "$LOG_FILE" ]; then
            tail -f "$LOG_FILE"
        else
            echo "No log file found for $AGENT_NAME"
        fi
        ;;
    *)
        usage
        ;;
esac
