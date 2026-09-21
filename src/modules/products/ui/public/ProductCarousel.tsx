'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';
import Slider from 'react-slick';
import { Col, Container, Row } from 'reactstrap';

import type { Product } from '../../model/product.types';
import { Price } from '../common/Price';

/* El carrusel de fichas de producto de la portada.

   Vive aparte porque lo usan dos secciones —"Solo Para Ti" y "Explora el
   catalogo"— y la ficha no es poca cosa: foto con su enlace, etiqueta de
   medicamento, precio tapado o no, proveedor y formatos. Copiarla en la segunda
   seccion habria dejado dos versiones que se van separando con cada arreglo.

   Lo que cambia entre secciones es que productos entran y que dice el titulo,
   de modo que eso es lo que se recibe. La consulta la hace cada una: son
   distintas y no tienen por que parecerse.

   Reutiliza la estructura del carrusel que ya traia el proyecto —.product-box,
   .img-wrapper, .size-box— en vez de una rejilla propia: el tema tiene esas
   clases estiladas, con su imagen, sus etiquetas y sus puntos de paginacion. */

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

/* Un formato como maximo, para dejarle sitio a la categoria. Casi todos los
   productos tienen uno solo, de modo que la ficha enseñaba una etiqueta sola y
   la fila quedaba coja. */
const MAX_FORMATS = 1;

interface ProductCarouselProps {
  title: string;
  subtitle: string;
  products: Product[];
  /** Entre el titulo y las fichas: lo usa la seccion que trae su propio filtro. */
  children?: ReactNode;
  /** El aire de cierre del tema. Solo para la ultima seccion de la portada. */
  withBottomSpace?: boolean;
}

export const ProductCarousel = ({
  title,
  subtitle,
  products,
  children,
  withBottomSpace = false,
}: ProductCarouselProps) => (
  /* La misma envoltura que traia el carrusel de productos del proyecto: a
     ancho completo y sin padding lateral, de modo que las fichas llegan al
     borde. Con `container-fluid-lg` quedaban metidas hacia dentro.

     `section-b-space` solo en la ultima: cierra por abajo, y en una seccion
     intermedia ese cierre se suma a los 80px de apertura de la siguiente y
     deja el hueco al doble que el de arriba. */
  <section
    className={`ratio_asos home-products${withBottomSpace ? ' section-b-space' : ''}`}
  >
    <Container fluid className='p-sm-0'>
      <Row className='m-0'>
        <Col sm='12' className='p-0'>
          {/* Cabecera centrada con su subtitulo, la del tema. `.title.title-2`
              trae su propio margen inferior, que escala con el ancho. */}
          <div className='title title-2 text-center'>
            <h2>{title}</h2>
            <h5 className='text-color'>{subtitle}</h5>
          </div>

          {children}

          <div className='product-wrapper slide-6'>
            <Slider {...CAROUSEL}>
              {products.map((product) => {
                const image =
                  product.images.find((item) => item.isPrimary) ??
                  [...product.images].sort((a, b) => a.position - b.position)[0];
                const href = `/catalog/${product.id}`;
                const formatos = product.presentations.slice(0, MAX_FORMATS);

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

                        {(product.categoryName || formatos.length > 0) && (
                          <ul className='size-box'>
                            {/* La categoria primero: dice de que clase de cosa
                                se trata, y el formato despues, que dice en que
                                se vende. Antes solo iba el formato y casi todos
                                los productos tienen uno, de modo que quedaba una
                                etiqueta suelta. */}
                            {product.categoryName && (
                              <li>{product.categoryName}</li>
                            )}
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

export default ProductCarousel;
