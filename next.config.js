/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['a0.muscache.com','res.cloudinary.com'],
  },
}

module.exports = nextConfig;
