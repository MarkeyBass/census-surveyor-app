/** @type {import('next').NextConfig} */
const nextConfig = {
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
  // This ensures the environment variable is available at build time
  // env: {
  //   NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  // },
  // // This ensures the environment variable is available at runtime
  // publicRuntimeConfig: {
  //   NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  // },
  experimental: {
    turbo: false,
  },
};

module.exports = nextConfig; 