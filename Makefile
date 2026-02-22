install:
	./scripts/setup.sh
start:
	pm2 start ecosystem.config.js
stop:
	pm2 stop all
