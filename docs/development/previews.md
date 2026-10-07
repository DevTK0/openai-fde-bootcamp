# Preview apps from multiple worktrees

Use these commands on the Linux development VM. Each worktree needs its own installed dependencies and the Portless launcher changes.

## Start and share a preview

1. Install the repository's Node and pnpm versions, then run `pnpm install` in your worktree.
2. Check `tailscale status`. The VM must be connected, HTTPS certificates must be enabled for the tailnet, and your account must be able to run `tailscale serve`.
3. Start the app you want to review:

   ```bash
   pnpm --filter @workspace/docs dev
   ```

   For the dashboard, use `pnpm --filter web dev`. For slides, use `pnpm --filter @workspace/slides dev`. Run `pnpm dev` to start all three together.

4. Wait for the framework's ready message. Open the HTTPS address printed after `Preview:` from a device connected to the same tailnet.

   Copy the whole URL, including its port and path. Docs use `/docs/`, slides use `/slides/`, and the dashboard uses `/dashboard` beneath the web origin.

5. Keep the terminal running. Press Ctrl+C in that terminal to stop its apps and remove their routes.

Run `pnpm previews` to list registered apps and their Tailscale origins. Add `/docs/` or `/slides/` to the appropriate origin. The local `.localhost` URL is for a browser running on the VM; use the Tailscale URL on your laptop.

## Run another version beside it

Create a worktree from a revision that includes this launcher:

```bash
git worktree add ../fde-docs-prototype -b prototype/docs HEAD
cd ../fde-docs-prototype
pnpm install
pnpm --filter @workspace/docs dev
```

Open its printed HTTPS URL beside the first preview. Install dependencies separately in each worktree. Do not share `.next`, `.astro`, `dist`, or app `node_modules` directories between worktrees.

Keep one running instance of each app in each worktree. A duplicate launch fails without replacing the first instance. To switch between dev and build preview, stop that app first.

## Preview a production build

For docs:

```bash
pnpm --filter @workspace/docs build
pnpm --filter @workspace/docs preview
```

For slides, run `pnpm --filter @workspace/slides build` followed by `pnpm --filter @workspace/slides preview`. For web, run `pnpm --filter web build` followed by `pnpm --filter web start`.

## Work without Tailscale

Disable tailnet sharing for that launch:

```bash
PORTLESS_TAILSCALE=0 pnpm --filter @workspace/docs dev
```

Open its local Portless URL on the VM. For a command-line check when the OS does not resolve `.localhost`, use `curl --resolve '<hostname>:1355:127.0.0.1' '<printed-local-url>'` with the printed hostname and URL.

## Diagnose a failed preview

- If Next.js reports another server in the same directory, use a separate worktree or stop the server through its owning terminal. A free TCP port does not remove Next.js's build-directory lock.
- If registration times out, inspect the other launch's terminal. The launcher waits up to 60 seconds for the shared startup lock and up to 60 seconds for registration and backend startup. Do not delete the lock file; Linux releases the lock when its owner exits.
- If Tailscale setup fails, run `tailscale status` and `tailscale serve status`. Follow the CLI's setup instructions, then rerun the app command.
- If a remote URL fails, verify the framework is ready and use `pnpm previews` to find the current URL. Check that the client is connected to the tailnet and its access policy permits that HTTPS port.
- After a forced kill or VM crash, inspect `pnpm previews` and `tailscale serve status`. A stale Serve handler can remain. Verify its target belongs to your stopped launch before removing that specific handler. Do not reset Serve or stop the shared Portless proxy to fix one app.

## Add another app

Give the app's `package.json` a dev script that uses the shared launcher:

```json
{
	"scripts": {
		"dev": "node ../../scripts/dev.mjs vite --host 127.0.0.1"
	},
	"devPreview": {
		"path": "/"
	}
}
```

Set `devPreview.path` to the app's actual base path. Direct `next`, `astro`, `vite`, and `open-slide` commands receive the allocated port automatically. Custom servers must read `PORT` and bind to `127.0.0.1`. Allow the hostnames from `PORTLESS_URL` and `PORTLESS_TAILSCALE_URL` in the framework's dev-server configuration.

Keep managed servers in the foreground. Astro commands need `--ignore-lock` to prevent agent-triggered backgrounding. If generation is required, follow the slides package's `dev:app` script.

Run `pnpm check` after changing the launcher. This includes isolated local preview lifecycle tests.
To test real Tailscale registration and cleanup, run `PREVIEW_TEST_TAILSCALE=1 pnpm test:previews` while no other previews are starting or stopping. Then launch the new app alongside an existing worktree and check both Tailscale URLs. Stop the new app and confirm the other preview still responds.

See [Worktree preview routing](preview-routing.md) for the naming and process ownership design.
