'use client';

import Link from 'next/link';
import { ArrowRight } from 'react-feather';
import Slider from 'react-slick';

import { useGetPublicProductsQuery } from '../../api/productsApi';
import { Price } from '../common/Price';

/* Los mismos ajustes que usa el carrusel de la plantilla. Se copian aqui en vez
   de importarlos de _template: un modulo no debe depender de codigo en
   cuarentena, y el dia que esa carpeta se borre esto seguiria en pie. Las clases
   CSS si son las del tema, que es lo que da el aspecto. */
const CAROUSEL = {
  dots: true,
  arrows: false,
  infinite: true,
  speed: 500,
  slidesToShow: 6,
  slidesToScroll: 1,
  responsive: [
    { breakpoint: 1630, settings: { slidesToShow: 5 } },
    { breakpoint: 1200, settings: { slidesToShow: 4 } },
    { breakpoint: 992, settings: { slidesToShow: 3 } },
    { breakpoint: 705, settings: { slidesToShow: 2 } },
  ],
};

/* Los productos que se enseñan en la portada.

   Reutiliza la estructura del carrusel que ya traia el proyecto —.product-box,
   .img-wrapper, .size-box— en vez de una rejilla propia: el tema tiene esas
   clases estiladas, con su imagen a la izquierda, sus etiquetas verdes y sus
   puntos de paginacion, y rehacerlo por fuera habria dado algo parecido pero
   distinto.

   Cambian tres cosas respecto a lo que habia:

     - el precio va tapado si quien mira no esta autorizado, que es la regla de
       toda la parte publica;
     - las etiquetas son los formatos de venta reales del producto, no dos
       cadenas sueltas del json de ejemplo;
     - sin estrellas: nadie ha valorado nada todavia, y pintar cinco por
       defecto es inventarse una reputacion.

   Van los ultimos publicados. No hay a quien pedirle una seleccion curada, y lo
   reciente al menos demuestra que el catalogo esta vivo. */
const HOW_MANY = 12;

/* Dos etiquetas como maximo: es lo que caben sin partir la tarjeta, y son las
   que el propio carrusel de la plantilla mostraba. */
const MAX_TAGS = 2;

export const FeaturedProducts = () => {
  const { data, isLoading } = useGetPublicProductsQuery({
    page: 1,
    limit: HOW_MANY,
    sort: 'createdAt',
    sortDirection: 'desc',
  });

  const products = data?.data.data ?? [];

  /* Si no hay nada publicado la seccion no aparece: un carrusel vacio con su
     titulo se lee como que algo fallo. */
  if (isLoading || products.length === 0) return null;

  return (
    <section className='section-b-space ratio_asos'>
      <div className='container-fluid-lg'>
        <div className='box-head d-flex align-items-center justify-content-between'>
          <h3>Lo último en el catálogo</h3>
          <Link
            href='/catalog'
            className='font-light d-inline-flex align-items-center gap-1'
          >
            Ver todo
            <ArrowRight size={15} />
          </Link>
        </div>

        <div className='product-wrapper slide-6'>
          <Slider {...CAROUSEL}>
            {products.map((product) => {
              const images = [...product.images].sort(
                (a, b) => a.position - b.position,
              );
              const href = `/catalog/${product.id}`;
              const formatos = product.presentations.slice(0, MAX_TAGS);

              return (
                <div key={product.id}>
                  <div className='product-box'>
                    <div className='img-wrapper hover-image'>
                      <Link href={href}>
                        {/* Dos imagenes: la segunda es la que el tema enseña al
                            pasar por encima. Con una sola no hay efecto, y
                            tampoco pasa nada. */}
                        {images.slice(0, 2).map((image) => (
                          /* eslint-disable-next-line @next/next/no-img-element --
                             las imagenes viven en S3 y next/image exigiria
                             declarar el dominio del bucket en la configuracion. */
                          <img
                            key={image.id}
                            src={image.url}
                            className='img-fluid bg-img'
                            alt={image.alt ?? product.name}
                          />
                        ))}
                      </Link>

                      {product.type === 'MEDICINE' && (
                        <div className='label-block'>
                          <span className='label label-theme'>Medicamento</span>
                        </div>
                      )}
                    </div>

                    <div className='product-details text-center'>
                      <h3 className='theme-color'>
                        <Price
                          value={product.presentations[0]?.price ?? null}
                          currency={product.presentations[0]?.currency}
                        />
                      </h3>

                      <Link href={href} className='font-default'>
                        <h5>{product.name}</h5>
                      </Link>

                      {formatos.length > 0 && (
                        <ul className='size-box'>
                          {formatos.map((presentation) => (
                            <li key={presentation.id}>{presentation.name}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </Slider>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
