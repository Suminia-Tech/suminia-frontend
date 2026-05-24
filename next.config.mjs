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
    API_URL: "http://localhost:3000",
  },
  reactStrictMode: false,
};

export default nextConfig;
