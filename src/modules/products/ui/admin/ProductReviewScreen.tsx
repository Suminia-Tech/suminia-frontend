'use client';

import Link from 'next/link';
import { useState } from 'react';
import { AlertTriangle, ChevronLeft, ExternalLink, FileText } from 'react-feather';
import { toast } from 'react-toastify';

import { extractErrorMessage } from '@/shared/lib/apiError';
import { formatDate } from '@/shared/lib/dates';
import { hasPermission } from '@/shared/lib/permissions';
import { Panel } from '@/shared/ui';
import { useAppSelector } from '@/store/hooks';

import { useGetProductQuery, useReviewProductMutation } from '../../api/productsApi';
import { useOpenDocument } from '../../hooks/useOpenDocument';
import {
  PRODUCT_STATUS_LABEL,
  PRODUCT_STATUS_TONE,
  formatPrice,
} from '../../lib/productLabels';
import { DOCUMENT_LABEL, requiredDocuments } from '../../lib/productTypes';
import { taxLabel } from '../../lib/tax';
import type { ReviewDecision } from '../../model/product.types';

/* La ficha que usa direccion tecnica para decidir si un producto entra al
   catalogo. Se ordena como la de una empresa: a la izquierda lo que hay que
   leer —lo que declaro el proveedor, sus presentaciones—, a la derecha los
   documentos que lo respaldan y el boton.

   El registro sanitario va arriba y junto a los documentos, porque cotejarlo
   con el certificado es la mitad del trabajo. En un medicamento no lo declara
   el proveedor: se lee del maestro del INVIMA, y se dice de donde sale. */
