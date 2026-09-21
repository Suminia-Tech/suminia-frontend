'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { Lock } from 'react-feather';
import { Col, Row } from 'reactstrap';

import { useDebouncedValue } from '@/shared/hooks/useDebouncedValue';
import { useMounted } from '@/shared/hooks/useMounted';
import { extractErrorMessage } from '@/shared/lib/apiError';
import { Breadcrumbs, Pagination } from '@/shared/ui';
import { useAppSelector } from '@/store/hooks';

import { useGetPublicCategoriesQuery } from '../../api/productsApi';
import { useCatalogProducts } from '../../hooks/useCatalogProducts';
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
  /* El aviso de precios no lo puede pintar el servidor: depende de la sesion,
     que se lee de localStorage y el servidor no ve. Hacen falta las dos
     condiciones.

     `mounted` es lo que garantiza que el primer render del navegador coincida
     con lo que mando el servidor. `hydrated` por si solo no bastaba: lo
     enciende un efecto de `AuthInitializer`, que esta arriba del arbol, y esta
     pantalla cuelga de un `<Suspense>` —lo necesita por `useSearchParams`—, de
     modo que al reanudarse ya valia `true` y React encontraba el aviso donde el
     servidor habia puesto la fila de filtros. Tiraba el trozo entero y lo
     rehacia, con un error de hidratacion en consola en cada carga.

     `hydrated` sigue haciendo falta, pero por otra razon: sin el, entre el
     montaje y la lectura de la sesion se le enseñaria el aviso de "registrate"
     a alguien que ya tiene cuenta. */
  const mounted = useMounted();
  const hydrated = useAppSelector((state) => state.auth.hydrated);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  /* El buscador de la cabecera y las categorias de la portada llegan aqui por
     la URL, de modo que hay que leerla: sin esto se navegaba a
     /catalog?search=amoxicilina y la pantalla mostraba el catalogo entero.

     Solo para el valor inicial. A partir de ahi manda el estado: reaccionar a
     cada cambio de la URL pelearia con lo que el usuario esta escribiendo. */
  const params = useSearchParams();
  const [categoryId, setCategoryId] = useState(() => params.get('categoryId') ?? '');
  const [search, setSearch] = useState(() => params.get('search') ?? '');
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

  const { data, isLoading, isFetching, isError, error } = useCatalogProducts({
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
        <Breadcrumbs
          steps={[{ label: 'Inicio', href: '/' }, { label: 'Catálogo' }]}
        />

        <div className='box-head'>
          <h3>Catálogo</h3>
        </div>

        {/* Se dice por que no hay precios antes de que el visitante lo note, no
            despues: encontrarse cifras borrosas sin explicacion se lee como un
            fallo de la pagina.

            Solo a quien no ha entrado: al que ya tiene sesion y espera
            aprobacion se lo cuenta la franja de arriba, con su situacion
            concreta, y repetirlo aqui seria decirle dos veces lo mismo. */}
        {mounted && hydrated && !isAuthenticated && (
          <div className='public-price-notice'>
            <Lock size={15} />
            <span>
              Los precios son visibles para empresas registradas y aprobadas.{' '}
              <Link href='/register'>Registra la tuya</Link> para verlos.
            </span>
          </div>
        )}

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
