'use client';

import { useState } from 'react';
import { Image as ImageIcon, PlusCircle } from 'react-feather';
import { toast } from 'react-toastify';
import { Col, Row, Table } from 'reactstrap';

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
  PRODUCT_STATUS_CLASS,
  PRODUCT_STATUS_LABEL,
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

  return (
    <>
      <div className='box-head'>
        <h3>Mis productos</h3>
        {canCreate && (
          /* .box-head es flex pero sin space-between: ms-auto empuja la accion
             al extremo sin tocar el resto de encabezados del tema. */
          <a
            className='ms-auto fw-bold d-inline-flex align-items-center gap-1'
            href='#javascript'
            onClick={(event) => {
              event.preventDefault();
              openCreate();
            }}
          >
            <PlusCircle size={16} />
            Nuevo producto
          </a>
        )}
      </div>

      {!isOperational && (
        <div className='alert alert-warning'>
          Tu empresa está pendiente de aprobación. Podrás publicar productos cuando el
          equipo de Suminia la verifique.
        </div>
      )}

      <Row className='mb-3 g-2'>
        <Col md='6'>
          <input
            type='search'
            className='form-control'
            placeholder='Buscar por nombre, marca o fabricante'
            value={search}
            onChange={(event) => changeSearch(event.target.value)}
          />
        </Col>
        <Col md='3'>
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
        <Col md='3'>
          <select
            className='form-control'
            value={status}
            onChange={(event) => changeStatus(event.target.value as ProductStatus | '')}
          >
            <option value=''>Todos los estados</option>
            <option value='DRAFT'>Borrador</option>
            <option value='ACTIVE'>Publicado</option>
            <option value='INACTIVE'>Retirado</option>
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
          {hasFilters
            ? 'No hay productos que coincidan con lo que buscas.'
            : 'Todavía no tienes productos. Crea el primero y quedará como borrador hasta que decidas publicarlo.'}
        </p>
      ) : (
        /* isFetching sin isLoading es una recarga con datos ya en pantalla: se
           atenua en vez de vaciarse, para que la tabla no salte al filtrar. */
        <div className={isFetching ? 'is-refreshing' : undefined}>
          <Table responsive className='align-middle'>
            <thead>
              <tr>
                <th>Producto</th>
                <th>Categoría</th>
                <th>Formatos</th>
                <th>Precio</th>
                <th>Inventario</th>
                <th>Estado</th>
                {(canUpdate || canDelete) && <th className='text-end'>Acciones</th>}
              </tr>
            </thead>
            <tbody>
              {products.map((product) => {
                const image = getPrimaryImage(product);

                return (
                  <tr key={product.id}>
                    <td>
                      <div className='d-flex align-items-center gap-2'>
                        <span className='product-thumb'>
                          {image ? (
                            /* eslint-disable-next-line @next/next/no-img-element --
                               las imagenes viven en S3 y next/image exigiria
                               declarar el dominio del bucket en la configuracion. */
                            <img src={image.url} alt={image.alt ?? product.name} />
                          ) : (
                            <ImageIcon size={16} />
                          )}
                        </span>
                        <span>
                          {product.name}
                          {product.brand && (
                            <small className='font-light d-block'>{product.brand}</small>
                          )}
                        </span>
                      </div>
                    </td>
                    <td className='font-light'>{product.categoryName ?? '—'}</td>
                    <td className='font-light'>{product.presentations.length}</td>
                    <td>{formatPriceRange(product)}</td>
                    <td className='font-light'>{getTotalStock(product)}</td>
                    <td>
                      <span className={`badge ${PRODUCT_STATUS_CLASS[product.status]}`}>
                        {PRODUCT_STATUS_LABEL[product.status]}
                      </span>
                    </td>
                    {(canUpdate || canDelete) && (
                      <td className='text-end text-nowrap'>
                        {canUpdate && (
                          <>
                            <button
                              type='button'
                              className='btn btn-sm'
                              onClick={() => openEdit(product)}
                            >
                              Editar
                            </button>
                            <button
                              type='button'
                              className='btn btn-sm'
                              onClick={() => setFormatsFor(product)}
                            >
                              Formatos ({product.presentations.length})
                            </button>
                            <button
                              type='button'
                              className='btn btn-sm'
                              onClick={() => setImagesFor(product)}
                            >
                              Imágenes ({product.images.length})
                            </button>
                          </>
                        )}
                        {canDelete && (
                          <button
                            type='button'
                            className='btn btn-sm text-danger'
                            onClick={() => setPendingDelete(product)}
                          >
                            Eliminar
                          </button>
                        )}
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </Table>

          {meta && <Pagination meta={meta} onChange={setPage} label='productos' />}
        </div>
      )}

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
    </>
  );
};
