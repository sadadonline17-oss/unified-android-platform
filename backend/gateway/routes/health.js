const express = require('express');
const os = require('os');
const router = express.Router();

// GET /health
router.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    platform: 'Unified Android Ollama Multi-Agent Platform',
    version: '1.0.0',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// GET /system/resources
router.get('/system/resources', (req, res) => {
  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  const cpus = os.cpus();
  const loadAvg = os.loadavg();

  res.json({
    success: true,
    resources: {
      cpu: {
        cores: cpus.length,
        model: cpus[0]?.model || 'unknown',
        load_average: {
          '1m': loadAvg[0],
          '5m': loadAvg[1],
          '15m': loadAvg[2]
        }
      },
      memory: {
        total_mb: Math.round(totalMem / 1024 / 1024),
        free_mb: Math.round(freeMem / 1024 / 1024),
        used_mb: Math.round((totalMem - freeMem) / 1024 / 1024),
        usage_percent: Math.round(((totalMem - freeMem) / totalMem) * 100)
      },
      platform: os.platform(),
      arch: os.arch(),
      uptime_seconds: os.uptime()
    }
  });
});

// GET /system/services
router.get('/system/services', (req, res) => {
  const services = req.services.resourceMonitor.getServiceStatuses();
  res.json({ success: true, services });
});

// Root endpoint
router.get('/', (req, res) => {
  res.json({
    name: 'Unified Android Ollama Multi-Agent Platform',
    version: '1.0.0',
    endpoints: {
      health: 'GET /health',
      sessions: 'GET /session/list',
      agents: 'GET /agent/list',
      models: 'GET /model/list',
      chat: 'POST /chat/completions',
      resources: 'GET /system/resources',
      services: 'GET /system/services'
    }
  });
});

module.exports = router;
