'use client';

import Link from 'next/link';
import Slider from 'react-slick';
import { Container, Row } from 'reactstrap';

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

/* Cuatro por vista y no las seis del carrusel original: son ilustraciones, y a
   seis salen tan pequeñas que deja de distinguirse que dibujan. Cada ficha pasa
   de 268 a 338px.

   Se copian aqui en vez de importarlos de _template: un modulo no debe depender
   de codigo en cuarentena. */
const CAROUSEL = {
  dots: true,
  arrows: false,
  infinite: true,
  speed: 500,
  slidesToShow: 4,
  slidesToScroll: 1,
  responsive: [
    { breakpoint: 1630, settings: { slidesToShow: 3 } },
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
    /* La misma envoltura que traia el carrusel de categorias del proyecto:
       `ratio_90` y un Container de 1400px, no el ancho completo. De ahi salia el
       tamaño de las fichas, y cambiarlo por `container-fluid-lg` era lo que las
       descuadraba. */
    <section className='ratio_90 home-categories'>
      <Container>
        {/* Sin `Col` dentro del `Row`, como el original: una columna añade 12px
            de padding a cada lado que estrechan la ficha sin que nadie los
            pida. */}
        <Row>
          <div className='w-100'>
            {/* Cabecera centrada con su subtitulo, como las demas secciones del
                tema: `.title.title-2` trae su propio margen inferior, que
                escala con el ancho de la pantalla. */}
            <div className='title title-2 text-center'>
              <h2>Nuestras Categorías</h2>
              <h5 className='text-color'>Comprar por categoría</h5>
            </div>

            <div className='product-wrapper slide-6 home-categories-slider'>
              <Slider {...CAROUSEL}>
                {categories.map((category) => (
                  <div key={category.id}>
                    <Link
                      href={`/catalog?categoryId=${category.id}`}
                      className='product-box product-box6'
                    >
                      <div className='img-wrapper squre-image'>
                        {/* El dibujo va de fondo y no en un <img>, que es lo que
                            hacia el carrusel original: su componente de imagen
                            detecta la clase `bg-img`, esconde la etiqueta y pasa
                            el archivo al fondo del padre con `cover`, añadiendole
                            `bg-size`. Esa clase, dentro de `ratio_90`, crea la
                            caja con `padding-top: 93%`.

                            De ahi salia el tamaño: el dibujo llena la ficha
                            entera. Pintarlo como <img> lo dejaba a su tamaño
                            natural y con margenes que no existian.

                            Se hace aqui de forma declarativa en vez de con el
                            efecto que usa la plantilla: mismo resultado, sin
                            depender de codigo en cuarentena y sin un render de
                            mas. */}
                        <div
                          className='front-img bg-size'
                          style={{
                            backgroundImage: `url(${ICON_PATH}/${category.slug}.svg)`,
                            /* Un punto por encima de `cover`. Los SVG traen
                               su propio margen dentro del lienzo, de modo que
                               a `cover` justo el dibujo se queda corto en una
                               ficha grande; al 115% se acerca al borde sin
                               llegar a recortarse, porque lo que se recorta es
                               ese margen. */
                            backgroundSize: '115%',
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat',
                          }}
                        />
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
        </Row>
      </Container>
    </section>
  );
};

export default CategoryGrid;
