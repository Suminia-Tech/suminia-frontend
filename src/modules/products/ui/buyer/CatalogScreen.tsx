'use client';

import { useState } from 'react';
import { Image as ImageIcon } from 'react-feather';
import { Col, Container, Row } from 'reactstrap';

import { extractErrorMessage } from '@/shared/lib/apiError';
import { useAppSelector } from '@/store/hooks';

import { useGetCategoriesQuery, useGetProductsQuery } from '../../api/productsApi';
import { formatPriceRange, getPrimaryImage } from '../../lib/productLabels';

/* Catalogo que navega el comprador.

   Es el mismo endpoint que usa el proveedor para su panel: el backend devuelve
   dos lecturas distintas segun quien pregunta, de modo que aqui llegan solo
   productos publicados de empresas habilitadas. No hay que filtrar nada, y
   tampoco se podria: los borradores ajenos nunca salen del backend.

   Vive en ui/buyer/ y no comparte una linea con MyProductsScreen a proposito.
   Son dos trabajos distintos —uno administra, el otro compra— y mezclarlos
   habria terminado en una pantalla llena de condicionales. */
export const CatalogScreen = () => {
  const hydrated = useAppSelector((state) => state.auth.hydrated);
  const [categoryId, setCategoryId] = useState('');
  const [search, setSearch] = useState('');

  const { data: categoriesData } = useGetCategoriesQuery(undefined, { skip: !hydrated });
  const categories = categoriesData?.data ?? [];

  const { data, isLoading, isError, error } = useGetProductsQuery(
    {
      limit: 24,
      sort: 'name',
      sortDirection: 'asc',
      ...(search ? { search } : {}),
      ...(categoryId ? { filter: { categoryId } } : {}),
    },
    { skip: !hydrated },
  );

  const products = data?.data.data ?? [];

  return (
    <section className='section-b-space'>
      <Container>
        <div className='box-head'>
          <h3>Catálogo</h3>
        </div>

        <Row className='mb-4 g-2'>
          <Col md='7'>
            <input
              type='search'
              className='form-control'
              placeholder='Buscar un producto'
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </Col>
          <Col md='5'>
            <select
              className='form-control'
              value={categoryId}
              onChange={(event) => setCategoryId(event.target.value)}
            >
              <option value=''>Todas las categorías</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </Col>
        </Row>

        {!hydrated || isLoading ? (
          <p className='font-light'>Cargando...</p>
        ) : isError ? (
          <div className='alert alert-danger'>
            {extractErrorMessage(error, 'No se pudo cargar el catálogo.')}
          </div>
        ) : products.length === 0 ? (
          <p className='font-light'>
            No hay productos que coincidan con lo que buscas.
          </p>
        ) : (
          <Row className='g-3'>
            {products.map((product) => {
              const image = getPrimaryImage(product);

              return (
                <Col key={product.id} xs='6' md='4' lg='3'>
                  <article className='catalog-card'>
                    <div className='catalog-card-media'>
                      {image ? (
                        /* eslint-disable-next-line @next/next/no-img-element --
                           las imagenes viven en S3 y next/image exigiria
                           declarar el dominio del bucket en la configuracion. */
                        <img src={image.url} alt={image.alt ?? product.name} />
                      ) : (
                        <ImageIcon size={22} />
                      )}
                    </div>
                    <div className='catalog-card-body'>
                      <h5>{product.name}</h5>
                      <p className='font-light'>
                        {product.organizationName ?? 'Proveedor'}
                      </p>
                      <strong>{formatPriceRange(product)}</strong>
                      <small className='font-light d-block'>
                        {product.presentations.length === 1
                          ? '1 formato'
                          : `${product.presentations.length} formatos`}
                      </small>
                    </div>
                  </article>
                </Col>
              );
            })}
          </Row>
        )}
      </Container>
    </section>
  );
};
