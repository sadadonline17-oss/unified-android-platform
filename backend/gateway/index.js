const express = require('express');
const cors = require('cors');
const { WebSocketServer } = require('ws');
const http = require('http');

const sessionRoutes = require('./routes/session');
const agentRoutes = require('./routes/agent');
const modelRoutes = require('./routes/model');
const chatRoutes = require('./routes/chat');
const healthRoutes = require('./routes/health');

const { SessionManager } = require('./services/sessionManager');
const { AgentManager } = require('./services/agentManager');
const { ModelManager } = require('./services/modelManager');
const { OllamaProxy } = require('./services/ollamaProxy');
const { ResourceMonitor } = require('./services/resourceMonitor');
const { loadConfig } = require('./utils/config');
const { logger } = require('./utils/logger');

const config = loadConfig();
const app = express();
const server = http.createServer(app);

// Initialize services
const resourceMonitor = new ResourceMonitor(config);
const sessionManager = new SessionManager(config, resourceMonitor);
const ollamaProxy = new OllamaProxy(config);
const modelManager = new ModelManager(config, ollamaProxy);
const agentManager = new AgentManager(config, sessionManager, ollamaProxy);

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`);
  next();
});

// Attach services to request
app.use((req, res, next) => {
  req.services = {
    sessionManager,
    agentManager,
    modelManager,
    ollamaProxy,
    resourceMonitor
  };
  next();
});

// Routes
app.use('/session', sessionRoutes);
app.use('/agent', agentRoutes);
app.use('/model', modelRoutes);
app.use('/chat', chatRoutes);
app.use('/', healthRoutes);

// WebSocket server for streaming
const wss = new WebSocketServer({ server, path: '/ws' });
wss.on('connection', (ws) => {
  logger.info('WebSocket client connected');
  ws.on('message', async (data) => {
    try {
      const msg = JSON.parse(data);
      if (msg.type === 'chat') {
        const stream = await ollamaProxy.chatStream(msg.model, msg.messages);
        for await (const chunk of stream) {
          ws.send(JSON.stringify({ type: 'chunk', content: chunk }));
        }
        ws.send(JSON.stringify({ type: 'done' }));
      }
    } catch (err) {
      ws.send(JSON.stringify({ type: 'error', message: err.message }));
    }
  });
  ws.on('close', () => logger.info('WebSocket client disconnected'));
});

// Error handler
app.use((err, req, res, _next) => {
  logger.error(`Error: ${err.message}`);
  res.status(500).json({ error: err.message });
});

const PORT = config.backend_api?.port || 3000;
const HOST = config.backend_api?.host || '0.0.0.0';

server.listen(PORT, HOST, () => {
  logger.info(`Unified Platform Gateway running on ${HOST}:${PORT}`);
  logger.info(`WebSocket available on ws://${HOST}:${PORT}/ws`);
  resourceMonitor.start();
});

module.exports = { app, server };
