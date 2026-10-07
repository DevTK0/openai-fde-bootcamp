#!/usr/bin/env bash
set -euo pipefail

# The workspace's `start` script launches Portless/Tailscale for previews.
# Run Next directly in production instead of invoking that preview launcher.
(cd /app/apps/web && exec ./node_modules/.bin/next start --hostname 127.0.0.1 --port 3002) &
web_pid=$!
nginx -g 'daemon off;' &
nginx_pid=$!

stop() {
    kill "$web_pid" "$nginx_pid" 2>/dev/null || true
    wait "$web_pid" "$nginx_pid" 2>/dev/null || true
}
trap stop TERM INT EXIT
wait -n "$web_pid" "$nginx_pid"
