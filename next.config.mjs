/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    agentUpgrade: 'security',
  },
  images: {
    // Allow images from these sources (for development placeholders and future Cloudinary)
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
    // Disable default image optimization in dev for speed
    unoptimized: process.env.NODE_ENV === 'development',
  },
};

export default nextConfig;
