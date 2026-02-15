import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Next.js 15 moved these to the top level, 
  // but if Canary is complaining, we ensure they match the latest spec
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    ppr: true,
  },
  // Ensure this is at the top level
  serverExternalPackages: ['@supabase/ssr'],
};

export default nextConfig;