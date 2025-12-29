/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.mhaifafc.com',
        pathname: '/media/players/**',
      },
      {
        protocol: 'https',
        hostname: 'www.mhaifafc.com',
        pathname: '/images/players/**',
      },
    ],
  },
  webpack: (config) => {
    // Suppress webpack cache warnings on Windows
    config.infrastructureLogging = {
      level: 'error',
    };
    return config;
  },
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
}

module.exports = nextConfig

