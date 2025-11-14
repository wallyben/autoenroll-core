/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@cc/importer-brightpay', '@cc/importers-core', '@cc/worm'],
  experimental: {
    serverComponentsExternalPackages: ['archiver'],
  },
};

module.exports = nextConfig;
