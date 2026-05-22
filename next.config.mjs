/** @type {import('next').NextConfig} */
const nextConfig = {
  redirects: () => {
    return [
      {
        source: "/",
        destination: "/layout/fashion",
        permanent: false,
      },
    ];
  },
  env: {
    API_URL: "http://localhost:3000",
  },
  reactStrictMode: false,
};

export default nextConfig;
