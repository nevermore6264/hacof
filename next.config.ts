import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: [
      "edison365.com",
      "doanthanhnien.vn",
      "i0.wp.com",
      "moitruongachau.com",
    ], // ✅ Allow external image domain
  },
};

export default nextConfig;
