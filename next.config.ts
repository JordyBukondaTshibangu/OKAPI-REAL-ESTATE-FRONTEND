import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/proxy/:path*",
        destination: `${process.env.API_URL ?? "http://localhost:8080"}/:path*`,
      },
    ];
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pub-d5cad4963b964b9ba2720a29b5780d2b.r2.dev",
        pathname: "/**",
      },
    ],
  },

  allowedDevOrigins: ["192.168.68.108"],
};

export default nextConfig;
