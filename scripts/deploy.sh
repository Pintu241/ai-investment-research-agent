#!/usr/bin/env bash
# ==============================================================================
# Automated Deployment Script for AI Investment Research Agent (EC2)
# ==============================================================================
set -e

DEPLOY_DIR="${DEPLOY_DIR:-$(pwd)}"
cd "$DEPLOY_DIR"

echo "=========================================================="
echo " Starting Application Deployment at: $DEPLOY_DIR"
echo " Time: $(date -u)"
echo "=========================================================="

# Check if docker is installed and running
if ! command -v docker &> /dev/null; then
    echo "[ERROR] Docker is not installed or not in PATH."
    exit 1
fi

# Build and start services using Docker Compose
echo "--> Rebuilding and starting containers..."
docker compose up -d --build --remove-orphans

echo "--> Displaying running container status..."
docker compose ps

# Run health check verification
echo "--> Initiating health verification..."
if [ -f "./scripts/healthcheck.sh" ]; then
    chmod +x ./scripts/healthcheck.sh
    ./scripts/healthcheck.sh
else
    echo "[INFO] Waiting 15 seconds for startup..."
    sleep 15
    curl -s http://localhost:5000/ || exit 1
fi

# Clean up dangling images to save disk space on EC2
echo "--> Cleaning up dangling Docker images..."
docker image prune -f || true

echo "=========================================================="
echo " [SUCCESS] Deployment completed successfully!"
echo "=========================================================="
exit 0

