/* Normaliza los errores del backend. Responde con dos formas distintas segun
   donde falle: el pipe de validacion devuelve "errors" y las reglas de negocio
   "error". Ambas traen {campo: mensaje | mensaje[]}. */

interface ApiErrorBody {
  message?: string;
  errors?: Record<string, string | string[]>;
  error?: Record<string, string | string[]>;
}

const getBody = (error: unknown): ApiErrorBody | null => {
  if (typeof error !== 'object' || error === null || !('data' in error)) return null;

  const { data } = error as { data: unknown };
  return typeof data === 'object' && data !== null ? (data as ApiErrorBody) : null;
};

const firstMessage = (value: string | string[]): string =>
  Array.isArray(value) ? String(value[0]) : String(value);

/** Errores por campo, listos para pintarse bajo cada input. */
export const extractFieldErrors = (error: unknown): Record<string, string> => {
  const fields = getBody(error)?.errors ?? getBody(error)?.error;
  if (!fields || typeof fields !== 'object') return {};

  return Object.entries(fields).reduce<Record<string, string>>((acc, [field, messages]) => {
    acc[field] = firstMessage(messages);
    return acc;
  }, {});
};

/** Mensaje general; cae al primer error de campo y luego al texto por defecto. */
export const extractErrorMessage = (error: unknown, fallback: string): string => {
  const body = getBody(error);
  if (body?.message) return body.message;

  const [first] = Object.values(extractFieldErrors(error));
  return first ?? fallback;
};
