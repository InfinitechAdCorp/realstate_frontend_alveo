/** @type {import('next').NextConfig} */
import withPWA from "@ducanh2912/next-pwa";

const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true, // ✅ Ignore ESLint errors during production builds
  },
  images: {
    domains: [
      "media.geeksforgeeks.org",
      "127.0.0.1", // ✅ Use IP instead of "localhost"
      "infinitech-testing1.online",
    ],
  },
  typescript: {
    ignoreBuildErrors: true, // ✅ Ignore TypeScript errors in builds
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
      };
    }
    return config;
  },
};

// ✅ Apply PWA configuration correctly
export default withPWA({
  ...nextConfig, // ✅ Spread nextConfig inside withPWA
  pwa: {
    dest: "public", // ✅ Service worker and assets go in public folder
    register: true, // ✅ Auto-register SW
    skipWaiting: true, // ✅ Update SW without waiting for reload
    disable: false, // ✅ Ensure PWA is enabled
  },
});
