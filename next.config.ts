import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/proxy/:path*",
        destination: `${process.env.API_URL ?? "http://localhost:3000"}/:path*`,
      },
    ];
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "example.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "another-domain.com",
        pathname: "/**",
      },
      {

        protocol: "https",
        hostname: "randomuser.me",
        pathname: "/**",
      },
      {
        
        protocol: "https",
        hostname: "thumbs.dreamstime.com",
        pathname: "/**",
      },
      
    ],
  },
};

export default nextConfig;
