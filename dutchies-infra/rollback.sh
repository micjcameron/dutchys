#!/usr/bin/env bash
set -euo pipefail

COMPOSE="docker compose"
CADDYFILE="./Caddyfile"

# Set STOP_OTHER=1 to stop the backend you rolled away from after switching.
# Example: STOP_OTHER=1 ./rollback.sh
STOP_OTHER="${STOP_OTHER:-0}"

log(){ echo -e "\n==> $*"; }
die(){ echo -e "\nERROR: $*" >&2; exit 1; }

# Detect which backend Caddy is currently pointing at
current_color() {
  if grep -q "reverse_proxy backend_green:4000" "$CADDYFILE"; then
    echo "green"
  elif grep -q "reverse_proxy backend_blue:4000" "$CADDYFILE"; then
    echo "blue"
  else
    die "Couldn't detect current backend in Caddyfile (expected backend_blue or backend_green)."
  fi
}

# Switch Caddyfile to target color
set_color() {
  local color="$1"

  # Make it robust: replace both ways, whichever exists
  if [[ "$color" == "green" ]]; then
    sed -i 's/reverse_proxy backend_blue:4000/reverse_proxy backend_green:4000/g' "$CADDYFILE"
  else
    sed -i 's/reverse_proxy backend_green:4000/reverse_proxy backend_blue:4000/g' "$CADDYFILE"
  fi
}

ensure_running() {
  local svc="$1"
  log "Ensuring ${svc} is running..."
  $COMPOSE up -d --no-build "$svc" >/dev/null
}

smoke_test() {
  log "Smoke test: GET /api/health (retrying)..."
  for i in {1..20}; do
    # Use --max-time to avoid hanging forever if Caddy is mid-restart
    if curl -fsS --max-time 2 http://127.0.0.1/api/health >/dev/null; then
      echo "✅ /api/health OK"
      return 0
    fi
    sleep 0.5
  done

  echo "❌ /api/health FAIL"
  return 1
}


log "Rollback starting..."
CUR="$(current_color)"

if [[ "$CUR" == "blue" ]]; then
  NEW="green"
  NEW_SVC="backend_green"
  OLD_SVC="backend_blue"
else
  NEW="blue"
  NEW_SVC="backend_blue"
  OLD_SVC="backend_green"
fi

log "Current backend: ${CUR}"
log "Rolling back to: ${NEW} (${NEW_SVC})"

# Make sure target backend is up (so rollback is truly instant)
ensure_running "$NEW_SVC"

log "Updating Caddyfile to point to ${NEW}..."
set_color "$NEW"

log "Recreating Caddy to apply changes..."
$COMPOSE up -d --no-build --force-recreate caddy >/dev/null

smoke_test

if [[ "$STOP_OTHER" == "1" ]]; then
  log "Stopping previous backend (${OLD_SVC})..."
  $COMPOSE stop "$OLD_SVC" || true
fi

log "Rollback done."
$COMPOSE ps
