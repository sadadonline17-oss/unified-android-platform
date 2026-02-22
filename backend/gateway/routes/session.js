const express = require('express');
const router = express.Router();

// POST /session/create
router.post('/create', (req, res) => {
  try {
    const { model, agent } = req.body;
    const session = req.services.sessionManager.create({ model, agent });
    res.json({ success: true, session });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// POST /session/terminate
router.post('/terminate', (req, res) => {
  try {
    const { sessionId } = req.body;
    if (!sessionId) return res.status(400).json({ error: 'sessionId required' });
    req.services.sessionManager.terminate(sessionId);
    res.json({ success: true, message: `Session ${sessionId} terminated` });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// GET /session/list
router.get('/list', (req, res) => {
  const sessions = req.services.sessionManager.list();
  res.json({ success: true, sessions });
});

// GET /session/:id/status
router.get('/:id/status', (req, res) => {
  try {
    const status = req.services.sessionManager.getStatus(req.params.id);
    res.json({ success: true, ...status });
  } catch (err) {
    res.status(404).json({ success: false, error: err.message });
  }
});

module.exports = router;
