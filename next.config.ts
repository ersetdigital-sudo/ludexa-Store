import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Root workspace dibatasi ke folder project (di luar ada package.json milik home dir)
  turbopack: {
    root: process.cwd(),
  },
  images: {
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
