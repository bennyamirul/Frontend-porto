import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  async rewrites() {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL;

    if (!backendUrl) {
      return [];
    }

    return [
      {
        source: "/uploads/:path*",
        destination: `${backendUrl.replace(/\/$/, "")}/uploads/:path*`,
      },
    ];
  },
};

export default nextConfig;
