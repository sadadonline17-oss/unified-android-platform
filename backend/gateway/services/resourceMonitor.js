const os = require('os');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

class ResourceMonitor {
  constructor(config) {
    this.config = config;
    this.checkInterval = config.multi_window_runtime?.resource_monitor?.check_interval_ms || 10000;
    this.serviceStatuses = {};
    this.intervalId = null;
  }

  start() {
    this._checkServices();
    this.intervalId = setInterval(() => this._checkServices(), this.checkInterval);
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  getSystemResources() {
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const cpus = os.cpus();

    return {
      cpu: {
        cores: cpus.length,
        load_average: os.loadavg()
      },
      memory: {
        total_mb: Math.round(totalMem / 1024 / 1024),
        free_mb: Math.round(freeMem / 1024 / 1024),
        used_mb: Math.round((totalMem - freeMem) / 1024 / 1024),
        usage_percent: Math.round(((totalMem - freeMem) / totalMem) * 100)
      },
      uptime_seconds: os.uptime()
    };
  }

  getServiceStatuses() {
    return this.serviceStatuses;
  }

  async _checkServices() {
    const servicesConfig = this._loadServicesConfig();
    const services = servicesConfig.services || {};

    for (const [key, svc] of Object.entries(services)) {
      try {
        if (svc.health_check) {
          await axios.get(svc.health_check, { timeout: 3000 });
          this.serviceStatuses[key] = {
            name: svc.name,
            status: 'running',
            port: svc.port,
            lastCheck: new Date().toISOString()
          };
        }
      } catch {
        this.serviceStatuses[key] = {
          name: svc.name,
          status: 'stopped',
          port: svc.port,
          lastCheck: new Date().toISOString()
        };
      }
    }
  }

  _loadServicesConfig() {
    try {
      const configPath = path.resolve(__dirname, '../../../config/services.config.json');
      return JSON.parse(fs.readFileSync(configPath, 'utf-8'));
    } catch {
      return { services: {} };
    }
  }
}

module.exports = { ResourceMonitor };
