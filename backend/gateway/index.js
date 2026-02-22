const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Routes
app.get('/health', (req, res) => res.status(200).json({ status: 'ok', message: 'Gateway is running' }));
app.post('/session/create', (req, res) => res.json({ id: 'uuid-1234', status: 'created' }));
app.get('/session/list', (req, res) => res.json({ sessions: [] }));
app.post('/agent/start', (req, res) => res.json({ status: 'starting', agent: req.body.agent }));
app.get('/model/list', (req, res) => res.json({ models: [] }));

app.listen(port, () => {
  console.log(`Gateway listening on port ${port}`);
});