export const ProductReviewScreen = ({ productId }: { productId: string }) => {
  const permissions = useAppSelector((state) => state.auth.user?.permissions);
  const hydrated = useAppSelector((state) => state.auth.hydrated);

  const { data, isLoading, isError, error } = useGetProductQuery(productId, {
    skip: !hydrated,
  });
  const [review, { isLoading: isDeciding }] = useReviewProductMutation();
  const { open, opening } = useOpenDocument(productId);

  /* El motivo se escribe antes de devolver, en el mismo panel: un rechazo sin
     motivo deja al proveedor adivinando, y el backend lo exige. */
  const [rejecting, setRejecting] = useState(false);
  const [note, setNote] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!hydrated || isLoading) {
    return <p className='font-light'>Cargando...</p>;
  }

  if (isError || !data) {
    return (
      <div className='alert alert-danger'>
        {extractErrorMessage(error, 'No se pudo cargar el producto.')}
      </div>
    );
  }

  const product = data.data;
  const isMedicine = product.type === 'MEDICINE';
  const required = requiredDocuments(product.type, product.isManufacturerOrImporter);
  const missingDocuments = required.filter(
    (type) => !product.documents.some((document) => document.type === type),
  );
  const canDecide =
    hasPermission(permissions, 'product:approve') && product.status === 'PENDING_REVIEW';

  const decide = async (decision: ReviewDecision) => {
    setErrorMessage(null);
    try {
      await review({
        id: product.id,
        data: decision === 'REJECT' ? { decision, note: note.trim() } : { decision },
      }).unwrap();
      toast.success(decision === 'APPROVE' ? 'Producto publicado' : 'Producto devuelto');
      setRejecting(false);
      setNote('');
    } catch (err) {
      setErrorMessage(extractErrorMessage(err, 'No se pudo registrar la decisión.'));
    }
  };

  const datos = [
    { label: 'Categoría', value: product.categoryName },
    { label: 'Marca', value: product.brand },
    { label: 'Referencia / modelo', value: product.reference },
    { label: 'Fabricante', value: product.manufacturer },
    {
      label: 'Registro sanitario',
      value: isMedicine
        ? (product.catalogMedicine?.registroSanitario ?? null)
        : product.sanitaryRegistration,
    },
    { label: 'IVA', value: taxLabel(product.taxCategory) },
    ...(product.type === 'MEDICAL_DEVICE'
      ? [
          {
            label: 'Fabricante o importador',
            value: product.isManufacturerOrImporter ? 'Sí' : 'No',
          },
        ]
      : []),
  ];

  return (
    <>
      <Link
        href='/admin/products'
        className='font-light d-inline-flex align-items-center gap-1 mb-3'
      >
        <ChevronLeft size={16} />
        Revisión de productos
      </Link>

      <div className='order-head'>
        <div>
          <h1>{product.name}</h1>
          <p className='font-light mb-0'>
            {product.organizationName ?? 'Proveedor'}
            {product.submittedAt && ` · enviado el ${formatDate(product.submittedAt)}`}
          </p>
        </div>
        <span className={`status-pill status-${PRODUCT_STATUS_TONE[product.status]}`}>
          {PRODUCT_STATUS_LABEL[product.status]}
        </span>
      </div>

      {errorMessage && <div className='alert alert-danger'>{errorMessage}</div>}

      <div className='order-layout'>
        <div className='order-main'>
          <Panel
            title='Lo que declara el proveedor'
            description={
              isMedicine
                ? 'Medicamento: el registro sanitario se toma del catálogo del INVIMA, no lo escribe el proveedor.'
                : undefined
            }
          >
            <ul className='data-list'>
              {datos.map(({ label, value }) => (
                <li key={label}>
                  <span className='font-light'>{label}</span>
                  <span>{value || '—'}</span>
                </li>
              ))}
            </ul>

            {product.description && (
              <p className='font-light mt-3 mb-0'>{product.description}</p>
            )}
          </Panel>

          {isMedicine && product.catalogMedicine && (
            <Panel title='Ficha del INVIMA'>
              <ul className='data-list'>
                <li>
                  <span className='font-light'>Producto</span>
                  <span>{product.catalogMedicine.producto}</span>
                </li>
                <li>
                  <span className='font-light'>Titular</span>
                  <span>{product.catalogMedicine.titular ?? '—'}</span>
                </li>
                <li>
                  <span className='font-light'>Forma farmacéutica</span>
                  <span>{product.catalogMedicine.formaFarmaceutica ?? '—'}</span>
                </li>
                <li>
                  <span className='font-light'>Vence</span>
                  <span>{formatDate(product.catalogMedicine.fechaVencimiento) ?? '—'}</span>
                </li>
              </ul>
            </Panel>
          )}

          <Panel
            title='Presentaciones'
            description='Las formas en que se vende esta referencia.'
            className='panel-table'
          >
            <div className='catalog-table-scroll'>
              <table className='catalog-table'>
                <thead>
                  <tr>
                    <th>Presentación</th>
                    <th>Unidad de venta</th>
                    {isMedicine && <th>CUM</th>}
                    <th className='num'>Precio</th>
                    <th className='num'>Inventario</th>
                  </tr>
                </thead>
                <tbody>
                  {product.presentations.map((presentation) => (
                    <tr key={presentation.id}>
                      <td>{presentation.name}</td>
                      <td className='font-light'>{presentation.packaging}</td>
                      {isMedicine && <td className='font-light'>{presentation.cum ?? '—'}</td>}
                      <td className='num'>
                        {presentation.price === null
                          ? '—'
                          : formatPrice(presentation.price, presentation.currency)}
                      </td>
                      <td className='num font-light'>{presentation.stock}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Panel>

          {product.images.length > 0 && (
            <Panel title='Imágenes'>
              <div className='review-images'>
                {product.images.map((image) => (
                  /* eslint-disable-next-line @next/next/no-img-element -- las
                     imagenes viven en S3 y next/image exigiria declarar el
                     dominio del bucket en la configuracion. */
                  <img key={image.id} src={image.url} alt={image.alt ?? product.name} />
                ))}
              </div>
            </Panel>
          )}
        </div>

        <aside className='order-side'>
          {canDecide && (
            <Panel className='order-next'>
              {rejecting ? (
                <>
                  <label className='form-label font-light' htmlFor='review-note'>
                    Qué debe corregir el proveedor
                  </label>
                  <textarea
                    id='review-note'
                    className='form-control mb-3'
                    rows={4}
                    maxLength={1000}
                    placeholder='La ficha técnica no corresponde a la referencia declarada.'
                    value={note}
                    onChange={(event) => setNote(event.target.value)}
                  />
                  <div className='order-actions'>
                    <button
                      type='button'
                      className='btn btn-outline-danger'
                      disabled={isDeciding || !note.trim()}
                      onClick={() => decide('REJECT')}
                    >
                      {isDeciding ? 'Enviando...' : 'Devolver al proveedor'}
                    </button>
                    <button
                      type='button'
                      className='btn btn-outline-secondary'
                      disabled={isDeciding}
                      onClick={() => setRejecting(false)}
                    >
                      Cancelar
                    </button>
                  </div>
                </>
              ) : (
                <>
                  {/* Se puede aprobar con documentos de menos —quien revisa
                      puede tenerlos por otra via—, pero no sin verlo dicho. */}
                  {missingDocuments.length > 0 && (
                    <p className='review-missing'>
                      <AlertTriangle size={16} />
                      Falta:{' '}
                      {missingDocuments.map((type) => DOCUMENT_LABEL[type]).join(', ')}.
                    </p>
                  )}
                  <div className='order-actions'>
                    <button
                      type='button'
                      className='btn btn-primary'
                      disabled={isDeciding}
                      onClick={() => decide('APPROVE')}
                    >
                      {isDeciding ? 'Publicando...' : 'Aprobar y publicar'}
                    </button>
                    <button
                      type='button'
                      className='btn btn-outline-danger'
                      disabled={isDeciding}
                      onClick={() => setRejecting(true)}
                    >
                      Devolver
                    </button>
                  </div>
                </>
              )}
            </Panel>
          )}

          <Panel title='Documentos'>
            {required.length === 0 && product.documents.length === 0 ? (
              <p className='review-note'>
                <FileText size={16} />
                Esta categoría no requiere documentos.
              </p>
            ) : (
              <div className='document-slots'>
                {[...new Set([...required, ...product.documents.map((d) => d.type)])].map(
                  (type) => {
                    const document = product.documents.find((item) => item.type === type);

                    return (
                      <div
                        className={`document-slot${document ? ' is-filled' : ''}`}
                        key={type}
                      >
                        <div className='document-slot-text'>
                          <strong>{DOCUMENT_LABEL[type]}</strong>
                          <small className={document ? 'font-light' : 'text-danger'}>
                            {document
                              ? (document.filename ?? 'Documento cargado')
                              : 'No lo adjuntó'}
                          </small>
                        </div>
                        {document && (
                          <div className='row-actions'>
                            <button
                              type='button'
                              title='Abrir documento'
                              aria-label='Abrir documento'
                              disabled={opening === document.id}
                              onClick={() => open(document.id)}
                            >
                              <ExternalLink size={15} />
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  },
                )}
              </div>
            )}
          </Panel>

          <Panel title='La solicitud'>
            <ul className='data-list is-single'>
              <li>
                <span className='font-light'>Creado</span>
                <span>{formatDate(product.createdAt)}</span>
              </li>
              {product.submittedAt && (
                <li>
                  <span className='font-light'>Enviado</span>
                  <span>{formatDate(product.submittedAt)}</span>
                </li>
              )}
              {product.reviewedAt && (
                <li>
                  <span className='font-light'>Última decisión</span>
                  <span>{formatDate(product.reviewedAt)}</span>
                </li>
              )}
              {product.reviewNote && (
                <li>
                  <span className='font-light'>Motivo de devolución</span>
                  <span>{product.reviewNote}</span>
                </li>
              )}
            </ul>
          </Panel>
        </aside>
      </div>
    </>
  );
};

export default ProductReviewScreen;
