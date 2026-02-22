const express = require('express');
const router = express.Router();

// POST /chat/completions - OpenAI-compatible chat endpoint
router.post('/completions', async (req, res) => {
  try {
    const { model, messages, sessionId, stream } = req.body;
    if (!model || !messages) {
      return res.status(400).json({ error: 'model and messages required' });
    }

    if (stream) {
      res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
      });

      const chatStream = await req.services.ollamaProxy.chatStream(model, messages);
      for await (const chunk of chatStream) {
        const sseData = {
          id: `chatcmpl-${Date.now()}`,
          object: 'chat.completion.chunk',
          created: Math.floor(Date.now() / 1000),
          model,
          choices: [{ index: 0, delta: { content: chunk }, finish_reason: null }]
        };
        res.write(`data: ${JSON.stringify(sseData)}\n\n`);
      }
      res.write('data: [DONE]\n\n');
      res.end();
      return;
    }

    const response = await req.services.ollamaProxy.chat(model, messages);

    // Save to session history if sessionId provided
    if (sessionId) {
      req.services.sessionManager.addToHistory(sessionId, messages, response);
    }

    res.json({
      id: `chatcmpl-${Date.now()}`,
      object: 'chat.completion',
      created: Math.floor(Date.now() / 1000),
      model,
      choices: [{
        index: 0,
        message: { role: 'assistant', content: response },
        finish_reason: 'stop'
      }],
      usage: { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /chat/stream - Dedicated streaming endpoint
router.post('/stream', async (req, res) => {
  req.body.stream = true;
  const completionsHandler = router.stack.find(r => r.route?.path === '/completions');
  if (completionsHandler) {
    return completionsHandler.route.stack[0].handle(req, res);
  }
  res.status(500).json({ error: 'stream handler not found' });
});

// GET /chat/:session/history
router.get('/:session/history', (req, res) => {
  try {
    const history = req.services.sessionManager.getHistory(req.params.session);
    res.json({ success: true, history });
  } catch (err) {
    res.status(404).json({ success: false, error: err.message });
  }
});

module.exports = router;
