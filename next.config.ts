/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export for reliable hosting on Netlify/any static host
  output: 'export',

  // Disable image optimization (not available in static export)
  images: {
    unoptimized: true,
  },

  typescript: {
    ignoreBuildErrors: true,
  },

  // Trailing slash for static hosting compatibility
  trailingSlash: true,
};

export default nextConfig;
