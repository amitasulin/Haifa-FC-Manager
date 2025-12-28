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
}

module.exports = nextConfig

