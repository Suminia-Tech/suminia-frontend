'use client';

import Link from 'next/link';
import { ArrowRight } from 'react-feather';
import { Col, Row } from 'reactstrap';

import { useGetPublicProductsQuery } from '../../api/productsApi';
import { ProductCard } from '../common/ProductCard';

/* Los productos que se enseñan en la portada.

   Sustituyen a los que traia la plantilla de un JSON estatico: eran nombres
   inventados de una tienda de comestibles, de modo que quien llegaba a Suminia
   veia un catalogo que no existia.

   Sin precios, como el resto de lo publico. Van los ultimos publicados y no una
   seleccion curada: no hay a quien pedirle esa curaduria todavia, y lo reciente
   al menos demuestra que el catalogo esta vivo. */
const HOW_MANY = 8;

export const FeaturedProducts = () => {
  const { data, isLoading } = useGetPublicProductsQuery({
    page: 1,
    limit: HOW_MANY,
    sort: 'createdAt',
    sortDirection: 'desc',
  });

  const products = data?.data.data ?? [];

  /* Si no hay nada publicado, la seccion no aparece. Una rejilla vacia con su
     titulo se lee como que algo fallo. */
  if (isLoading || products.length === 0) return null;

  return (
    <section className='section-b-space'>
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

        <Row className='g-3'>
          {products.map((product) => (
            <Col key={product.id} xs='6' md='4' lg='3'>
              <ProductCard product={product} href={`/catalog/${product.id}`} />
            </Col>
          ))}
        </Row>
      </div>
    </section>
  );
};

export default FeaturedProducts;
