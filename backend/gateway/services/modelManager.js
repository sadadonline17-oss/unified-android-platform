const fs = require('fs');
const path = require('path');
const os = require('os');

class ModelManager {
  constructor(config, ollamaProxy) {
    this.config = config;
    this.ollamaProxy = ollamaProxy;
    this.modelsConfigPath = path.resolve(__dirname, '../../../config/models.config.json');
    this.ollamaConfigPath = path.resolve(__dirname, '../../../config/ollama.config.json');
  }

  async list() {
    // Get locally installed Ollama models
    const localInstalled = await this.ollamaProxy.listModels();

    // Get model registry
    const registry = this._loadModelsConfig();

    return {
      installed: localInstalled.map(m => ({
        name: m.name,
        size: m.size,
        modified_at: m.modified_at,
        digest: m.digest
      })),
      available: {
        local: registry.models?.local || [],
        cloud_free: registry.models?.cloud_free || [],
        cloud_paid: registry.models?.cloud_paid || []
      }
    };
  }

  async pull(name) {
    return this.ollamaProxy.pullModel(name);
  }

  async delete(name) {
    return this.ollamaProxy.deleteModel(name);
  }

  async suggestModel() {
    const totalRamMb = Math.round(os.totalmem() / 1024 / 1024);
    const totalRamGb = totalRamMb / 1024;
    const ollamaConfig = this._loadOllamaConfig();
    const ramLogic = ollamaConfig.ram_suggestion_logic;

    let tier, suggested;
    if (totalRamGb < 4) {
      tier = 'under_4gb';
      suggested = ramLogic?.under_4gb || { default_model: 'phi3' };
    } else if (totalRamGb < 8) {
      tier = '4_to_8gb';
      suggested = ramLogic?.['4_to_8gb'] || { default_model: 'llama3' };
    } else {
      tier = 'above_8gb';
      suggested = ramLogic?.above_8gb || { default_model: 'qwen2.5-coder' };
    }

    // Check if suggested model is installed
    const installed = await this.ollamaProxy.listModels();
    const isInstalled = installed.some(m => m.name.startsWith(suggested.default_model));

    return {
      ram_total_mb: totalRamMb,
      ram_total_gb: Math.round(totalRamGb * 10) / 10,
      tier,
      recommended_model: suggested.default_model,
      fallback_model: suggested.fallback || null,
      max_context: suggested.max_context || 4096,
      is_installed: isInstalled,
      auto_pull: ollamaConfig.auto_model_pull
    };
  }

  _loadModelsConfig() {
    try {
      return JSON.parse(fs.readFileSync(this.modelsConfigPath, 'utf-8'));
    } catch {
      return { models: { local: [], cloud_free: [], cloud_paid: [] } };
    }
  }

  _loadOllamaConfig() {
    try {
      return JSON.parse(fs.readFileSync(this.ollamaConfigPath, 'utf-8'));
    } catch {
      return {};
    }
  }
}

module.exports = { ModelManager };
