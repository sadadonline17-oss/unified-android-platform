const fs = require('fs');
const path = require('path');
const { execSync, spawn } = require('child_process');

class AgentManager {
  constructor(config, sessionManager, ollamaProxy) {
    this.config = config;
    this.sessionManager = sessionManager;
    this.ollamaProxy = ollamaProxy;
    this.agentsDir = path.resolve(__dirname, '../../../agents');
    this.runningAgents = new Map();
    this._loadAgents();
  }

  _loadAgents() {
    this.agents = new Map();
    if (!fs.existsSync(this.agentsDir)) return;

    const dirs = fs.readdirSync(this.agentsDir, { withFileTypes: true })
      .filter(d => d.isDirectory() && !d.name.startsWith('_'));

    for (const dir of dirs) {
      const agentJsonPath = path.join(this.agentsDir, dir.name, 'agent.json');
      if (fs.existsSync(agentJsonPath)) {
        try {
          const agentConfig = JSON.parse(fs.readFileSync(agentJsonPath, 'utf-8'));
          agentConfig._folder = dir.name;
          agentConfig._path = path.join(this.agentsDir, dir.name);
          this.agents.set(agentConfig.name || dir.name, agentConfig);
        } catch {}
      }
    }
  }

  async install(name) {
    const agentDir = path.join(this.agentsDir, name);
    const installScript = path.join(agentDir, 'install.sh');

    if (!fs.existsSync(installScript)) {
      throw new Error(`Agent ${name} not found or has no install script`);
    }

    try {
      execSync(`bash ${installScript}`, { cwd: agentDir, timeout: 60000 });
      this._loadAgents();
      return { agent: name, status: 'installed' };
    } catch (err) {
      throw new Error(`Install failed: ${err.message}`);
    }
  }

  async remove(name) {
    if (this.runningAgents.has(name)) {
      await this.stop(name);
    }
    this.agents.delete(name);
    return { agent: name, status: 'removed' };
  }

  async start(name, sessionId) {
    const agent = this._findAgent(name);
    if (!agent) throw new Error(`Agent ${name} not found`);

    if (this.runningAgents.has(name)) {
      throw new Error(`Agent ${name} is already running`);
    }

    const startScript = path.join(agent._path, 'start.sh');
    if (!fs.existsSync(startScript)) {
      throw new Error(`Agent ${name} has no start script`);
    }

    const proc = spawn('bash', [startScript], {
      cwd: agent._path,
      env: {
        ...process.env,
        OLLAMA_HOST: this.config.ollama?.local_endpoint || 'http://localhost:11434',
        AGENT_MODEL: agent.model || 'llama3',
        SESSION_ID: sessionId || ''
      },
      stdio: ['pipe', 'pipe', 'pipe']
    });

    const logs = [];
    proc.stdout.on('data', (d) => logs.push(d.toString()));
    proc.stderr.on('data', (d) => logs.push(d.toString()));

    this.runningAgents.set(name, { proc, logs, startedAt: new Date().toISOString(), sessionId });

    return { agent: name, status: 'started', pid: proc.pid };
  }

  async stop(name) {
    const running = this.runningAgents.get(name);
    if (!running) throw new Error(`Agent ${name} is not running`);

    const agent = this._findAgent(name);
    const stopScript = agent?._path ? path.join(agent._path, 'stop.sh') : null;

    if (stopScript && fs.existsSync(stopScript)) {
      try {
        execSync(`bash ${stopScript}`, { cwd: agent._path, timeout: 10000 });
      } catch {}
    }

    try { running.proc.kill('SIGTERM'); } catch {}
    this.runningAgents.delete(name);

    return { agent: name, status: 'stopped' };
  }

  list() {
    const agents = [];
    for (const [name, config] of this.agents) {
      agents.push({
        name,
        model: config.model,
        type: config.type,
        provider: config.provider,
        running: this.runningAgents.has(name),
        folder: config._folder
      });
    }
    return agents;
  }

  getStatus(name) {
    const agent = this._findAgent(name);
    if (!agent) throw new Error(`Agent ${name} not found`);

    const running = this.runningAgents.get(name);
    return {
      name,
      model: agent.model,
      type: agent.type,
      running: !!running,
      pid: running?.proc?.pid || null,
      startedAt: running?.startedAt || null,
      recentLogs: running?.logs?.slice(-20) || []
    };
  }

  _findAgent(name) {
    // Search by name or folder name
    if (this.agents.has(name)) return this.agents.get(name);
    for (const [, config] of this.agents) {
      if (config._folder === name) return config;
    }
    return null;
  }
}

module.exports = { AgentManager };
