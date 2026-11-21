#!/usr/bin/env bash
# One-time setup on a fresh Ubuntu 24.04 EC2 instance. Run:  bash app/deploy/setup-ec2.sh
set -euo pipefail
cd "$(dirname "$0")/../.."          # repository root
sudo apt-get update -y
sudo apt-get install -y docker.io docker-compose-v2 nginx
sudo usermod -aG docker "$USER" || true
if [ ! -f app/.env ]; then cp app/.env.example app/.env; echo ">>> Edit app/.env (API key + password), then run this script again."; exit 0; fi
sudo docker compose up -d --build
sudo cp app/deploy/nginx.conf /etc/nginx/sites-available/comedy-library
sudo sed -i "s/YOUR_DOMAIN/${DOMAIN:-_}/" /etc/nginx/sites-available/comedy-library
sudo ln -sf /etc/nginx/sites-available/comedy-library /etc/nginx/sites-enabled/comedy-library
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl reload nginx
echo ">>> Running. Open http://$(curl -s https://checkip.amazonaws.com)/"
