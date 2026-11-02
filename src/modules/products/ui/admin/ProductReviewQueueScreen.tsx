'use client';

import Link from 'next/link';
import { useState } from 'react';
import { AlertCircle, CheckCircle, Image as ImageIcon, Search, X } from 'react-feather';

import { useDebouncedValue } from '@/shared/hooks/useDebouncedValue';
import { extractErrorMessage } from '@/shared/lib/apiError';
import { formatDate } from '@/shared/lib/dates';
import { PageHeader, Pagination, Panel } from '@/shared/ui';
import { useAppSelector } from '@/store/hooks';

import {
  useGetCategoriesQuery,
  useGetProductMetricsQuery,
  useGetProductsQuery,
} from '../../api/productsApi';
import {
  PRODUCT_STATUS_LABEL,
  PRODUCT_STATUS_TONE,
  getPrimaryImage,
} from '../../lib/productLabels';
import { requiredDocuments } from '../../lib/productTypes';
import {
  PRESENTATION_RANGES,
  PRICE_RANGES,
  rangeLabel,
  STOCK_RANGES,
} from '../../lib/staffFilters';
import type { ProductStatus } from '../../model/product.types';

const PAGE_SIZE = 15;

const pesos = (valor: number) =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(valor);

/* Los filtros de analisis: que categoria, a que precio, con cuantas
   presentaciones, con cuanto inventario y de que proveedor. */
interface AnalysisFilters {
  categoryId: string;
  price: string;
  presentations: string;
  stock: string;
  supplierId: string;
}

const NO_FILTERS: AnalysisFilters = {
  categoryId: '',
  price: '',
  presentations: '',
  stock: '',
  supplierId: '',
};

/* La cola de direccion tecnica: lo que los proveedores enviaron a revision y
   todavia nadie decidio.

   Arranca filtrada por "En revision" porque es el trabajo; los demas estados
   quedan a un cambio de filtro para consultar lo ya decidido. Se ordena por la
   fecha de envio, lo mas antiguo primero: un proveedor que espera desde hace
   una semana va antes que uno de esta mañana. */
