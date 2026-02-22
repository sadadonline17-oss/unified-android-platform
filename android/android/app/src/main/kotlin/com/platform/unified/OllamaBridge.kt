package com.platform.unified

class OllamaBridge {
    // Bridges local native logic directly to Ollama if needed,
    // otherwise handled via HTTP in Dart or the Node Gateway.

    fun checkOllamaStatus(): Boolean {
        return true
    }
}
