'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Lock } from 'react-feather';
import { Col, Row } from 'reactstrap';

import { useDebouncedValue } from '@/shared/hooks/useDebouncedValue';
import { extractErrorMessage } from '@/shared/lib/apiError';
import { Pagination } from '@/shared/ui';

import {
  useGetPublicCategoriesQuery,
  useGetPublicProductsQuery,
} from '../../api/productsApi';
import { ProductCard } from '../common/ProductCard';

/* El catalogo que se ve sin haber entrado.

   Va contra /public/products, que en el backend no lleva guardas y devuelve
   solo lo publicado por empresas habilitadas. Los precios no vienen: no es que
   esta pantalla los tape, es que la respuesta no los trae.

   No espera a `hydrated` como las pantallas de dentro: no hay sesion que leer,
   y hacerlo dejaria la primera pintada en blanco para un visitante que llega
   desde una busqueda. */
const PAGE_SIZE = 24;

export const PublicCatalogScreen = () => {
  const [categoryId, setCategoryId] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const debouncedSearch = useDebouncedValue(search);

  const changeSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const changeCategory = (value: string) => {
    setCategoryId(value);
    setPage(1);
  };

  const { data: categoriesData } = useGetPublicCategoriesQuery();
  const categories = categoriesData?.data ?? [];

  const { data, isLoading, isFetching, isError, error } = useGetPublicProductsQuery({
    page,
    limit: PAGE_SIZE,
    sort: 'name',
    sortDirection: 'asc',
    ...(debouncedSearch ? { search: debouncedSearch } : {}),
    ...(categoryId ? { filter: { categoryId } } : {}),
  });

  const products = data?.data.data ?? [];
  const meta = data?.data.meta;

  return (
    <section className='section-b-space'>
      <div className='container-fluid-lg'>
        <div className='box-head'>
          <h3>Catálogo</h3>
        </div>

        {/* Se dice por que no hay precios antes de que el visitante lo note, no
            despues: encontrarse cifras borrosas sin explicacion se lee como un
            fallo de la pagina. */}
        <div className='public-price-notice'>
          <Lock size={15} />
          <span>
            Los precios son visibles para empresas registradas y aprobadas.{' '}
            <Link href='/register'>Registra la tuya</Link> para verlos.
          </span>
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

        {isLoading ? (
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
          <div className={isFetching ? 'is-refreshing' : undefined}>
            <Row className='g-3'>
              {products.map((product) => (
                <Col key={product.id} xs='6' md='4' lg='3'>
                  <ProductCard product={product} href={`/catalog/${product.id}`} />
                </Col>
              ))}
            </Row>

            {meta && <Pagination meta={meta} onChange={setPage} label='productos' />}
          </div>
        )}
      </div>
    </section>
  );
};

export default PublicCatalogScreen;