export const ProductReviewQueueScreen = () => {
  const hydrated = useAppSelector((state) => state.auth.hydrated);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<ProductStatus | ''>('PENDING_REVIEW');
  const debouncedSearch = useDebouncedValue(search);
  const [filters, setFilters] = useState<AnalysisFilters>(NO_FILTERS);

  const reviewing = status === 'PENDING_REVIEW';

  const setFilter = (key: keyof AnalysisFilters, value: string) => {
    setFilters((current) => ({ ...current, [key]: value }));
    setPage(1);
  };

  /* Al contrato del backend: filter[categoryId], filter[minPrice]... */
  const priceRange = PRICE_RANGES.find((range) => range.key === filters.price);
  const filter: Record<string, string> = {
    ...(status ? { status } : {}),
    ...(filters.categoryId ? { categoryId: filters.categoryId } : {}),
    ...(filters.supplierId ? { organizationId: filters.supplierId } : {}),
    ...(priceRange?.min !== undefined ? { minPrice: String(priceRange.min) } : {}),
    ...(priceRange?.max !== undefined ? { maxPrice: String(priceRange.max) } : {}),
    ...(filters.presentations ? { presentations: filters.presentations } : {}),
    ...(filters.stock ? { stock: filters.stock } : {}),
  };

  const { data: categoriesData } = useGetCategoriesQuery(undefined, { skip: !hydrated });
  const categories = categoriesData?.data ?? [];
  const { data: metricsData } = useGetProductMetricsQuery(
    { search: debouncedSearch || undefined, filter },
    { skip: !hydrated },
  );
  const metrics = metricsData?.data;

  const active: { key: keyof AnalysisFilters; label: string; value: string }[] = [
    filters.categoryId && {
      key: 'categoryId' as const,
      label: 'Categoría',
      value: categories.find((c) => c.id === filters.categoryId)?.name ?? '',
    },
    filters.price && {
      key: 'price' as const,
      label: 'Precio',
      value: rangeLabel(PRICE_RANGES, filters.price),
    },
    filters.presentations && {
      key: 'presentations' as const,
      label: 'Presentaciones',
      value: rangeLabel(PRESENTATION_RANGES, filters.presentations),
    },
    filters.stock && {
      key: 'stock' as const,
      label: 'Inventario',
      value: rangeLabel(STOCK_RANGES, filters.stock),
    },
    filters.supplierId && {
      key: 'supplierId' as const,
      label: 'Proveedor',
      value: metrics?.options.suppliers.find((s) => s.id === filters.supplierId)?.name ?? '',
    },
  ].filter((item): item is { key: keyof AnalysisFilters; label: string; value: string } =>
    Boolean(item),
  );

  const { data, isLoading, isFetching, isError, error } = useGetProductsQuery(
    {
      page,
      limit: PAGE_SIZE,
      sort: reviewing ? 'submittedAt' : 'updatedAt',
      sortDirection: reviewing ? 'asc' : 'desc',
      ...(debouncedSearch ? { search: debouncedSearch } : {}),
      ...(Object.keys(filter).length > 0 ? { filter } : {}),
    },
    { skip: !hydrated },
  );

  const products = data?.data.data ?? [];
  const meta = data?.data.meta;

  return (
    <div className='catalog-manager'>
      <PageHeader
        title='Revisión de productos'
        description={
          reviewing && meta
            ? `${meta.totalCount} ${meta.totalCount === 1 ? 'producto espera' : 'productos esperan'} la revisión de dirección técnica.`
            : 'Lo que los proveedores envían para publicar en el catálogo.'
        }
      />

      {/* Lo que suma lo filtrado: las cifras para analizar la oferta. El
          mismo panel de etiqueta y valor del Resumen. */}
      <Panel
        title={
          active.length > 0 || status || debouncedSearch
            ? 'Lo que muestra este filtro'
            : 'Todo el catálogo'
        }
        description='Productos, presentaciones e inventario de lo que deja ver el filtro.'
      >
        <ul className='data-list'>
          <li>
            <span className='font-light'>Productos</span>
            <span>{metrics?.products ?? '—'}</span>
          </li>
          <li>
            <span className='font-light'>Presentaciones</span>
            <span>{metrics?.presentations ?? '—'}</span>
          </li>
          <li>
            <span className='font-light'>Unidades en inventario</span>
            <span>{metrics ? metrics.stock.toLocaleString('es-CO') : '—'}</span>
          </li>
          <li>
            <span className='font-light'>Proveedores</span>
            <span>{metrics?.suppliers ?? '—'}</span>
          </li>
        </ul>
      </Panel>

      <div className={`catalog-panel${isFetching ? ' is-refreshing' : ''}`}>
        <div className='catalog-toolbar'>
          <div className='catalog-search'>
            <Search size={16} />
            <input
              type='search'
              placeholder='Buscar por nombre, marca, referencia o registro'
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
            />
          </div>

          <div className='catalog-toolbar-filters'>
            <select
              className='filter-select'
              aria-label='Estado'
              value={status}
              onChange={(event) => {
                setStatus(event.target.value as ProductStatus | '');
                setPage(1);
              }}
            >
              <option value=''>Todos los estados</option>
              {(Object.keys(PRODUCT_STATUS_LABEL) as ProductStatus[]).map((value) => (
                <option value={value} key={value}>
                  {PRODUCT_STATUS_LABEL[value]}
                </option>
              ))}
            </select>

            <select
              className='filter-select'
              aria-label='Categoría'
              value={filters.categoryId}
              onChange={(event) => setFilter('categoryId', event.target.value)}
            >
              <option value=''>Categoría</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>

            <select
              className='filter-select'
              aria-label='Precio'
              value={filters.price}
              onChange={(event) => setFilter('price', event.target.value)}
            >
              <option value=''>Precio</option>
              {PRICE_RANGES.map((range) => (
                <option key={range.key} value={range.key}>
                  {range.label}
                </option>
              ))}
            </select>

            <select
              className='filter-select'
              aria-label='Presentaciones'
              value={filters.presentations}
              onChange={(event) => setFilter('presentations', event.target.value)}
            >
              <option value=''>Presentaciones</option>
              {PRESENTATION_RANGES.map((range) => (
                <option key={range.key} value={range.key}>
                  {range.label}
                </option>
              ))}
            </select>

            <select
              className='filter-select'
              aria-label='Inventario'
              value={filters.stock}
              onChange={(event) => setFilter('stock', event.target.value)}
            >
              <option value=''>Inventario</option>
              {STOCK_RANGES.map((range) => (
                <option key={range.key} value={range.key}>
                  {range.label}
                </option>
              ))}
            </select>

            <select
              className='filter-select'
              aria-label='Proveedor'
              value={filters.supplierId}
              onChange={(event) => setFilter('supplierId', event.target.value)}
            >
              <option value=''>Proveedor</option>
              {metrics?.options.suppliers.map((supplier) => (
                <option key={supplier.id} value={supplier.id}>
                  {supplier.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Lo que se esta filtrando, en alto y quitable de un clic, como en
            Mis productos. */}
        {active.length > 0 && (
          <div className='catalog-active-filters'>
            {active.map((item) => (
              <button
                type='button'
                key={item.key}
                className='filter-chip'
                onClick={() => setFilter(item.key, '')}
              >
                <span className='font-light'>{item.label}:</span> {item.value}
                <X size={13} />
              </button>
            ))}
            <button
              type='button'
              className='filter-clear'
              onClick={() => {
                setFilters(NO_FILTERS);
                setPage(1);
              }}
            >
              Limpiar todo
            </button>
          </div>
        )}

        {!hydrated || isLoading ? (
          <div className='catalog-skeleton'>
            {Array.from({ length: 5 }).map((_, index) => (
              <div className='catalog-skeleton-row' key={index}>
                <span className='sk sk-thumb' />
                <span className='sk sk-line' />
                <span className='sk sk-short' />
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className='catalog-empty'>
            <AlertCircle size={30} />
            <h5>No se pudo cargar la cola</h5>
            <p className='font-light'>
              {extractErrorMessage(error, 'Vuelve a intentarlo en un momento.')}
            </p>
          </div>
        ) : products.length === 0 ? (
          <div className='catalog-empty'>
            <CheckCircle size={30} />
            <h5>
              {reviewing && active.length === 0
                ? 'Nada pendiente'
                : 'No hay productos con esos filtros'}
            </h5>
            <p className='font-light'>
              {reviewing
                ? 'Todo lo que enviaron los proveedores ya tiene decisión.'
                : 'Prueba con otros filtros o quita la búsqueda.'}
            </p>
          </div>
        ) : (
          <>
            <div className='catalog-table-scroll'>
              <table className='catalog-table'>
                <thead>
                  <tr>
                    <th className='col-product'>Producto</th>
                    <th>Proveedor</th>
                    <th>Categoría</th>
                    <th className='num col-tight'>Presentaciones</th>
                    <th className='num col-tight'>Inventario</th>
                    <th className='num'>Precio</th>
                    <th className='num col-tight'>Documentos</th>
                    <th className='col-tight'>{reviewing ? 'Enviado' : 'Actualizado'}</th>
                    <th className='col-status'>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => {
                    const image = getPrimaryImage(product);
                    const required = requiredDocuments(
                      product.type,
                      product.isManufacturerOrImporter,
                    );
                    const loaded = required.filter((type) =>
                      product.documents.some((document) => document.type === type),
                    ).length;
                    /* El inventario es la suma de sus presentaciones, y el
                       precio, el rango entre la mas barata y la mas cara. */
                    const stock = product.presentations.reduce((sum, p) => sum + p.stock, 0);
                    const prices = product.presentations
                      .map((p) => p.price)
                      .filter((price): price is number => price !== null);
                    const minPrice = prices.length ? Math.min(...prices) : null;
                    const maxPrice = prices.length ? Math.max(...prices) : null;

                    return (
                      <tr key={product.id}>
                        <td>
                          <Link
                            href={`/admin/products/${product.id}`}
                            className='catalog-product'
                          >
                            <span className='catalog-thumb'>
                              {image ? (
                                /* eslint-disable-next-line @next/next/no-img-element --
                                   las imagenes viven en S3 y next/image exigiria
                                   declarar el dominio del bucket en la configuracion. */
                                <img src={image.url} alt={image.alt ?? product.name} />
                              ) : (
                                <ImageIcon size={16} />
                              )}
                            </span>
                            <span className='catalog-product-text'>
                              <strong>{product.name}</strong>
                              <small className='font-light'>
                                {product.brand ?? 'Sin marca'}
                                {product.reference && ` · Ref. ${product.reference}`}
                              </small>
                            </span>
                          </Link>
                        </td>
                        <td className='font-light'>{product.organizationName ?? '—'}</td>
                        <td>
                          <span className='chip'>{product.categoryName ?? '—'}</span>
                        </td>
                        <td className='num font-light'>{product.presentations.length}</td>
                        <td className={`num${stock === 0 ? ' text-danger' : ' font-light'}`}>
                          {stock === 0 ? 'Sin existencias' : stock.toLocaleString('es-CO')}
                        </td>
                        <td className='num font-light text-nowrap'>
                          {minPrice === null
                            ? '—'
                            : minPrice === maxPrice
                              ? pesos(minPrice)
                              : `${pesos(minPrice)} – ${pesos(maxPrice ?? minPrice)}`}
                        </td>
                        <td
                          className={`num${loaded < required.length ? ' text-danger' : ' font-light'}`}
                        >
                          {required.length === 0 ? '—' : `${loaded}/${required.length}`}
                        </td>
                        <td className='font-light text-nowrap'>
                          {formatDate(
                            reviewing
                              ? (product.submittedAt ?? product.updatedAt)
                              : product.updatedAt,
                          )}
                        </td>
                        <td>
                          <span
                            className={`status-pill status-${PRODUCT_STATUS_TONE[product.status]}`}
                          >
                            {PRODUCT_STATUS_LABEL[product.status]}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {meta && (
              <div className='catalog-panel-foot'>
                <Pagination meta={meta} onChange={setPage} label='productos' />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ProductReviewQueueScreen;
