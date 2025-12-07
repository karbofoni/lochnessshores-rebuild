/** @type {import('next').NextConfig} */
const nextConfig = {
  // SSR Mode (default for Next.js on Netlify)

  typescript: {
    ignoreBuildErrors: true,
  },
  output: 'standalone',
};

export default nextConfig;
