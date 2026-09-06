import { useEffect, useState } from 'react';

/* Retrasa un valor hasta que deja de cambiar. Lo usan los buscadores: sin esto
   cada tecla dispara una consulta al backend, y escribir "guantes" son siete
   peticiones de las que solo importa la ultima. */
export const useDebouncedValue = <T,>(value: T, delay = 400): T => {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
};
