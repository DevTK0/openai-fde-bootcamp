import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  transpilePackages: ["@workspace/ui"],
  // Allow the VM proxy and the collaborative browser development hostname.
  allowedDevOrigins: [
    "valley-or-edit.exe.xyz",
    "valley-or-edit.halibut-bass.ts.net",
    "localhost",
    "127.0.0.1",
  ],
}

export default nextConfig
