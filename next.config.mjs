/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/",
        destination: "/layout/vegetables",
      },
    ];
  },
  env: {
    API_URL: process.env.API_URL || "",
  },
  reactStrictMode: false,
};

export default nextConfig;
