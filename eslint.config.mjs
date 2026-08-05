import nextCoreWebVitals from "eslint-config-next/core-web-vitals";

// Next 16 elimino el comando "next lint", por lo que el proyecto necesita su
// propia configuracion. eslint-config-next 16 ya exporta flat config nativa,
// asi que no hace falta FlatCompat ni @eslint/eslintrc.

/* Fronteras de la arquitectura. La regla de dependencia es:

     app  ->  features  ->  shared

   Un feature nunca importa otro feature: si dos lo necesitan, eso sube a
   shared/. Y nada entra a las tripas de un feature, solo a su index.ts.

   _template/ es la plantilla Voxo en cuarentena. Se puede leer desde app/
   mientras se reemplaza pantalla por pantalla, pero no desde shared/. */

const RESTRICTED = {
  templateFromShared: {
    group: ["@/_template/*", "@/_template"],
    message:
      "shared/ no puede depender de la plantilla. Copia lo que necesites a shared/ui o shared/lib.",
  },
  moduleInternals: {
    group: ["@/modules/*/*"],
    message:
      "Importa desde la API publica del modulo (@/modules/<nombre>), no de sus archivos internos.",
  },
  anyModule: {
    group: ["@/modules/*"],
    message:
      "Un modulo no puede importar otro modulo. Sube lo compartido a shared/ o componlo en app/.",
  },
};

export default [
  {
    ignores: [".next/**", "node_modules/**", "public/**", "next-env.d.ts"],
  },
  ...nextCoreWebVitals,

  /* La plantilla queda congelada: no se corrigen sus avisos, se borra. Incluye
     las rutas de app/ que todavia son demos de Voxo; conforme se reemplacen por
     pantallas propias, se van sacando de esta lista. */
  {
    files: [
      "src/_template/**",
      "src/app/(main)/(template)/**", // rutas demo de Voxo
      "src/app/api/**", // backend falso que sirve _template/ApiData
      "src/app/(main)/layout.js",
      "src/app/page.js",
      "src/app/head.js",
    ],
    rules: {
      "@next/next/no-img-element": "off",
      "@next/next/no-html-link-for-pages": "off",
      "jsx-a11y/alt-text": "off",
      "react/jsx-no-undef": "off",
      "react/no-unescaped-entities": "off",
      "react-hooks/exhaustive-deps": "off",
      "react-hooks/set-state-in-effect": "off",
      "react-hooks/immutability": "off",
    },
  },

  {
    files: ["src/shared/**"],
    rules: {
      "no-restricted-imports": [
        "error",
        { patterns: [RESTRICTED.templateFromShared, RESTRICTED.anyModule] },
      ],
    },
  },

  {
    files: ["src/modules/*/**"],
    rules: {
      // Un modulo accede a sus propios archivos con rutas relativas, de modo
      // que cualquier "@/modules/..." aqui apunta a OTRO modulo.
      "no-restricted-imports": ["error", { patterns: [RESTRICTED.anyModule] }],
    },
  },

  {
    files: ["src/app/**", "src/store/**"],
    rules: {
      "no-restricted-imports": ["error", { patterns: [RESTRICTED.moduleInternals] }],
    },
  },
];
