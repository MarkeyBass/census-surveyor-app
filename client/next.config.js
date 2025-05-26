/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'dev-census-surveyor-0.s3.us-west-2.amazonaws.com',
        port: '',
        pathname: '/focal_point_photo_uploads/**',
      },
    ],
  },
};

module.exports = nextConfig; 