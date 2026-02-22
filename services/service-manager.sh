#!/bin/bash
CMD=$1
AGENT=$2

case $CMD in
  start_agent)
    echo "Starting agent $AGENT..."
    ./agents/$AGENT/start.sh
    ;;
  stop_agent)
    echo "Stopping agent $AGENT..."
    ./agents/$AGENT/stop.sh
    ;;
  install_agent)
    echo "Installing agent $AGENT..."
    ./agents/$AGENT/install.sh
    ;;
  status_agent)
    echo "Status for $AGENT: Unknown (stub)"
    ;;
  *)
    echo "Usage: ./service-manager.sh [install_agent|start_agent|stop_agent|status_agent] <agent_name>"
    exit 1
    ;;
esac
