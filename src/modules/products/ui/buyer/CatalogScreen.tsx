'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Image as ImageIcon } from 'react-feather';
import { Col, Container, Row } from 'reactstrap';

import { useDebouncedValue } from '@/shared/hooks/useDebouncedValue';
import { extractErrorMessage } from '@/shared/lib/apiError';
import { Pagination } from '@/shared/ui';
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
const PAGE_SIZE = 24;

export const CatalogScreen = () => {
  const hydrated = useAppSelector((state) => state.auth.hydrated);
  const [categoryId, setCategoryId] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  /* Sin retraso, escribir "guantes" son siete consultas de las que solo importa
     la ultima. */
  const debouncedSearch = useDebouncedValue(search);

  /* Cambiar un criterio vuelve a la primera pagina. Se hace en el manejador y
     no en un efecto: reaccionar al cambio con setState encadena un render de
     mas y deja un instante en el que la pagina y el filtro no concuerdan. */
  const changeSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const changeCategory = (value: string) => {
    setCategoryId(value);
    setPage(1);
  };

  const { data: categoriesData } = useGetCategoriesQuery(undefined, { skip: !hydrated });
  const categories = categoriesData?.data ?? [];

  const { data, isLoading, isFetching, isError, error } = useGetProductsQuery(
    {
      page,
      limit: PAGE_SIZE,
      sort: 'name',
      sortDirection: 'asc',
      ...(debouncedSearch ? { search: debouncedSearch } : {}),
      ...(categoryId ? { filter: { categoryId } } : {}),
    },
    { skip: !hydrated },
  );

  const products = data?.data.data ?? [];
  const meta = data?.data.meta;

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
              onChange={(event) => changeSearch(event.target.value)}
            />
          </Col>
          <Col md='5'>
            <select
              className='form-control'
              value={categoryId}
              onChange={(event) => changeCategory(event.target.value)}
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
          /* isFetching sin isLoading es una recarga con datos ya en pantalla: se
             atenua en vez de vaciarse, para que la rejilla no salte al filtrar. */
          <div className={isFetching ? 'is-refreshing' : undefined}>
            <Row className='g-3'>
            {products.map((product) => {
              const image = getPrimaryImage(product);

              return (
                <Col key={product.id} xs='6' md='4' lg='3'>
                  <Link href={`/buyer/catalog/${product.id}`} className='catalog-card'>
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
                  </Link>
                </Col>
              );
            })}
            </Row>

            {meta && <Pagination meta={meta} onChange={setPage} label='productos' />}
          </div>
        )}
      </Container>
    </section>
  );
};
