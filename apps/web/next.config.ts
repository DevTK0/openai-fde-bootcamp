import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  transpilePackages: ["@workspace/ui"],
  outputFileTracingRoot: process.cwd() + "/../..",
  outputFileTracingIncludes: {
    "/api/operations": ["../../data/operations/lionlink-network.sqlite"],
    "/dashboard": ["../../data/operations/lionlink-network.sqlite"],
  },
  // Allow the VM proxy and the collaborative browser development hostname.
  allowedDevOrigins: [
    ...[process.env.PORTLESS_URL, process.env.PORTLESS_TAILSCALE_URL]
      .filter((url): url is string => Boolean(url))
      .map((url) => new URL(url).hostname),
    "valley-or-edit.exe.xyz",
    "valley-or-edit.halibut-bass.ts.net",
    "localhost",
    "127.0.0.1",
  ],
}

export default nextConfig
