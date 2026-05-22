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
      {
        protocol : "https",
        hostname : "plus.unsplash.com",
        pathname : "/**"
      },
      {
        protocol : "https",
        hostname : "static.wixstatic.com",
        pathname : "/**"
      },
      {
        protocol : "https",
        hostname : "pbs.twimg.com",
        pathname : "/**"
      },
      {
        protocol : "https",
        hostname : "www.thehousedesigners.com",
        pathname : "/**"
      },
      {
        protocol : "https",
        hostname : "cdn.sanity.io",
        pathname : "/**"
      },
      {
        protocol : "https",
        hostname : "images.pexels.com",
        pathname : "/**"
      },
      {
        protocol : "https",
        hostname : "i.pinimg.com",
        pathname : "/**"
      },
      {
        protocol : "https",
        hostname : "www.housegyan.com",
        pathname : "/**"
      },
      {
        protocol : "https",
        hostname : "www.executivecentre.com",
        pathname : "/**"
      },
      {
        protocol : "https",
        hostname : "www.tcccanada.com",
        pathname : "/**"
      }
      
    ],
  },
};

export default nextConfig;
