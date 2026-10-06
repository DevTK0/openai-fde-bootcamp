import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  transpilePackages: ["@workspace/ui"],
  // Dev requests arrive through the nginx proxy on :8000 at the VM hostname.
  allowedDevOrigins: ["valley-or-edit.exe.xyz", "localhost", "127.0.0.1"],
}

export default nextConfig
