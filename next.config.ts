import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    ppr: 'incremental',
    //dynamicIO: true,
    reactCompiler: true,
    staleTimes: {
      dynamic: 30,
    },
  },
};

export default nextConfig;
