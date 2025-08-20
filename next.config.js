/* Clean next config — remove unsupported experimental flags that break Next 14 builds. */
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  /* If you previously had experimental.appDir, it is not needed for Pages Router projects. */
  experimental: {},
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};
module.exports = nextConfig;