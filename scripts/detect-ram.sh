#!/bin/bash
# Detect RAM and suggest model tier

total_ram_kb=$(grep MemTotal /proc/meminfo | awk '{print $2}')
if [ -z "$total_ram_kb" ]; then
    echo "Could not detect RAM. Defaulting to under_4gb tier."
    total_ram_kb=2000000
fi

total_ram_gb=$(echo "scale=2; $total_ram_kb / 1024 / 1024" | bc)
echo "Detected RAM: ${total_ram_gb}GB"

if (( $(echo "$total_ram_gb < 4" | bc -l) )); then
    echo "Tier: under_4gb"
    echo "Recommended Local Model: phi3"
elif (( $(echo "$total_ram_gb >= 4 && $total_ram_gb <= 8" | bc -l) )); then
    echo "Tier: 4_to_8gb"
    echo "Recommended Local Model: llama3"
else
    echo "Tier: above_8gb"
    echo "Recommended Local Model: qwen2.5-coder"
fi
