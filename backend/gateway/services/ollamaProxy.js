const axios = require('axios');

class OllamaProxy {
  constructor(config) {
    this.endpoint = config.ollama?.local_endpoint || 'http://localhost:11434';
    this.cloudFirstRouting = config.multi_window_runtime?.cloud_first_routing || false;
    this.timeout = config.ollama?.timeout_ms || 120000;
  }

  async chat(model, messages) {
    if (this._isCloudModel(model)) {
      return this._cloudChat(model, messages);
    }

    const response = await axios.post(`${this.endpoint}/api/chat`, {
      model,
      messages,
      stream: false
    }, { timeout: this.timeout });

    return response.data.message?.content || '';
  }

  async *chatStream(model, messages) {
    if (this._isCloudModel(model)) {
      yield* this._cloudChatStream(model, messages);
      return;
    }

    const response = await axios.post(`${this.endpoint}/api/chat`, {
      model,
      messages,
      stream: true
    }, {
      timeout: this.timeout,
      responseType: 'stream'
    });

    let buffer = '';
    for await (const chunk of response.data) {
      buffer += chunk.toString();
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.trim()) {
          try {
            const data = JSON.parse(line);
            if (data.message?.content) {
              yield data.message.content;
            }
          } catch {}
        }
      }
    }
  }

  async generate(model, prompt) {
    const response = await axios.post(`${this.endpoint}/api/generate`, {
      model,
      prompt,
      stream: false
    }, { timeout: this.timeout });

    return response.data.response || '';
  }

  async listModels() {
    try {
      const response = await axios.get(`${this.endpoint}/api/tags`, { timeout: 5000 });
      return response.data.models || [];
    } catch {
      return [];
    }
  }

  async pullModel(name) {
    const response = await axios.post(`${this.endpoint}/api/pull`, {
      name,
      stream: true
    }, {
      timeout: 600000,
      responseType: 'stream'
    });
    return response.data;
  }

  async deleteModel(name) {
    await axios.delete(`${this.endpoint}/api/delete`, {
      data: { name },
      timeout: 30000
    });
  }

  async isHealthy() {
    try {
      await axios.get(`${this.endpoint}/api/tags`, { timeout: 3000 });
      return true;
    } catch {
      return false;
    }
  }

  _isCloudModel(model) {
    return model.includes(':cloud') || model.includes('-cloud') || model.endsWith('-free');
  }

  async _cloudChat(model, messages) {
    // Cloud model routing - placeholder for cloud API integration
    // In production, this would route to cloud-free or cloud-paid endpoints
    throw new Error(`Cloud model ${model} not configured. Set up cloud provider credentials.`);
  }

  async *_cloudChatStream(model, messages) {
    throw new Error(`Cloud streaming for ${model} not configured.`);
  }
}

module.exports = { OllamaProxy };
