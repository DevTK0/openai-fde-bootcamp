<img src="assets/icon.svg" width="64" height="64" alt="">

# openai-fde

Turborepo + pnpm monorepo with Next.js, Tailwind CSS v4, and shadcn/ui.

## Structure

- `apps/web` – Next.js app
- `packages/ui` – shared shadcn/ui components (`@workspace/ui`)
- `packages/eslint-config` – shared ESLint config
- `packages/typescript-config` – shared TypeScript config

## Commands

```bash
pnpm install
pnpm dev        # turbo dev
pnpm build      # turbo build
pnpm lint
pnpm typecheck
```


## Adding components

To add components to your app, run the following command at the root of your `web` app:

```bash
pnpm dlx shadcn@latest add button -c apps/web
```

This will place the ui components in the `packages/ui/src/components` directory.

## Using components

To use the components in your app, import them from the `ui` package.

```tsx
import { Button } from "@workspace/ui/components/button";
```
