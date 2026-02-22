const { v4: uuidv4 } = require('uuid');

class SessionManager {
  constructor(config, resourceMonitor) {
    this.config = config;
    this.resourceMonitor = resourceMonitor;
    this.sessions = new Map();
    this.maxSessions = config.multi_window_runtime?.max_parallel_sessions || 10;
    this.maxRamPerSession = config.multi_window_runtime?.resource_monitor?.max_ram_per_session_mb || 2048;
  }

  create({ model, agent } = {}) {
    if (this.sessions.size >= this.maxSessions) {
      throw new Error(`Maximum ${this.maxSessions} parallel sessions reached`);
    }

    const sessionId = uuidv4();
    const session = {
      id: sessionId,
      model: model || null,
      agent: agent || null,
      status: 'active',
      createdAt: new Date().toISOString(),
      history: [],
      resources: { cpu_percent: 0, ram_mb: 0 },
      pid: null
    };

    this.sessions.set(sessionId, session);
    return session;
  }

  terminate(sessionId) {
    const session = this.sessions.get(sessionId);
    if (!session) throw new Error(`Session ${sessionId} not found`);

    session.status = 'terminated';
    session.terminatedAt = new Date().toISOString();

    // Kill process if running
    if (session.pid) {
      try { process.kill(session.pid); } catch {}
    }

    this.sessions.delete(sessionId);
    return { sessionId, status: 'terminated' };
  }

  list() {
    return Array.from(this.sessions.values()).map(s => ({
      id: s.id,
      model: s.model,
      agent: s.agent,
      status: s.status,
      createdAt: s.createdAt,
      resources: s.resources
    }));
  }

  getStatus(sessionId) {
    const session = this.sessions.get(sessionId);
    if (!session) throw new Error(`Session ${sessionId} not found`);
    return {
      id: session.id,
      model: session.model,
      agent: session.agent,
      status: session.status,
      createdAt: session.createdAt,
      resources: session.resources,
      historyLength: session.history.length
    };
  }

  addToHistory(sessionId, messages, response) {
    const session = this.sessions.get(sessionId);
    if (!session) return;
    session.history.push({
      timestamp: new Date().toISOString(),
      messages,
      response
    });
  }

  getHistory(sessionId) {
    const session = this.sessions.get(sessionId);
    if (!session) throw new Error(`Session ${sessionId} not found`);
    return session.history;
  }

  updateResources(sessionId, resources) {
    const session = this.sessions.get(sessionId);
    if (!session) return;
    session.resources = resources;

    // Auto-suspend if RAM exceeds limit
    if (resources.ram_mb > this.maxRamPerSession) {
      session.status = 'suspended';
    }
  }

  getSession(sessionId) {
    return this.sessions.get(sessionId);
  }

  get activeCount() {
    return this.sessions.size;
  }
}

module.exports = { SessionManager };
