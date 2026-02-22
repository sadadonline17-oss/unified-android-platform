module.exports = {
  apps: [
    {
      name: "unified-gateway",
      script: "./backend/gateway/index.js",
      env: {
        NODE_ENV: "production",
        PORT: 3000
      }
    }
  ]
};
