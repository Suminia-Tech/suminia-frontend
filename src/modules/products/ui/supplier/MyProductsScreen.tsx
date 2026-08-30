'use client';

import { useState } from 'react';
import { Image as ImageIcon, PlusCircle } from 'react-feather';
import { toast } from 'react-toastify';
import { Table } from 'reactstrap';

import { extractErrorMessage } from '@/shared/lib/apiError';
import { canOperate } from '@/shared/lib/organizationAccess';
import { hasPermission } from '@/shared/lib/permissions';
import { ConfirmModal } from '@/shared/ui';
import { useAppSelector } from '@/store/hooks';

import { useDeleteProductMutation, useGetProductsQuery } from '../../api/productsApi';
import {
  PRODUCT_STATUS_CLASS,
  PRODUCT_STATUS_LABEL,
  formatPriceRange,
  getPrimaryImage,
  getTotalStock,
} from '../../lib/productLabels';
import type { Product } from '../../model/product.types';
import ProductFormModal from './ProductFormModal';
import ProductImagesModal from './ProductImagesModal';

/* Catalogo propio del proveedor. El backend ya devuelve solo lo de su empresa
   —y a el si le muestra los borradores—, de modo que aqui no se filtra nada. */
export const MyProductsScreen = () => {
  const user = useAppSelector((state) => state.auth.user);
  const hydrated = useAppSelector((state) => state.auth.hydrated);

  const [editing, setEditing] = useState<Product | null>(null);
  const [isFormOpen, setFormOpen] = useState(false);
  const [imagesFor, setImagesFor] = useState<Product | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Product | null>(null);

  const { data, isLoading, isError, error } = useGetProductsQuery(
    { limit: 50, sort: 'updatedAt', sortDirection: 'desc' },
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

  if (!hydrated || isLoading) {
    return <p className='font-light'>Cargando...</p>;
  }

  if (isError) {
    return (
      <div className='alert alert-danger'>
        {extractErrorMessage(error, 'No se pudo cargar el catálogo.')}
      </div>
    );
  }

  const products = data?.data.data ?? [];

  /* La galeria se alimenta de la lista, no de una consulta aparte: asi la
     imagen recien subida aparece sola cuando RTK Query invalida el listado. */
  const imagesProduct = imagesFor
    ? (products.find((item) => item.id === imagesFor.id) ?? imagesFor)
    : null;

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

      {products.length === 0 ? (
        <p className='font-light'>
          Todavía no tienes productos. Crea el primero y quedará como borrador hasta
          que decidas publicarlo.
        </p>
      ) : (
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
                    <td className='text-end'>
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
