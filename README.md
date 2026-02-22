# Unified Android Ollama Multi-Agent Platform

This monorepo contains the full platform implementing a multi-agent AI system on Android (via Termux), backed by Ollama, Node.js, n8n, and Flutter.

## Features

- **Multi-Agent Architecture:** 16 distinct agents (codex-style, openclaw-assistant, qwen-cli, etc.) running in isolated processes.
- **NullClaw Gateway:** Express backend managing agent sessions, Ollama routing, and chat streaming.
- **Resource Management:** Real-time RAM/CPU detection and limits via Node.js / bash daemons.
- **Flutter Frontend:** Android app communicating with Termux via Kotlin native bridge.
- **n8n Workflows:** Pre-configured workflows for AI automation.
- **Ollama Integration:** Cloud-free local model execution with RAM-based auto-suggestion logic.

## Project Structure

- `android/` - Flutter App and Kotlin Termux bridge
- `backend/` - NullClaw-style Node.js Gateway
- `agents/` - Bash-wrapped Agent Environments
- `config/` - JSON configurations for all platform components
- `services/` - Background daemons and service definitions
- `scripts/` - Installation and startup utilities
- `n8n-workflows/` - n8n AI workflows

## Setup

1. `make install` (Installs dependencies and pulls recommended Ollama models)
2. `make start` (Starts gateway, n8n, ollama, and the background daemon)

## Architecture

1. **Frontend:** Flutter UI with multiple tabs for sessions and agents.
2. **Bridge:** `TermuxBridge.kt` calls Termux bash scripts.
3. **Gateway:** `backend/gateway/index.js` manages REST API and SSE streams.
4. **Agents:** `agents/<name>/start.sh` loops reading stdin and posting to the gateway/Ollama.
