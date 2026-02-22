const express = require('express');
const router = express.Router();

// POST /agent/install
router.post('/install', async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: 'agent name required' });
    const result = await req.services.agentManager.install(name);
    res.json({ success: true, ...result });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// POST /agent/remove
router.post('/remove', async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: 'agent name required' });
    const result = await req.services.agentManager.remove(name);
    res.json({ success: true, ...result });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// POST /agent/start
router.post('/start', async (req, res) => {
  try {
    const { name, sessionId } = req.body;
    if (!name) return res.status(400).json({ error: 'agent name required' });
    const result = await req.services.agentManager.start(name, sessionId);
    res.json({ success: true, ...result });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// POST /agent/stop
router.post('/stop', async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: 'agent name required' });
    const result = await req.services.agentManager.stop(name);
    res.json({ success: true, ...result });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// GET /agent/list
router.get('/list', (req, res) => {
  const agents = req.services.agentManager.list();
  res.json({ success: true, agents });
});

// GET /agent/:name/status
router.get('/:name/status', (req, res) => {
  try {
    const status = req.services.agentManager.getStatus(req.params.name);
    res.json({ success: true, ...status });
  } catch (err) {
    res.status(404).json({ success: false, error: err.message });
  }
});

module.exports = router;
