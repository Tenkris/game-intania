import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "s3.imjustin.dev",
        pathname: "/hackathon/**",
      },
      {
        protocol: "https",
        hostname: "d24bh8xfes1923.cloudfront.net",
        pathname: "/**",
      },
      
    ],
  },
};

export default nextConfig;
