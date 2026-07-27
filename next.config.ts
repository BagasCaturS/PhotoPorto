import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 3600,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/sign/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        pathname: "/api/images/**",
      },
      {
        protocol: "https",
        hostname: "**",
        pathname: "/api/images/**",
      },
    ],
  },
};

export default nextConfig;
