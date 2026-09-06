/* Punto unico donde se leen las variables de entorno del cliente. Cualquier
   otro archivo que necesite la URL del backend importa de aqui, para que un
   cambio de nombre de variable no obligue a buscar por todo el proyecto. */
export const env = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001',
} as const;
