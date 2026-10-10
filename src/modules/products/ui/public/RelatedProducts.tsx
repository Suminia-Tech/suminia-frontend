'use client';

import { Col, Row } from 'reactstrap';

import { useCatalogProducts } from '../../hooks/useCatalogProducts';
import { ProductCard } from '../common/ProductCard';

interface RelatedProductsProps {
  productId: string;
  categoryId: string;
}

/* Cuantos se enseñan. Se piden uno mas para poder quitar el propio producto
   sin quedarse cortos. */
const MAX = 4;

/* Al pie de la ficha, lo demas de la misma categoria: quien busca guantes de
   nitrilo suele comparar con otros guantes antes de decidir. Si la categoria
   no tiene nada mas, la seccion no aparece. */
export const RelatedProducts = ({ productId, categoryId }: RelatedProductsProps) => {
  const { data } = useCatalogProducts({
    page: 1,
    limit: MAX + 1,
    filter: { categoryId },
  });

  const products = (data?.data.data ?? [])
    .filter((product) => product.id !== productId)
    .slice(0, MAX);

  if (products.length === 0) return null;

  return (
    <section className='product-detail-block related-products'>
      <div className='box-head'>
        <h3>Productos relacionados</h3>
      </div>
      {/* La misma rejilla que el catalogo, para que una tarjeta se vea igual
          en los dos sitios. */}
      <Row className='g-3'>
        {products.map((product) => (
          <Col key={product.id} xs='6' md='4' lg='3'>
            <ProductCard product={product} href={`/catalog/${product.id}`} />
          </Col>
        ))}
      </Row>
    </section>
  );
};

export default RelatedProducts;
