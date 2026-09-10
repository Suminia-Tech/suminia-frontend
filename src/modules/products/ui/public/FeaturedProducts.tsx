'use client';

import Link from 'next/link';
import Slider from 'react-slick';
import { Col, Container, Row } from 'reactstrap';

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
  /* Una tarjeta menos por fila que en el carrusel de la plantilla. La foto ya
     ocupa todo el ancho de su tarjeta, de modo que la unica forma de que se vea
     mas grande es que quepan menos: con cinco en vez de seis cada una gana un
     20%. Aqui interesa que se reconozca el producto mas que que se vean muchos
     de golpe. */
  slidesToShow: 5,
  slidesToScroll: 1,
  responsive: [
    { breakpoint: 1630, settings: { slidesToShow: 4 } },
    { breakpoint: 1200, settings: { slidesToShow: 3 } },
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
    /* La misma envoltura que traia el carrusel de productos del proyecto: a
       ancho completo y sin padding lateral, de modo que las fichas llegan al
       borde. Con `container-fluid-lg` quedaban metidas hacia dentro.

       Sin `section-b-space`: no es la ultima seccion, y el cierre por abajo se
       sumaba a los 80px de apertura de la siguiente, dejando ese hueco al doble
       que el de arriba. Lo lleva solo la de categorias, que da al pie. */
    <section className='ratio_asos home-products'>
      <Container fluid className='p-sm-0'>
        <Row className='m-0'>
          <Col sm='12' className='p-0'>
            {/* Cabecera centrada con su subtitulo, la del tema. `.title.title-2`
                trae su propio margen inferior, que escala con el ancho. */}
            <div className='title title-2 text-center'>
              <h2>Solo Para Ti</h2>
              <h5 className='text-color'>Nuestros Productos</h5>
            </div>

            <div className='product-wrapper slide-6'>
              <Slider {...CAROUSEL}>
                {products.map((product) => {
                  const image =
                    product.images.find((item) => item.isPrimary) ??
                    [...product.images].sort((a, b) => a.position - b.position)[0];
                  const href = `/catalog/${product.id}`;
                  const formatos = product.presentations.slice(0, MAX_TAGS);

                  return (
                    <div key={product.id}>
                      <div className='product-box'>
                        {/* Una sola imagen. `hover-image` del tema no intercambia
                            dos al pasar por encima —es un velo decorativo—, de modo
                            que pintar la segunda solo la apilaba debajo y partia la
                            fila en dos. */}
                        <div className='img-wrapper hover-image'>
                          <Link href={href}>
                            {image ? (
                              /* eslint-disable-next-line @next/next/no-img-element --
                                 las imagenes viven en S3 y next/image exigiria
                                 declarar el dominio del bucket en la configuracion. */
                              <img
                                src={image.url}
                                className='img-fluid'
                                alt={image.alt ?? product.name}
                              />
                            ) : (
                              <span className='product-box-empty' />
                            )}
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

                          {/* Quien lo vende. En un marketplace no es un detalle:
                              es la mitad de lo que se esta mirando. */}
                          <p className='font-light product-box-supplier'>
                            {product.organizationName ?? 'Proveedor'}
                          </p>

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
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default FeaturedProducts;
