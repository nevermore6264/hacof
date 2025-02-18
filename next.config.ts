import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ["edison365.com"], // ✅ Allow external image domain
  },
};

export default nextConfig;
