/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      config.resolve.alias['react-dom'] = '@hot-loader/react-dom';
    }
    return config;
  },
};

export default nextConfig;
