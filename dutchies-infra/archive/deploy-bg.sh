#!/usr/bin/env bash
set -euo pipefail

COMPOSE="docker compose"
CADDYFILE="./Caddyfile"
BRANCH="${BRANCH:-main}"
NO_CACHE="${NO_CACHE:-0}"

log(){ echo -e "\n==> $*"; }

# ---- helpers ------------------------------------------------

current_backend_color() {
  if grep -q "reverse_proxy backend_green:4000" "$CADDYFILE"; then
    echo "green"
  else
    echo "blue"
  fi
}

set_backend_color() {
  local color="$1"
  if [[ "$color" == "green" ]]; then
    sed -i 's/reverse_proxy backend_blue:4000/reverse_proxy backend_green:4000/g' "$CADDYFILE"
  else
    sed -i 's/reverse_proxy backend_green:4000/reverse_proxy backend_blue:4000/g' "$CADDYFILE"
  fi
}

wait_backend_healthy() {
  local svc="$1"
  log "Waiting for ${svc} to become healthy (/health)..."
  for i in {1..60}; do
    if $COMPOSE exec -T "$svc" sh -lc 'wget -qO- http://127.0.0.1:4000/health | grep -q "\"ok\""' 2>/dev/null; then
      log "${svc} is healthy."
      return 0
    fi
    sleep 1
  done
  echo "Timed out waiting for ${svc} health" >&2
  return 1
}

build_flags() {
  if [[ "${NO_CACHE}" == "1" ]]; then
    echo "--no-cache"
  else
    echo ""
  fi
}

# ---- deploy -------------------------------------------------

log "Git pull (${BRANCH})..."
git fetch --prune origin
git checkout -f "${BRANCH}"
git pull --ff-only origin "${BRANCH}"

# Decide backend swap
CUR="$(current_backend_color)"
if [[ "$CUR" == "blue" ]]; then
  NEW_SVC="backend_green"
  OLD_SVC="backend_blue"
  NEW_COLOR="green"
else
  NEW_SVC="backend_blue"
  OLD_SVC="backend_green"
  NEW_COLOR="blue"
fi

log "Backend: current=${CUR}, deploying=${NEW_COLOR} (${NEW_SVC})"

log "Building new backend image (no downtime while building)..."
# Build ONLY the target backend service
$COMPOSE build $(build_flags) "$NEW_SVC"

log "Starting new backend container..."
$COMPOSE up -d --force-recreate "$NEW_SVC"

wait_backend_healthy "$NEW_SVC"

log "Switching Caddy upstream to ${NEW_COLOR}..."
set_backend_color "$NEW_COLOR"
$COMPOSE up -d --force-recreate caddy

log "Stopping old backend (${OLD_SVC})..."
$COMPOSE stop "$OLD_SVC" || true

# Frontend (simple rebuild + recreate)
log "Building frontend image..."
$COMPOSE build $(build_flags) frontend

log "Recreating frontend (brief blip at most)..."
$COMPOSE up -d --force-recreate frontend

log "Status:"
$COMPOSE ps

log "Smoke tests:"
curl -fsS http://localhost/api/health >/dev/null && echo "✅ /api/health OK" || echo "❌ /api/health FAIL"
curl -fsS http://localhost/ >/dev/null && echo "✅ / OK" || echo "❌ / FAIL"

log "Done."
