'use client';

import Link from 'next/link';
import Slider from 'react-slick';

import { useGetPublicCategoriesQuery } from '../../api/productsApi';

/* Carrusel y no rejilla, como estaba antes de que lo rehiciera. En rejilla las
   siete caben de una vez y salen pequeñas; mostrando cinco cada una ocupa la
   mitad mas de ancho, que en una ilustracion se nota.

   Los mismos ajustes que traia el del proyecto pero con una ficha menos en cada
   tramo, que es lo que las deja del tamaño que tenian. Se copian aqui en vez de
   importarlos de _template: un modulo no debe depender de codigo en cuarentena. */
const CAROUSEL = {
  dots: true,
  arrows: false,
  infinite: false,
  autoplay: true,
  speed: 500,
  slidesToShow: 6,
  slidesToScroll: 1,
  responsive: [
    { breakpoint: 1630, settings: { slidesToShow: 5 } },
    { breakpoint: 1367, settings: { slidesToShow: 4 } },
    { breakpoint: 1200, settings: { slidesToShow: 3 } },
    { breakpoint: 705, settings: { slidesToShow: 2 } },
  ],
};

/* Las categorias del catalogo, como puertas de entrada a la portada.

   Son las de verdad, las mismas por las que se filtra: si se listaran a mano
   aqui, en cuanto Suminia añadiera una la portada se quedaria vieja sin que
   nadie lo notara.

   Cada una dice cuantos productos tiene. No es adorno: entrar en una categoria
   y encontrarla vacia es la clase de cosa que se paga en confianza, y ese
   numero lo evita antes del clic. Cuenta solo lo publicado por empresas
   habilitadas, que es lo que el visitante va a encontrar. */

/* El icono se busca por el slug de la categoria, no por una lista de pares
   escrita aqui. Los archivos se llaman igual que ella —desinfeccion.svg para
   "desinfeccion"—, de modo que añadir una categoria con su dibujo al lado
   funciona sin tocar este archivo. Y si el dibujo no existe todavia, la tarjeta
   sale sin el en vez de con un hueco roto. */
const ICON_PATH = '/assets/images/vegetable/fruit';

export const CategoryGrid = () => {
  const { data, isLoading } = useGetPublicCategoriesQuery();
  const categories = (data?.data ?? []).filter(
    (category) => category.productCount > 0,
  );

  if (isLoading || categories.length === 0) return null;

  return (
    <section className='home-categories'>
      <div className='container-fluid-lg'>
        <div className='box-head'>
          <h3>Comprar por categoría</h3>
        </div>

        <div className='home-categories-slider'>
          <Slider {...CAROUSEL}>
            {categories.map((category) => (
              <div key={category.id}>
                <Link
                  href={`/catalog?categoryId=${category.id}`}
                  className='home-category'
                >
                  <span className='home-category-icon'>
                    {/* eslint-disable-next-line @next/next/no-img-element -- son
                        SVG estaticos servidos desde /public; next/image no
                        aporta nada sobre un vectorial de un kilobyte y ademas lo
                        rasterizaria. */}
                    <img
                      src={`${ICON_PATH}/${category.slug}.svg`}
                      alt=''
                      loading='lazy'
                      onError={(event) => {
                        /* Sin dibujo, la tarjeta se queda con su nombre y su
                           cuenta. Es mejor que el icono roto del navegador. */
                        event.currentTarget.style.display = 'none';
                      }}
                    />
                  </span>

                  <span className='home-category-name'>{category.name}</span>
                  <span className='home-category-count'>
                    {category.productCount === 1
                      ? '1 producto'
                      : `${category.productCount} productos`}
                  </span>
                </Link>
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </section>
  );
};

export default CategoryGrid;
