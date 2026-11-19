'use client';

import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ChevronLeft, ChevronRight, X } from 'react-feather';

/* La foto del producto en grande, sobre la pagina oscurecida.

   La galeria de la ficha mide lo que deja la columna, y en una etiqueta o un
   registro sanitario impreso en la caja eso no alcanza para leer. Aqui la foto
   ocupa la pantalla; con flechas —en pantalla o del teclado— se pasa a las
   demas, y Escape o un clic fuera la cierra.

   Se pinta en el body con un portal: dentro de un modal o de una columna con
   transform, un position fixed queda atrapado en ese contenedor y la foto
   sale recortada en vez de ocupar la pantalla. */
interface ImageLightboxProps {
  images: { id: string; url: string; alt: string | null }[];
  index: number;
  name: string;
  onIndexChange: (index: number) => void;
  onClose: () => void;
}

export const ImageLightbox = ({ images, index, name, onIndexChange, onClose }: ImageLightboxProps) => {
  const total = images.length;
  const ir = (paso: number) => onIndexChange((index + paso + total) % total);

  useEffect(() => {
    const tecla = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
      if (event.key === 'ArrowRight' && total > 1) onIndexChange((index + 1) % total);
      if (event.key === 'ArrowLeft' && total > 1) onIndexChange((index - 1 + total) % total);
    };
    document.addEventListener('keydown', tecla);
    /* La pagina de atras no se desplaza mientras se mira la foto. */
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', tecla);
      document.body.style.overflow = overflow;
    };
  }, [index, total, onClose, onIndexChange]);

  const imagen = images[index];
  if (!imagen || typeof document === 'undefined') return null;

  return createPortal(
    <div
      className='image-lightbox'
      role='dialog'
      aria-modal='true'
      aria-label={`Imágenes de ${name}`}
      onClick={onClose}
    >
      <button type='button' className='image-lightbox-close' aria-label='Cerrar' onClick={onClose}>
        <X size={22} />
      </button>

      {total > 1 && (
        <button
          type='button'
          className='image-lightbox-nav is-prev'
          aria-label='Imagen anterior'
          onClick={(event) => {
            event.stopPropagation();
            ir(-1);
          }}
        >
          <ChevronLeft size={26} />
        </button>
      )}

      {/* eslint-disable-next-line @next/next/no-img-element -- las imagenes
          viven en S3 y next/image exigiria declarar el dominio del bucket. */}
      <img
        src={imagen.url}
        alt={imagen.alt ?? name}
        onClick={(event) => event.stopPropagation()}
      />

      {total > 1 && (
        <button
          type='button'
          className='image-lightbox-nav is-next'
          aria-label='Imagen siguiente'
          onClick={(event) => {
            event.stopPropagation();
            ir(1);
          }}
        >
          <ChevronRight size={26} />
        </button>
      )}

      {total > 1 && (
        <span className='image-lightbox-count'>
          {index + 1} de {total}
        </span>
      )}
    </div>,
    document.body,
  );
};

export default ImageLightbox;
