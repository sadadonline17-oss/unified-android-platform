.PHONY: install start stop restart test

install:
	bash scripts/install-deps.sh
	bash scripts/pull-models.sh

start:
	bash scripts/start-all.sh

stop:
	bash scripts/stop-all.sh

restart:
	bash scripts/stop-all.sh
	bash scripts/start-all.sh

status:
	pm2 status || echo "PM2 not found. Check daemon logs."

test:
	echo "Running tests..."
	cd backend/gateway && npm test || echo "No tests defined"
