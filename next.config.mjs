/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    reactCompiler: true,
    serverActions: {
      bodySizeLimit: '4.5mb',
    },
    ppr: true,
  },
};

export default nextConfig;
