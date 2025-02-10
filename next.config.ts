import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  compress: true,
  experimental: {
    staleTimes: {
      dynamic: 30,
    },
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 's-maxage=1800, stale-while-revalidate=86400',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
