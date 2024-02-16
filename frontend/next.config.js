/** @type {import('next').NextConfig} */

const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  sw: 'sw.js',
});

const nextConfig = {
  reactStrictMode: true,
  swcMinify: false,
  images: {
    domains: [
      "lh3.googleusercontent.com",
      "localhost",
      "neotexto.com",
    ],
  },
  async redirects() {
    return [];
  },
  async rewrites() {
    return [
      {
        source: "/back/media/:path*",
        destination: `${process.env.NEXT_PRIVATE_BACKEND_URL}/back/media/:path*`,
      },
      {
        source: "/back/api/auth/password/reset/",
        destination: `${process.env.NEXT_PRIVATE_BACKEND_URL}/back/api/auth/password/reset/`,
      },
    ];
  },
};

module.exports = withPWA(nextConfig);
