/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    reactCompiler: true,
    serverActions: {
      bodySizeLimit: '4.5mb',
    },
    ppr: 'incremental',
  },
};

export default nextConfig;
