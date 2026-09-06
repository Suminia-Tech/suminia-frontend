'use client';

import { useState } from 'react';
import {
  AlertCircle,
  Edit2,
  Image as ImageIcon,
  Layers,
  Package,
  Plus,
  Search,
  Trash2,
  X,
} from 'react-feather';
import { toast } from 'react-toastify';

import { useDebouncedValue } from '@/shared/hooks/useDebouncedValue';
import { extractErrorMessage } from '@/shared/lib/apiError';
import { canOperate } from '@/shared/lib/organizationAccess';
import { hasPermission } from '@/shared/lib/permissions';
import { ConfirmModal, Pagination } from '@/shared/ui';
import { useAppSelector } from '@/store/hooks';

import {
  useDeleteProductMutation,
  useGetCategoriesQuery,
  useGetProductsQuery,
} from '../../api/productsApi';
import {
  PRODUCT_STATUS_LABEL,
  PRODUCT_STATUS_TONE,
  formatPriceRange,
  getPrimaryImage,
  getTotalStock,
} from '../../lib/productLabels';
import type { Product, ProductStatus } from '../../model/product.types';
import ProductFormModal from './ProductFormModal';
import ProductImagesModal from './ProductImagesModal';
import ProductPresentationsModal from './ProductPresentationsModal';

const PAGE_SIZE = 15;

/* Catalogo propio del proveedor. El backend ya devuelve solo lo de su empresa
   —y a el si le muestra los borradores—, de modo que aqui no se filtra nada por
   pertenencia: los filtros de esta pantalla son de busqueda, no de permiso. */
