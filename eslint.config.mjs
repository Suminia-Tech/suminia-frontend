import nextCoreWebVitals from "eslint-config-next/core-web-vitals";

// Next 16 elimino el comando "next lint", por lo que el proyecto necesita su
// propia configuracion. eslint-config-next 16 ya exporta flat config nativa,
// asi que no hace falta FlatCompat ni @eslint/eslintrc.
export default [
  {
    ignores: [".next/**", "node_modules/**", "public/**", "next-env.d.ts"],
  },
  ...nextCoreWebVitals,
];
