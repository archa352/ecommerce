import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    /* Product images are served by the API host, and the seed data by picsum. */

    remotePatterns: [
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "fastly.picsum.photos" },
      { protocol: "http", hostname: "localhost", port: "58000" },
      { protocol: "https", hostname: "i.pinimg.com" },
    ],
  },
};

export default nextConfig;