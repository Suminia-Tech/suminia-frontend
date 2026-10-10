'use client';

import Link from 'next/link';
import { Heart } from 'react-feather';
import { Col, Row } from 'reactstrap';

import { extractErrorMessage } from '@/shared/lib/apiError';
import { PageHeader } from '@/shared/ui';
import { useAppSelector } from '@/store/hooks';

import { useGetFavoritesQuery } from '../../api/productsApi';
import { ProductCard } from '../common/ProductCard';

/* Lo que el comprador guardo con el corazon para volver a ello. Las tarjetas
   son las del catalogo, para que un producto se reconozca igual en los dos
   sitios. Solo salen los que siguen publicados: uno retirado no se puede
   comprar. */
export const FavoritesScreen = () => {
  const hydrated = useAppSelector((state) => state.auth.hydrated);
  const { data, isLoading, isError, error } = useGetFavoritesQuery(undefined, {
    skip: !hydrated,
  });

  const header = (
    <PageHeader
      title='Favoritos'
      description='Los productos que guardaste para volver a ellos.'
    />
  );

  if (!hydrated || isLoading) {
    return (
      <>
        {header}
        <p className='font-light'>Cargando...</p>
      </>
    );
  }

  if (isError || !data) {
    return (
      <>
        {header}
        <div className='alert alert-danger'>
          {extractErrorMessage(error, 'No se pudieron cargar tus favoritos.')}
        </div>
      </>
    );
  }

  const products = data.data;

  return (
    <>
      {header}
      {products.length === 0 ? (
        <div className='orders-empty'>
          <Heart size={28} />
          <p className='font-light'>
            Todavía no tienes favoritos. Toca el corazón en la ficha de un producto para
            guardarlo aquí.
          </p>
          <Link href='/catalog' className='btn btn-primary btn-sm'>
            Ir al catálogo
          </Link>
        </div>
      ) : (
        <Row className='g-3'>
          {products.map((product) => (
            <Col key={product.id} xs='6' md='4' xl='3'>
              <ProductCard product={product} href={`/catalog/${product.id}`} />
            </Col>
          ))}
        </Row>
      )}
    </>
  );
};

export default FavoritesScreen;
