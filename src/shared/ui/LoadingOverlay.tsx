'use client';

/* El mismo velo de carga que el tema monta al abrir la pagina, pero gobernado
   desde fuera en vez de por un temporizador de un segundo.

   Hacia falta porque hay esperas que no son una navegacion: iniciar sesion
   desde la propia tienda no cambia de pagina, de modo que sin esto el unico
   indicio de que algo esta pasando es el texto del boton.

   Reutiliza las clases del tema —.loading.bar y sus ocho barras— para que sea
   la misma animacion que ya se ve al entrar, y no una segunda distinta. */
export const LoadingOverlay = ({ isOpen }: { isOpen: boolean }) => {
  if (!isOpen) return null;

  return (
    <div className='loading bar' role='status' aria-live='polite'>
      <span className='visually-hidden'>Cargando</span>
      <div />
      <div />
      <div />
      <div />
      <div />
      <div />
      <div />
      <div />
    </div>
  );
};

export default LoadingOverlay;
