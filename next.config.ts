import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  output: "standalone",
  experimental: {
    serverActions: {
      bodySizeLimit: "1mb",
    },
  },

  allowedDevOrigins: ["192.168.0.137"],
}

export default nextConfig
