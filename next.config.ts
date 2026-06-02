import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.mlstatic.com' },
      { protocol: 'https', hostname: '**.shopee.com.br' },
      { protocol: 'https', hostname: '**.amazon.com.br' },
      { protocol: 'https', hostname: '**.amazonaws.com' },
      { protocol: 'https', hostname: '**.supabase.co' },
      { protocol: 'https', hostname: '**' },
    ],
  },
};

export default nextConfig;
