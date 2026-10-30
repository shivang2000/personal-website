import "@personal-website/env/web";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typedRoutes: true,
  reactCompiler: true,
  output: "standalone",
  // The Vercel multi-service deploy (vercel.json `services`) doesn't route
  // /_next/image, so the optimizer 404s in production. Serve files as-is and
  // ship right-sized assets from /public instead.
  images: { unoptimized: true },
};

export default nextConfig;
