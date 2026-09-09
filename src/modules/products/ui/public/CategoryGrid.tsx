'use client';

import Link from 'next/link';
import Slider from 'react-slick';

import { useGetPublicCategoriesQuery } from '../../api/productsApi';

/* Las categorias del catalogo, como puertas de entrada a la portada.

   Usa la misma estructura que el carrusel de categorias que ya traia el
   proyecto —.product-box6, .img-wrapper.squre-image, .front-img— en vez de una
   propia. De ahi salen el recuadro verde y la ausencia de esquinas redondeadas,
   que es como estaban: son clases del tema, no CSS nuestro.

   Lo que cambia es de donde vienen los datos. Antes eran seis categorias
   terapeuticas escritas en un json de ejemplo, con su descuento y sus estrellas
   inventados; ahora son las de verdad, las mismas por las que se filtra, y en
   lugar de estrellas que nadie ha puesto dicen cuantos productos tienen. Entrar
   en una categoria y encontrarla vacia es la clase de cosa que se paga en
   confianza, y ese numero lo evita antes del clic. */

/* Los mismos ajustes del carrusel del proyecto, con una ficha menos por tramo
   para que cada una se vea mas grande. Se copian aqui en vez de importarlos de
   _template: un modulo no debe depender de codigo en cuarentena. */
const CAROUSEL = {
  dots: true,
  arrows: false,
  infinite: true,
  speed: 500,
  slidesToShow: 5,
  slidesToScroll: 1,
  responsive: [
    { breakpoint: 1630, settings: { slidesToShow: 4 } },
    { breakpoint: 1200, settings: { slidesToShow: 3 } },
    { breakpoint: 705, settings: { slidesToShow: 2 } },
  ],
};

/* El dibujo se busca por el slug de la categoria, no por una lista de pares
   escrita aqui. Los archivos se llaman igual que ella —desinfeccion.svg para
   "desinfeccion"—, de modo que añadir una categoria con su dibujo al lado
   funciona sin tocar este archivo. */
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

        <div className='product-wrapper home-categories-slider'>
          <Slider {...CAROUSEL}>
            {categories.map((category) => (
              <div key={category.id}>
                <Link
                  href={`/catalog?categoryId=${category.id}`}
                  className='product-box product-box6'
                >
                  <div className='img-wrapper squre-image'>
                    <div className='front-img'>
                      {/* eslint-disable-next-line @next/next/no-img-element --
                          son SVG estaticos servidos desde /public; next/image no
                          aporta nada sobre un vectorial de un kilobyte y ademas
                          lo rasterizaria. */}
                      <img
                        className='img-fluid bg-img'
                        src={`${ICON_PATH}/${category.slug}.svg`}
                        alt=''
                        loading='lazy'
                        onError={(event) => {
                          /* Sin dibujo, la ficha se queda con su nombre y su
                             cuenta. Es mejor que el icono roto del navegador. */
                          event.currentTarget.style.visibility = 'hidden';
                        }}
                      />
                    </div>
                  </div>

                  <div className='product-detail'>
                    <h5>{category.name}</h5>
                    <span className='font-light home-category-count'>
                      {category.productCount === 1
                        ? '1 producto'
                        : `${category.productCount} productos`}
                    </span>
                  </div>
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
