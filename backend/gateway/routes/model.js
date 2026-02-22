const express = require('express');
const router = express.Router();

// GET /model/list
router.get('/list', async (req, res) => {
  try {
    const models = await req.services.modelManager.list();
    res.json({ success: true, models });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /model/pull
router.post('/pull', async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: 'model name required' });
    res.writeHead(200, { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache' });
    const stream = await req.services.modelManager.pull(name);
    for await (const progress of stream) {
      res.write(`data: ${JSON.stringify(progress)}\n\n`);
    }
    res.write(`data: ${JSON.stringify({ status: 'complete' })}\n\n`);
    res.end();
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// POST /model/delete
router.post('/delete', async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: 'model name required' });
    await req.services.modelManager.delete(name);
    res.json({ success: true, message: `Model ${name} deleted` });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// GET /model/suggest
router.get('/suggest', async (req, res) => {
  try {
    const suggestion = await req.services.modelManager.suggestModel();
    res.json({ success: true, ...suggestion });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
