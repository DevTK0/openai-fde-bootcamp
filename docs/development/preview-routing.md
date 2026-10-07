# Worktree preview routing

A preview belongs to an app directory in a worktree. Branch names alone do not identify it reliably: detached worktrees have no branch, and different branch names can become identical after URL sanitization. The launcher combines the worktree directory name, package name, and a hash of the real app directory. Renaming a branch keeps its preview identity; moving the checkout changes it.

Each app gets a loopback port from Portless. One shared HTTP proxy, normally on port 1355, routes local requests by hostname. Tailscale Serve forwards a separate HTTPS port directly to each app. This keeps base paths and live-reload connections intact without requiring custom tailnet DNS. The remote URL remains valid for the lifetime of the launch, but its HTTPS port can change after a restart. An existing service on port 443 is preserved.

Portless 0.15.7 reads the current Serve configuration, selects an unused HTTPS port, and registers it. Concurrent invocations can select the same port before either registers it. The repository launcher uses a Linux `flock` at `~/.portless/monorepo-launch.lock` to serialize this short registration step across worktrees. The app command acknowledges registration through a private temporary file. The launcher waits for the assigned backend port to accept connections before releasing the lock, so another launch cannot select that port before the framework binds it. All apps then run concurrently. Manual Serve commands and other launch tools do not participate in this lock.

Portless owns the child process tree and route cleanup. The outer launcher forwards termination signals after registration completes, so an early Ctrl+C does not interrupt route creation before Portless installs its cleanup handlers. Stopping an app leaves the shared proxy and other apps running. SIGKILL and machine failure cannot run graceful cleanup.

The launcher uses local HTTP to avoid installing a local certificate authority or changing system hosts files. Tailscale supplies trusted HTTPS for remote access. It disables Funnel and ngrok, so this workflow does not publish previews to the public internet. `PORTLESS_TAILSCALE=0` selects local-only development. `PORTLESS_PORT` and `PORTLESS_STATE_DIR` can select an isolated proxy for testing; Turbo passes these settings to dev tasks.

The package scripts remain the public entrypoints. Framework-specific settings live with each app: Next.js accepts the assigned origins, Astro stays in the foreground and accepts its assigned hosts, and the custom slides server reads `PORT`. The launcher does not maintain a second list of apps or supervise previews after its terminal session ends.

See [Preview apps from multiple worktrees](previews.md) for commands and troubleshooting.
