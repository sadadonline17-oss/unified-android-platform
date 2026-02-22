#!/bin/bash
# Stub for RAM detection
TOTAL_RAM=$(free -m | awk '/^Mem:/{print $2}')
echo "Total RAM: ${TOTAL_RAM}MB"
if [ "$TOTAL_RAM" -lt 4096 ]; then
  echo "Tier: under_4gb"
elif [ "$TOTAL_RAM" -lt 8192 ]; then
  echo "Tier: 4_to_8gb"
else
  echo "Tier: above_8gb"
fi
