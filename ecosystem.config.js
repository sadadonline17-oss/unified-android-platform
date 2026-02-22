module.exports = {
  apps: [
    {
      name: 'unified-gateway',
      script: 'backend/gateway/index.js',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G'
    },
    {
      name: 'n8n',
      script: 'npx',
      args: 'n8n start',
      env: {
        N8N_PORT: 5678
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G'
    }
  ]
};
