import type { NextConfig } from "next";
import withPWAInit from "@ducanh2912/next-pwa";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const backendHostname = new URL(BACKEND_URL).hostname;

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
});

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: new URL(BACKEND_URL).protocol.replace(':', '') as "http" | "https",
        hostname: backendHostname,
        port: new URL(BACKEND_URL).port || undefined,
        pathname: '/uploads/**',
      },
      {
        protocol: new URL(BACKEND_URL).protocol.replace(':', '') as "http" | "https",
        hostname: backendHostname,
        port: new URL(BACKEND_URL).port || undefined,
        pathname: '/uploads/resumes/**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${BACKEND_URL}/api/:path*`,
      },
      {
        source: '/uploads/:path*',
        destination: `${BACKEND_URL}/uploads/:path*`,
      },
      {
        source: '/health',
        destination: `${BACKEND_URL}/health`,
      },
    ];
  },
  turbopack: {},
};

export default withPWA(nextConfig);
