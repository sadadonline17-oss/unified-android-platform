#!/bin/bash
echo "Starting all services..."
pm2 start ecosystem.config.js
echo "Done."
