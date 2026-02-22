# Unified Android Ollama Multi-Agent Platform

This is a full AI multi-agent Android platform.
It combines a Flutter frontend with a NullClaw backend gateway, Ollama for local model serving, and an agent plugin system.

## Setup
1. Clone the repository.
2. Run `make install`.
3. Run `make start`.

## Components
- **android/**: Flutter frontend
- **backend/**: Express.js gateway (NullClaw integration)
- **agents/**: Agent plugin system
- **services/**: Service manager scripts
- **config/**: Global JSON configurations
- **n8n-workflows/**: Automation flows
