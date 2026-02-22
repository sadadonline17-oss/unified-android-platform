module.exports = {
  apps: [{
    name: "gateway",
    script: "./backend/gateway/index.js",
    watch: true,
    env: {
      NODE_ENV: "development",
      PORT: 3000
    }
  }]
}
