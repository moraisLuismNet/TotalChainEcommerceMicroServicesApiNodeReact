#!/bin/bash

# TotalChainEcommerceMicroServicesApiNode - Start all services via Docker Compose

echo "Starting TotalChainEcommerce with Docker Compose..."

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
COMPOSE_FILE="$ROOT_DIR/docker-compose.yml"

# ──────────────────────────────────────────────
# 0. Check Docker network connectivity
# ──────────────────────────────────────────────
echo -e "${YELLOW}[0/4] Checking Docker network connectivity...${NC}"
if docker run --rm node:20-alpine wget -q --timeout=5 -O /dev/null https://registry.npmjs.org/ 2>/dev/null; then
    echo -e "${GREEN}[OK] Docker can reach npm registry${NC}"
else
    echo -e "${RED}[WARN] Docker cannot reach https://registry.npmjs.org${NC}"
    echo -e "${YELLOW}  Try adding \"dns\": [\"8.8.8.8\", \"8.8.4.4\"] in Docker Desktop:${NC}"
    echo -e "${YELLOW}  Settings → Docker Engine → edit JSON → Apply & Restart${NC}"
    echo -e "${YELLOW}  Then re-run this script.${NC}"
    echo ""
    echo -e "${YELLOW}  Attempting build anyway (may fail)...${NC}"
fi

# ──────────────────────────────────────────────
# 1. OpenWA Docker
# ──────────────────────────────────────────────
echo -e "${YELLOW}[1/4] OpenWA Docker container...${NC}"
if docker ps --format '{{.Names}}' 2>/dev/null | grep -qi "openwa"; then
    echo -e "${GREEN}[OK] OpenWA Docker is now running${NC}"
else
    for dir in "$HOME/OpenWA" "$ROOT_DIR/OpenWA" "/c/OpenWA" "/d/OpenWA"; do
        if [ -f "$dir/docker-compose.yml" ] || [ -f "$dir/docker-compose.yaml" ]; then
            OPENWA_DIR="$dir"
            break
        fi
    done

    if [ -z "$OPENWA_DIR" ]; then
        echo -e "${YELLOW}[...] OpenWA not found. Cloning in $ROOT_DIR/OpenWA ...${NC}"
        cd "$ROOT_DIR"
        git clone https://github.com/rmyndharis/OpenWA.git
        OPENWA_DIR="$ROOT_DIR/OpenWA"
        echo -e "${GREEN}[OK] OpenWA cloned${NC}"
    fi

    echo -e "${YELLOW}[...] Starting OpenWA Docker from: $OPENWA_DIR${NC}"
    cd "$OPENWA_DIR" && docker compose up -d && cd - > /dev/null
    echo -e "${GREEN}[OK] OpenWA Docker up${NC}"
fi

# ──────────────────────────────────────────────
# 2. Start all services via Docker Compose
# ──────────────────────────────────────────────
echo -e "${YELLOW}[2/4] Starting all services...${NC}"
docker compose -f "$COMPOSE_FILE" up -d
echo -e "${GREEN}[OK] All services started${NC}"

# ──────────────────────────────────────────────
# 3. Wait for all services to be reachable
# ──────────────────────────────────────────────
echo -e "\n${YELLOW}[3/4] Waiting for all services to be ready...${NC}"

ORDERED_SERVICES=(
    "UsersManager:5001"
    "Products:5002"
    "Shopings:5003"
    "Payments:5004"
    "Shipments:5005"
    "Kardex:5006"
    "AuditLogs:5007"
    "Mails:5008"
    "Messages:5009"
    "Frontend:4200"
)

wait_for_service() {
    local name=$1
    local port=$2
    local max_wait=180
    local elapsed=0
    local interval=5

    while [ $elapsed -lt $max_wait ]; do
        if curl -s --max-time 3 "http://localhost:$port/api-docs" > /dev/null 2>&1; then
            echo -e "${GREEN}  [READY] $name (port $port)${NC}"
            return 0
        fi
        sleep $interval
        elapsed=$((elapsed + interval))
        echo -e "${YELLOW}  [WAIT]  $name (port $port) — ${elapsed}s elapsed...${NC}"
    done

    echo -e "${RED}  [TIMEOUT] $name (port $port) did not respond after ${max_wait}s${NC}"
    return 1
}

READY_SERVICES=()
for entry in "${ORDERED_SERVICES[@]}"; do
    service="${entry%%:*}"
    port="${entry##*:}"
    if wait_for_service "$service" "$port"; then
        READY_SERVICES+=("$entry")
    fi
done

echo -e "\n${GREEN}All services ready!${NC}"

# ──────────────────────────────────────────────
# 4. Open browser
# ──────────────────────────────────────────────
echo -e "${YELLOW}[4/4] Opening browser...${NC}"

open_url() {
    local url=$1
    if [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "cygwin" ]]; then
        start "" "$url" 2>/dev/null
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        open "$url"
    else
        xdg-open "$url" 2>/dev/null
    fi
}

echo -e "${GREEN}  Opening http://localhost:4200${NC}"
open_url "http://localhost:4200"

echo ""
echo "  React:      http://localhost:4200"
echo "  Swagger:    http://localhost:5001/api-docs"
echo "========================================="
