/** @type {import('next').NextConfig} */
const nextConfig = {
  // Genera .next/standalone con solo las dependencias que el servidor necesita,
  // lo que reduce drasticamente el tamano de la imagen de produccion.
  output: "standalone",
  reactStrictMode: false,
  // Los pedidos del comprador salieron de "Mi cuenta". La direccion vieja
  // sigue llevando a ellos: puede estar en un correo o en un marcador.
  async redirects() {
    return [
      { source: "/buyer/account/orders", destination: "/buyer/orders", permanent: true },
      { source: "/buyer/account/orders/:id", destination: "/buyer/orders/:id", permanent: true },
    ];
  },
};

export default nextConfig;
