import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "s3.imjustin.dev",
        pathname: "/hackathon/**",
      },
    ],
  },
};

export default nextConfig;
