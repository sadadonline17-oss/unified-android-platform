#!/bin/bash
PROJECT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
echo "Setting up Unified Android Ollama Multi-Agent Platform..."

bash "$PROJECT_DIR/scripts/install-deps.sh"
bash "$PROJECT_DIR/scripts/pull-models.sh"

echo "Setup complete!"
