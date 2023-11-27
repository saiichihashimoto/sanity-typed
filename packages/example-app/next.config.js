/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  transpilePackages: ["../example-studio/sanity.config.ts"],
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
