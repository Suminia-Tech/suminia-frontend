/** @type {import('next').NextConfig} */
const nextConfig = {
  // Genera .next/standalone con solo las dependencias que el servidor necesita,
  // lo que reduce drasticamente el tamano de la imagen de produccion.
  output: "standalone",
  reactStrictMode: false,
};

export default nextConfig;
