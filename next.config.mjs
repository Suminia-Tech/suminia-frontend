/** @type {import('next').NextConfig} */
const nextConfig = {
  // Genera .next/standalone con solo las dependencias que el servidor necesita,
  // lo que reduce drasticamente el tamano de la imagen de produccion.
  output: "standalone",
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
