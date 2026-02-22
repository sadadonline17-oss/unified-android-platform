#!/bin/bash
AGENT_DIR="$(cd "$(dirname "$0")" && pwd)"; echo "Installing $(basename "$AGENT_DIR")"
echo "Cloud model agent - no local pull needed"
echo "$(basename "$AGENT_DIR") installed"