export const MyProductsScreen = () => {
  const user = useAppSelector((state) => state.auth.user);
  const hydrated = useAppSelector((state) => state.auth.hydrated);

  const [editing, setEditing] = useState<Product | null>(null);
  const [isFormOpen, setFormOpen] = useState(false);
  const [imagesFor, setImagesFor] = useState<Product | null>(null);
  const [formatsFor, setFormatsFor] = useState<Product | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Product | null>(null);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [status, setStatus] = useState<ProductStatus | ''>('');

  /* La busqueda se retrasa para no consultar en cada tecla; los desplegables
     no, porque un cambio de filtro es una sola decision. */
  const debouncedSearch = useDebouncedValue(search);

  /* Cualquier cambio de criterio vuelve a la primera pagina: quedarse en la
     cuatro tras filtrar suele dar una lista vacia que parece un error.

     Se hace en el manejador y no en un efecto: reaccionar al cambio con
     setState encadena un render de mas y deja un instante en el que la pagina
     y el filtro no concuerdan. */
  const changeSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const changeCategory = (value: string) => {
    setCategoryId(value);
    setPage(1);
  };

  const changeStatus = (value: ProductStatus | '') => {
    setStatus(value);
    setPage(1);
  };

  const { data: categoriesData } = useGetCategoriesQuery(undefined, { skip: !hydrated });
  const categories = categoriesData?.data ?? [];

  const { data, isLoading, isFetching, isError, error } = useGetProductsQuery(
    {
      page,
      limit: PAGE_SIZE,
      sort: 'updatedAt',
      sortDirection: 'desc',
      ...(debouncedSearch ? { search: debouncedSearch } : {}),
      ...(categoryId || status
        ? {
            filter: {
              ...(categoryId ? { categoryId } : {}),
              ...(status ? { status } : {}),
            },
          }
        : {}),
    },
    { skip: !hydrated },
  );
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();

  /* El backend bloquea las altas si la empresa no esta aprobada
     (ActiveOrganizationGuard), de modo que ofrecerlas seria ofrecer un 403. */
  const isOperational = canOperate(user?.organizationStatus);
  const canCreate = hasPermission(user?.permissions, 'product:create') && isOperational;
  const canUpdate = hasPermission(user?.permissions, 'product:update') && isOperational;
  const canDelete = hasPermission(user?.permissions, 'product:delete') && isOperational;

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const openEdit = (product: Product) => {
    setEditing(product);
    setFormOpen(true);
  };

  const confirmRemove = async () => {
    if (!pendingDelete) return;

    try {
      await deleteProduct(pendingDelete.id).unwrap();
      toast.success('Producto retirado del catálogo');
      setPendingDelete(null);
    } catch (err) {
      toast.error(extractErrorMessage(err, 'No se pudo eliminar el producto.'));
    }
  };

  const products = data?.data.data ?? [];
  const meta = data?.data.meta;
  const hasFilters = Boolean(debouncedSearch || categoryId || status);

  /* Los modales se alimentan de la lista, no de una consulta aparte: asi lo que
     se acaba de cambiar aparece solo cuando RTK Query invalida el listado. */
  const fresh = (candidate: Product | null) =>
    candidate ? (products.find((item) => item.id === candidate.id) ?? candidate) : null;

  const imagesProduct = fresh(imagesFor);
  const formatsProduct = fresh(formatsFor);

  const activeFilters = [
    debouncedSearch && {
      key: 'search',
      label: 'Búsqueda',
      value: debouncedSearch,
      clear: () => changeSearch(''),
    },
    categoryId && {
      key: 'category',
      label: 'Categoría',
      value: categories.find((c) => c.id === categoryId)?.name ?? '',
      clear: () => changeCategory(''),
    },
    status && {
      key: 'status',
      label: 'Estado',
      value: PRODUCT_STATUS_LABEL[status],
      clear: () => changeStatus(''),
    },
  ].filter(Boolean) as { key: string; label: string; value: string; clear: () => void }[];

  const clearFilters = () => {
    setSearch('');
    setCategoryId('');
    setStatus('');
    setPage(1);
  };

  return (
    <div className='catalog-manager'>
      <header className='catalog-header'>
        <div>
          <h3>Mis productos</h3>
          <p className='font-light'>
            {meta
              ? `${meta.totalCount} ${meta.totalCount === 1 ? 'producto' : 'productos'} en tu catálogo`
              : 'Lo que tu empresa ofrece en Suminia'}
          </p>
        </div>

        {canCreate && (
          <button
            type='button'
            className='btn btn-primary rounded-1 d-inline-flex align-items-center gap-2'
            onClick={openCreate}
          >
            <Plus size={16} />
            Nuevo producto
          </button>
        )}
      </header>

      {!isOperational && (
        <div className='alert alert-warning'>
          Tu empresa está pendiente de aprobación. Podrás publicar productos cuando el
          equipo de Suminia la verifique.
        </div>
      )}

      {/* Un solo panel: barra de filtros, filtros activos y tabla. Antes la barra
          flotaba en su propia tarjeta y parecia un bloque sin relacion con lo
          que hay debajo, cuando es exactamente lo que lo gobierna. */}
      <div className={`catalog-panel${isFetching ? ' is-refreshing' : ''}`}>
        <div className='catalog-toolbar'>
          <div className='catalog-search'>
            <Search size={16} />
            <input
              type='search'
              placeholder='Buscar por nombre, marca o fabricante'
              value={search}
              onChange={(event) => changeSearch(event.target.value)}
            />
          </div>

          <div className='catalog-toolbar-filters'>
            <select
              className='filter-select'
              aria-label='Categoría'
              value={categoryId}
              onChange={(event) => changeCategory(event.target.value)}
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
              aria-label='Estado'
              value={status}
              onChange={(event) => changeStatus(event.target.value as ProductStatus | '')}
            >
              <option value=''>Estado</option>
              <option value='DRAFT'>Borrador</option>
              <option value='ACTIVE'>Publicado</option>
              <option value='INACTIVE'>Retirado</option>
            </select>
          </div>
        </div>

        {/* Lo que se esta filtrando ahora, en alto. Un desplegable que ya eligio
            algo solo lo dice si lo miras; el chip ademas se quita de un clic, sin
            volver a abrir el menu del que salio. */}
        {activeFilters.length > 0 && (
          <div className='catalog-active-filters'>
            {activeFilters.map((filter) => (
              <button
                type='button'
                key={filter.key}
                className='filter-chip'
                onClick={filter.clear}
              >
                <span className='font-light'>{filter.label}:</span> {filter.value}
                <X size={13} />
              </button>
            ))}
            <button type='button' className='filter-clear' onClick={clearFilters}>
              Limpiar todo
            </button>
          </div>
        )}

        {!hydrated || isLoading ? (
          /* Esqueleto en vez de un "Cargando...": conserva el alto de la tabla,
             de modo que el contenido no salta cuando llega. */
          <div className='catalog-skeleton'>
            {Array.from({ length: 6 }).map((_, index) => (
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
            <h5>No se pudo cargar el catálogo</h5>
            <p className='font-light'>
              {extractErrorMessage(error, 'Vuelve a intentarlo en un momento.')}
            </p>
          </div>
        ) : products.length === 0 ? (
          <div className='catalog-empty'>
            <Package size={30} />
            {hasFilters ? (
              <>
                <h5>Nada coincide con lo que buscas</h5>
                <p className='font-light'>Prueba con otro término o quita los filtros.</p>
                <button
                  type='button'
                  className='btn btn-outline-secondary rounded-1'
                  onClick={clearFilters}
                >
                  Limpiar filtros
                </button>
              </>
            ) : (
              <>
                <h5>Tu catálogo está vacío</h5>
                <p className='font-light'>
                  Crea tu primer producto. Queda como borrador hasta que decidas
                  publicarlo, así que puedes prepararlo con calma.
                </p>
                {canCreate && (
                  <button
                    type='button'
                    className='btn btn-primary rounded-1 d-inline-flex align-items-center gap-2'
                    onClick={openCreate}
                  >
                    <Plus size={16} />
                    Nuevo producto
                  </button>
                )}
              </>
            )}
          </div>
        ) : (
          <>
            <div className='catalog-table-scroll'>
              <table className='catalog-table'>
                <thead>
                  <tr>
                    <th className='col-product'>Producto</th>
                    <th className='col-category'>Categoría</th>
                    <th className='num col-tight'>Formatos</th>
                    <th className='num col-price'>Precio</th>
                    <th className='num col-tight'>Inventario</th>
                    <th className='col-status'>Estado</th>
                    {(canUpdate || canDelete) && <th className='actions'></th>}
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => {
                    const image = getPrimaryImage(product);
                    const stock = getTotalStock(product);

                    return (
                      <tr key={product.id}>
                        <td>
                          <div className='catalog-product'>
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
                                {product.brand ?? product.manufacturer ?? 'Sin marca'}
                              </small>
                            </span>
                          </div>
                        </td>
                        <td>
                          <span className='chip'>{product.categoryName ?? '—'}</span>
                        </td>
                        <td className='num font-light'>{product.presentations.length}</td>
                        <td className='num'>
                          <strong>{formatPriceRange(product)}</strong>
                        </td>
                        <td className={`num${stock === 0 ? ' text-danger' : ' font-light'}`}>
                          {stock === 0 ? 'Agotado' : stock}
                        </td>
                        <td>
                          <span
                            className={`status-pill status-${PRODUCT_STATUS_TONE[product.status]}`}
                          >
                            {PRODUCT_STATUS_LABEL[product.status]}
                          </span>
                        </td>
                        {(canUpdate || canDelete) && (
                          <td className='actions'>
                            <div className='row-actions'>
                              {canUpdate && (
                                <>
                                  <button
                                    type='button'
                                    title='Editar producto'
                                    aria-label='Editar producto'
                                    onClick={() => openEdit(product)}
                                  >
                                    <Edit2 size={15} />
                                  </button>
                                  {/* El contador va dentro del boton: saber cuantos
                                      formatos e imagenes tiene cada producto es lo
                                      que dice cual esta a medio preparar. */}
                                  <button
                                    type='button'
                                    title='Formatos de venta'
                                    aria-label='Formatos de venta'
                                    onClick={() => setFormatsFor(product)}
                                  >
                                    <Layers size={15} />
                                    <span>{product.presentations.length}</span>
                                  </button>
                                  <button
                                    type='button'
                                    title='Imágenes'
                                    aria-label='Imágenes'
                                    className={
                                      product.images.length === 0 ? 'is-empty' : undefined
                                    }
                                    onClick={() => setImagesFor(product)}
                                  >
                                    <ImageIcon size={15} />
                                    <span>{product.images.length}</span>
                                  </button>
                                </>
                              )}
                              {canDelete && (
                                <button
                                  type='button'
                                  className='is-danger'
                                  title='Eliminar producto'
                                  aria-label='Eliminar producto'
                                  onClick={() => setPendingDelete(product)}
                                >
                                  <Trash2 size={15} />
                                </button>
                              )}
                            </div>
                          </td>
                        )}
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

      {isFormOpen && (
        /* La key remonta el formulario al cambiar de producto: su estado se
           calcula al montar, y sin ella "editar" reutilizaria los campos del
           producto anterior. */
        <ProductFormModal
          key={editing?.id ?? 'nuevo'}
          isOpen={isFormOpen}
          product={editing}
          onClose={() => {
            setFormOpen(false);
            setEditing(null);
          }}
        />
      )}

      {formatsProduct && (
        <ProductPresentationsModal
          isOpen={Boolean(formatsProduct)}
          product={formatsProduct}
          onClose={() => setFormatsFor(null)}
        />
      )}

      {pendingDelete && (
        <ConfirmModal
          isOpen={Boolean(pendingDelete)}
          onClose={() => setPendingDelete(null)}
          onConfirm={confirmRemove}
          isLoading={isDeleting}
          title='¿Eliminar este producto?'
          confirmLabel='Sí, eliminar'
        >
          <p className='mb-1'>
            <strong>{pendingDelete.name}</strong>
          </p>
          <p className='mb-0'>
            Se retira del catálogo junto con sus {pendingDelete.presentations.length}{' '}
            {pendingDelete.presentations.length === 1 ? 'formato' : 'formatos'}
            {pendingDelete.images.length > 0 &&
              ` y sus ${pendingDelete.images.length} ${
                pendingDelete.images.length === 1 ? 'imagen' : 'imágenes'
              }`}
            . Los pedidos que ya lo incluyan lo conservan.
          </p>
        </ConfirmModal>
      )}

      {imagesProduct && (
        <ProductImagesModal
          isOpen={Boolean(imagesProduct)}
          product={imagesProduct}
          onClose={() => setImagesFor(null)}
        />
      )}
    </div>
  );
};
