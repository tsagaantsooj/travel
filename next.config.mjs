/** @type {import('next').NextConfig} */
const API_URL = process.env.API_URL || 'http://localhost:4000';

const nextConfig = {
  poweredByHeader: false,
  // Browser-оос /api, /uploads руу явах хүсэлтийг backend руу дамжуулна.
  // Ингэснээр cookie нэг домэйн дээр ажиллана.
  async rewrites() {
    return [
      { source: '/api/:path*', destination: `${API_URL}/api/:path*` },
      { source: '/uploads/:path*', destination: `${API_URL}/uploads/:path*` },
    ];
  },
};

export default nextConfig;
