/** @type {import('next').NextConfig} */
import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public", // ✅ Folder where service worker and PWA assets will be saved
  register: true,
  skipWaiting: true,
  disable: false, // ✅ Disable PWA in development mode
});

const nextConfig = {
  reactStrictMode: true, // ✅ Keep this outside of withPWA()
  eslint: {
    ignoreDuringBuilds: true, // ✅ Disables ESLint errors during build
  },
  images: {
    domains: [
      "media.geeksforgeeks.org",
      "127.0.0.1", // ✅ Use IP instead of "localhost"
      "infinitech-testing1.online",
    ],
  },

  typescript: {
    ignoreBuildErrors: process.env.NODE_ENV === "development", // ✅ Only ignore in dev mode
  },

  webpack: (config, { isServer }) => {
    if (!isServer && process.env.NODE_ENV === "development") {
      config.watchOptions = {
        poll: 1000, // Check for changes every second
        aggregateTimeout: 300,
      };
    }
    return config;
  },
};

// ✅ Apply PWA configuration
export default withPWA(nextConfig);
