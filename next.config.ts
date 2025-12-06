/** @type {import('next').NextConfig} */
const nextConfig = {
  // SSR/Node Mode (Default)
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
