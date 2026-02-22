#!/bin/bash
PROJECT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
echo "Installing dependencies..."

# Backend dependencies
if [ -d "$PROJECT_DIR/backend/gateway" ]; then
    cd "$PROJECT_DIR/backend/gateway" && npm install
fi

# n8n dependencies (global install typically used, or locally via npx)
npm install -g n8n pm2

# Agent dependencies
for agent_dir in "$PROJECT_DIR"/agents/*/; do
    if [ -f "$agent_dir/install.sh" ]; then
        bash "$agent_dir/install.sh"
    fi
done

echo "Dependencies installed."
