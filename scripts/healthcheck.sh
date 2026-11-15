#!/usr/bin/env bash
set -e

BACKEND_URL="${BACKEND_URL:-http://localhost:5000/}"
FRONTEND_URL="${FRONTEND_URL:-http://localhost:5173/}"
MAX_RETRIES="${MAX_RETRIES:-12}"
RETRY_DELAY="${RETRY_DELAY:-5}"

echo "=========================================================="
echo " Starting Post-Deployment Health Check Verification"
echo " Backend Target:  $BACKEND_URL"
echo " Frontend Target: $FRONTEND_URL"
echo " Max Retries:     $MAX_RETRIES (Interval: ${RETRY_DELAY}s)"
echo "=========================================================="

echo "--> Checking Backend health..."
backend_healthy=false
for i in $(seq 1 "$MAX_RETRIES"); do
    status_code=$(curl -s -o /dev/null -w "%{http_code}" "$BACKEND_URL" || true)
    if [ "$status_code" = "200" ]; then
        echo "[SUCCESS] Backend responded with HTTP 200 (Attempt $i/$MAX_RETRIES)"
        backend_healthy=true
        break
    else
        echo "[WAITING] Backend returned HTTP $status_code. Retrying in ${RETRY_DELAY}s... ($i/$MAX_RETRIES)"
        sleep "$RETRY_DELAY"
    fi
done

if [ "$backend_healthy" != "true" ]; then
    echo "[ERROR] Backend health check FAILED after $MAX_RETRIES attempts."
    echo "Dumping recent backend container logs:"
    docker compose logs --tail=50 server || true
    exit 1
fi

echo "--> Checking Frontend accessibility..."
frontend_healthy=false
for i in $(seq 1 "$MAX_RETRIES"); do
    status_code=$(curl -s -o /dev/null -w "%{http_code}" "$FRONTEND_URL" || true)
    if [ "$status_code" = "200" ]; then
        echo "[SUCCESS] Frontend responded with HTTP 200 (Attempt $i/$MAX_RETRIES)"
        frontend_healthy=true
        break
    else
        echo "[WAITING] Frontend returned HTTP $status_code. Retrying in ${RETRY_DELAY}s... ($i/$MAX_RETRIES)"
        sleep "$RETRY_DELAY"
    fi
done

if [ "$frontend_healthy" != "true" ]; then
    echo "[WARNING] Frontend check failed to return 200 (HTTP code: $status_code)."
    echo "Dumping recent frontend container logs:"
    docker compose logs --tail=30 client || true
    exit 1
fi

echo "=========================================================="
echo " [PASSED] All services are HEALTHY and verified operational!"
echo "=========================================================="
exit 0
