/* Next.js config – remove invalid experimental.appDir and add rewrite for /app/* */
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: { instrumentationHook: false },
  async rewrites() {
    return [
      { source: '/app', destination: '/app/index' },
      { source: '/app/:path*', destination: '/app/index' }
    ];
  }
};
module.exports = nextConfig;