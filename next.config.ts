import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  compress: true,
  experimental: {
    ppr: 'incremental',
    dynamicIO: true,
    //reactCompiler: true,
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
