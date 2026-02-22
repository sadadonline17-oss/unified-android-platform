const fs = require('fs');
const path = require('path');

function loadConfig() {
  const configDir = path.resolve(__dirname, '../../../config');
  const config = {};

  const files = {
    platform: 'platform.config.json',
    ollama: 'ollama.config.json',
    agents: 'agents.config.json',
    models: 'models.config.json',
    services: 'services.config.json',
    ide: 'ide-integrations.config.json'
  };

  for (const [key, filename] of Object.entries(files)) {
    const filepath = path.join(configDir, filename);
    try {
      config[key] = JSON.parse(fs.readFileSync(filepath, 'utf-8'));
    } catch {
      config[key] = {};
    }
  }

  // Merge platform config to top level for easy access
  return {
    ...config.platform,
    ollama: {
      local_endpoint: config.ollama.local_endpoint || 'http://localhost:11434',
      ...config.ollama
    },
    agents: config.agents,
    models: config.models,
    services: config.services,
    ide: config.ide,
    _raw: config
  };
}

module.exports = { loadConfig };
