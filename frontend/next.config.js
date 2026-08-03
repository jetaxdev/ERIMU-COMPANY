/** @type {import('next').NextConfig} */
const backendBaseUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001').replace(/\/$/, '');
const backendApiBaseUrl = backendBaseUrl.endsWith('/api/v1') ? backendBaseUrl : `${backendBaseUrl}/api/v1`;

const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${backendApiBaseUrl}/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
