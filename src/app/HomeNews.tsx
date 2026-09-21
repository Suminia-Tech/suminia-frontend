'use client';

import Link from 'next/link';
import Slider from 'react-slick';
import { Col, Container, Row } from 'reactstrap';

/* Las noticias del sector, al pie de la portada.

   Vuelve donde estaba. Se fue en la limpieza que quito la demo de la plantilla
   —camisetas, zapatos Nike, camaras 4K con "70% OFF"— y se la llevo por
   delante, aunque su contenido si era de Suminia: cadena de suministro,
   healthtech, biotecnologia.

   Vuelve como componente propio y no restaurando el archivo de `_template/`,
   que es de solo borrar. Lo que se conserva del original son las clases del
   tema —`product-style-4`, `blog-header`, `blog-date`, `blog-footer`—, que es
   lo que le da la forma: la foto con la fecha encima y el titulo sobre una
   marca de agua.

   Los articulos viven aqui y no en el JSON de la plantilla. No hay blog en el
   backend, de modo que en algun sitio tienen que estar escritos; que sea en un
   archivo de Suminia y no en la trastienda de la plantilla. El dia que haya un
   modulo de contenido, esto se cambia por una consulta y se borra la lista.

   `id` apunta a la pagina de detalle que ya trae la plantilla, que es tambien
   adonde lleva el BLOG del menu. Es prestada: el primer articulo esta escrito,
   los otros dos arrastran relleno de la demo. Se queda asi hasta que haya blog
   de verdad; el enlace al menos no rompe. */

/* Tres por vista, los mismos que traia el carrusel original. */
const CAROUSEL = {
  dots: false,
  arrows: false,
  infinite: true,
  slidesToShow: 3,
  slidesToScroll: 2,
  responsive: [
    { breakpoint: 1200, settings: { slidesToShow: 2, slidesToScroll: 2 } },
    { breakpoint: 767, settings: { slidesToShow: 1, slidesToScroll: 1 } },
  ],
};

interface Articulo {
  id: number;
  dia: number;
  mes: string;
  tema: string;
  titulo: string;
  resumen: string;
  imagen: string;
}

const ARTICULOS: Articulo[] = [
  {
    id: 0,
    dia: 15,
    mes: 'ABR',
    tema: 'Tendencia',
    titulo: 'Cadena de suministro médica sin digitalizar',
    resumen:
      'Solo el 17% de hospitales tiene visibilidad total de su inventario — USD 5.000M en desperdicio anual.',
    imagen: '/assets/images/vegetable/update/1.jpg',
  },
  {
    id: 1,
    dia: 19,
    mes: 'FEB',
    tema: 'Mercado',
    titulo: 'Healthtech alcanzará USD 2 billones para 2034',
    resumen:
      'El mercado de salud digital crece al 15% anual. América Latina lidera la adopción en la región.',
    imagen: '/assets/images/vegetable/update/2.jpg',
  },
  {
    id: 2,
    dia: 5,
    mes: 'FEB',
    tema: 'Innovación',
    titulo: 'Avances en biotecnología y terapia génica',
    resumen:
      'Nuevos sistemas de edición genética y manufactura descentralizada aceleran el acceso a medicamentos biológicos.',
    imagen: '/assets/images/vegetable/update/3.jpg',
  },
];

export const HomeNews = () => (
  <section className='section-b-space home-news'>
    <Container>
      <Row>
        <Col xs='12'>
          {/* La misma cabecera que las demas secciones de la portada. */}
          <div className='title title-2 text-center'>
            <h2>Noticias Del Sector</h2>
            <h5 className='text-color'>Lo que se mueve en salud</h5>
          </div>
        </Col>

        <Col xs='12'>
          <div className='product-wrapper'>
            <Slider {...CAROUSEL}>
              {ARTICULOS.map((articulo) => (
                <div className='product-style-4 ratio2_3' key={articulo.id}>
                  <div className='blog-header'>
                    <div
                      className='blog-image bg-size'
                      style={{
                        backgroundImage: `url(${articulo.imagen})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                      }}
                    >
                      {/* La caja de la fecha la coloca el tema en absoluto sobre
                          la foto; `gradient-color` es su velo, que en `_product`
                          va de verde claro a verde oscuro y aqui se repinta con
                          el degradado de la marca. */}
                      <div className='blog-date gradient-color'>
                        <div className='date-hover'>
                          <div>
                            <h2>{articulo.dia}</h2>
                            <h3>{articulo.mes}</h3>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className='blog-footer'>
                    {/* `h2` es la marca de agua: el tema la pinta a 70px con un
                        7% de opacidad y encima, en absoluto, coloca el `h5`. */}
                    <h2 className='theme-color'>Suminia</h2>
                    <h5 className='theme-color'>{articulo.titulo}</h5>
                    <h6>{articulo.tema}</h6>
                    <p className='brand-name home-news-summary'>
                      {articulo.resumen}
                    </p>
                    <Link
                      href={`/blog/blog_details?id=${articulo.id}`}
                      className='btn btn-primary btn-sm rounded-1'
                    >
                      Leer más
                    </Link>
                  </div>
                </div>
              ))}
            </Slider>
          </div>
        </Col>
      </Row>
    </Container>
  </section>
);

export default HomeNews;
