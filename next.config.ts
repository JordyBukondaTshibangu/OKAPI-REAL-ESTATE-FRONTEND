import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Gzip/Brotli compress all responses — critical for slow connections
  compress: true,

  async rewrites() {
    return [
      {
        source: "/api/proxy/:path*",
        destination: `${process.env.API_URL ?? "http://localhost:8080"}/:path*`,
      },
    ];
  },

  images: {
    // Serve AVIF first (smallest), fall back to WebP — both far smaller than JPEG
    formats: ["image/avif", "image/webp"],
    // Allowlist the quality values used in the codebase (65 for property images)
    qualities: [65, 75],
    // Devices in Kinshasa are mostly mobile — focus breakpoints there
    deviceSizes: [360, 480, 640, 750, 828, 1080, 1200],
    imageSizes: [64, 128, 256, 384],
    // Cache optimised images for 7 days on the CDN/browser
    minimumCacheTTL: 60 * 60 * 24 * 7,
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
