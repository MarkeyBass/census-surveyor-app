import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'dev-census-surveyor-0.s3.us-west-2.amazonaws.com',
        port: '',
        pathname: '/focal_point_photo_uploads/**',
      },
    ],
    domains: ['census-surveyor.s3.amazonaws.com'],
  },
};

export default nextConfig;
