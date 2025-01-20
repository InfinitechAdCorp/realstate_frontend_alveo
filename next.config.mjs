/** @type {import('next').NextConfig} */
const nextConfig = {};

// next.config.mjs
export default {
  reactStrictMode: true,
  images: {
    domains: [
      "media.geeksforgeeks.org",
      "localhost",
      "infinitech-testing1.online",
    ],
  },
  typescript: {
    ignoreBuildErrors: true, // Disables type checking errors
  },
};
