'use client';

import { useState } from 'react';
import { Facebook, Heart, Link2, Linkedin, Mail, MessageCircle, Twitter } from 'react-feather';
import { toast } from 'react-toastify';

import { useMounted } from '@/shared/hooks/useMounted';

import { useFavorite } from '../../hooks/useFavorites';

interface ProductActionsProps {
  productId: string;
  productName: string;
}

/* El corazon y compartir, debajo del nombre del producto.

   Compartir son enlaces directos a cada red y no el menu del sistema
   (navigator.share): en escritorio ese menu casi nunca existe, y un boton que
   en la mitad de los equipos no hace nada es peor que no tenerlo. El enlace se
   arma con la direccion de la pagina, que solo existe en el navegador: por eso
   se espera a `mounted`. */
export const ProductActions = ({ productId, productName }: ProductActionsProps) => {
  const mounted = useMounted();
  const { canFavorite, isFavorite, toggle, isLoading } = useFavorite(productId);
  const [copiado, setCopiado] = useState(false);

  const url = mounted ? window.location.href : '';
  const texto = `${productName} en Suminia`;
  const enc = encodeURIComponent;

  const redes = [
    {
      label: 'WhatsApp',
      icon: MessageCircle,
      href: `https://wa.me/?text=${enc(`${texto}: ${url}`)}`,
    },
    {
      label: 'Facebook',
      icon: Facebook,
      href: `https://www.facebook.com/sharer/sharer.php?u=${enc(url)}`,
    },
    {
      label: 'LinkedIn',
      icon: Linkedin,
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${enc(url)}`,
    },
    {
      label: 'X',
      icon: Twitter,
      href: `https://twitter.com/intent/tweet?text=${enc(texto)}&url=${enc(url)}`,
    },
    {
      label: 'Correo',
      icon: Mail,
      href: `mailto:?subject=${enc(texto)}&body=${enc(`Mira este producto en Suminia: ${url}`)}`,
    },
  ];

  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiado(true);
      toast.success('Enlace copiado');
      window.setTimeout(() => setCopiado(false), 2000);
    } catch {
      toast.error('No se pudo copiar el enlace.');
    }
  };

  return (
    <div className='product-actions'>
      {mounted && canFavorite && (
        <button
          type='button'
          className={`product-favorite${isFavorite ? ' is-active' : ''}`}
          aria-pressed={isFavorite}
          disabled={isLoading}
          onClick={toggle}
        >
          <Heart size={16} />
          {isFavorite ? 'En tus favoritos' : 'Guardar en favoritos'}
        </button>
      )}

      {mounted && (
        <div className='product-share'>
          <span className='font-light'>Compartir</span>
          <ul>
            {redes.map(({ label, icon: Icon, href }) => (
              <li key={label}>
                <a
                  href={href}
                  target='_blank'
                  rel='noreferrer'
                  title={`Compartir por ${label}`}
                  aria-label={`Compartir por ${label}`}
                >
                  <Icon size={15} />
                </a>
              </li>
            ))}
            <li>
              <button
                type='button'
                title='Copiar enlace'
                aria-label='Copiar enlace'
                className={copiado ? 'is-done' : undefined}
                onClick={copiar}
              >
                <Link2 size={15} />
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default ProductActions;
