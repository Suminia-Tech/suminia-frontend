'use client';

import Link from 'next/link';
import { useState } from 'react';
import { AlertCircle, CheckCircle, Image as ImageIcon, Search } from 'react-feather';

import { useDebouncedValue } from '@/shared/hooks/useDebouncedValue';
import { extractErrorMessage } from '@/shared/lib/apiError';
import { formatDate } from '@/shared/lib/dates';
import { PageHeader, Pagination } from '@/shared/ui';
import { useAppSelector } from '@/store/hooks';

import { useGetProductsQuery } from '../../api/productsApi';
import {
  PRODUCT_STATUS_LABEL,
  PRODUCT_STATUS_TONE,
  getPrimaryImage,
} from '../../lib/productLabels';
import { requiredDocuments } from '../../lib/productTypes';
import type { ProductStatus } from '../../model/product.types';

const PAGE_SIZE = 15;

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

  const reviewing = status === 'PENDING_REVIEW';

  const { data, isLoading, isFetching, isError, error } = useGetProductsQuery(
    {
      page,
      limit: PAGE_SIZE,
      sort: reviewing ? 'submittedAt' : 'updatedAt',
      sortDirection: reviewing ? 'asc' : 'desc',
      ...(debouncedSearch ? { search: debouncedSearch } : {}),
      ...(status ? { filter: { status } } : {}),
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
          </div>
        </div>

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
            <h5>{reviewing ? 'Nada pendiente' : 'No hay productos en este estado'}</h5>
            <p className='font-light'>
              {reviewing
                ? 'Todo lo que enviaron los proveedores ya tiene decisión.'
                : 'Prueba con otro estado o quita la búsqueda.'}
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
