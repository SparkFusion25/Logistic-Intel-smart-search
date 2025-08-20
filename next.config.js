/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {}, // remove invalid keys like experimental.appDir
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: false }
};
module.exports = nextConfig;