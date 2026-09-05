'use client';

import { useState, type FormEvent } from 'react';
import { Check, Plus, Star, Trash2, X } from 'react-feather';
import { toast } from 'react-toastify';
import { Col, Modal, ModalBody, ModalFooter, ModalHeader, Row, Table } from 'reactstrap';

import { extractErrorMessage, extractFieldErrors } from '@/shared/lib/apiError';
import { ConfirmModal } from '@/shared/ui';

import {
  useAddPresentationMutation,
  useRemovePresentationMutation,
  useUpdatePresentationMutation,
} from '../../api/productsApi';
import { formatPrice } from '../../lib/productLabels';
import type { Product, ProductPresentation } from '../../model/product.types';

/* Los formatos de venta de un producto: la caja x 100, la talla M, el frasco de
   500 mL. Cada uno tiene su propio precio e inventario, que es lo que de verdad
   se vende — el producto por si solo no tiene precio.

   Se editan en linea y no en un modal encima de otro: cambiar un precio es la
   accion mas frecuente del proveedor y no merece dos clics de ceremonia. */

interface ProductPresentationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
}

const EMPTY_DRAFT = {
  name: '',
  packaging: '',
  price: '',
  stock: '',
  sku: '',
  contentQuantity: '',
  contentUnit: '',
};

type Draft = typeof EMPTY_DRAFT;

const toDraft = (presentation: ProductPresentation): Draft => ({
  name: presentation.name,
  packaging: presentation.packaging,
  price: String(presentation.price),
  stock: String(presentation.stock),
  sku: presentation.sku ?? '',
  contentQuantity:
    presentation.contentQuantity === null ? '' : String(presentation.contentQuantity),
  contentUnit: presentation.contentUnit ?? '',
});

/* Los opcionales vacios se omiten en vez de mandarse como cadena vacia: el DTO
   del backend corre con forbidNonWhitelisted y prefiere la ausencia. */
const toPayload = (draft: Draft) => ({
  name: draft.name.trim(),
  packaging: draft.packaging.trim(),
  price: Number(draft.price),
  stock: draft.stock.trim() ? Number(draft.stock) : 0,
  sku: draft.sku.trim() || undefined,
  contentQuantity: draft.contentQuantity.trim()
    ? Number(draft.contentQuantity)
    : undefined,
  contentUnit: draft.contentUnit.trim() || undefined,
});

const validate = (draft: Draft): Record<string, string> => {
  const errors: Record<string, string> = {};
  if (!draft.name.trim()) errors.name = 'Ingresa el nombre del formato';
  if (!draft.packaging.trim()) errors.packaging = 'Indica el empaque';
  if (!draft.price.trim()) errors.price = 'Ingresa el precio';
  else if (Number.isNaN(Number(draft.price)) || Number(draft.price) <= 0)
    errors.price = 'El precio debe ser mayor que cero';
  return errors;
};

const ProductPresentationsModal = ({
  isOpen,
  onClose,
  product,
}: ProductPresentationsModalProps) => {
  const [addPresentation, { isLoading: isAdding }] = useAddPresentationMutation();
  const [updatePresentation, { isLoading: isSaving }] = useUpdatePresentationMutation();
  const [removePresentation] = useRemovePresentationMutation();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Draft>(EMPTY_DRAFT);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isCreating, setCreating] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<ProductPresentation | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const presentations = product.presentations;
  const isLastOne = presentations.length <= 1;

  const set = (field: keyof Draft) => (value: string) => {
    setDraft((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: '' }));
  };

  const startCreate = () => {
    setEditingId(null);
    setDraft(EMPTY_DRAFT);
    setErrors({});
    setCreating(true);
  };

  const startEdit = (presentation: ProductPresentation) => {
    setCreating(false);
    setEditingId(presentation.id);
    setDraft(toDraft(presentation));
    setErrors({});
  };

  const cancel = () => {
    setCreating(false);
    setEditingId(null);
    setDraft(EMPTY_DRAFT);
    setErrors({});
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();

    const validationErrors = validate(draft);
    if (Object.keys(validationErrors).length > 0) return setErrors(validationErrors);

    try {
      if (editingId) {
        await updatePresentation({
          productId: product.id,
          presentationId: editingId,
          data: toPayload(draft),
        }).unwrap();
        toast.success('Formato actualizado');
      } else {
        await addPresentation({ productId: product.id, data: toPayload(draft) }).unwrap();
        toast.success('Formato agregado');
      }
      cancel();
    } catch (err) {
      const fieldErrors = extractFieldErrors(err);
      setErrors(fieldErrors);
      if (Object.keys(fieldErrors).length === 0) {
        toast.error(extractErrorMessage(err, 'No se pudo guardar el formato.'));
      }
    }
  };

  const makeDefault = async (presentation: ProductPresentation) => {
    setBusyId(presentation.id);
    try {
      await updatePresentation({
        productId: product.id,
        presentationId: presentation.id,
        data: { isDefault: true },
      }).unwrap();
      toast.success('Formato principal actualizado');
    } catch (err) {
      toast.error(extractErrorMessage(err, 'No se pudo marcar como principal.'));
    } finally {
      setBusyId(null);
    }
  };

  const confirmRemove = async () => {
    if (!pendingDelete) return;

    setBusyId(pendingDelete.id);
    try {
      await removePresentation({
        productId: product.id,
        presentationId: pendingDelete.id,
      }).unwrap();
      toast.success('Formato retirado');
      setPendingDelete(null);
    } catch (err) {
      toast.error(extractErrorMessage(err, 'No se pudo retirar el formato.'));
    } finally {
      setBusyId(null);
    }
  };

  const field = (
    label: string,
    key: keyof Draft,
    props: { type?: string; placeholder?: string } = {},
  ) => (
    <>
      <label className='form-label font-light'>{label}</label>
      <input
        type={props.type ?? 'text'}
        min={props.type === 'number' ? '0' : undefined}
        className='form-control'
        placeholder={props.placeholder}
        value={draft[key]}
        onChange={(event) => set(key)(event.target.value)}
      />
      {errors[key] && <small className='text-danger'>{errors[key]}</small>}
    </>
  );

  return (
    <Modal
      className='add-address-modal presentations-modal'
      centered
      isOpen={isOpen}
      toggle={onClose}
    >
      <ModalHeader toggle={onClose}></ModalHeader>

      <ModalBody>
        <div className='box-head'>
          <h3>Formatos de venta</h3>
        </div>
        <p className='font-light'>{product.name}</p>

        <Table responsive className='align-middle presentations-table'>
          <thead>
            <tr>
              <th>Formato</th>
              <th>Empaque</th>
              <th>Contenido</th>
              <th>Precio</th>
              <th>Inventario</th>
              <th className='text-end'>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {presentations.map((presentation) => (
              <tr key={presentation.id}>
                <td>
                  {presentation.name}
                  {presentation.isDefault && (
                    <span className='badge badge-success ms-2'>Principal</span>
                  )}
                  {presentation.sku && (
                    <small className='font-light d-block'>{presentation.sku}</small>
                  )}
                </td>
                <td className='font-light'>{presentation.packaging}</td>
                <td className='font-light'>
                  {presentation.contentQuantity
                    ? `${presentation.contentQuantity} ${presentation.contentUnit ?? ''}`.trim()
                    : '—'}
                </td>
                <td>{formatPrice(presentation.price, presentation.currency)}</td>
                <td className='font-light'>{presentation.stock}</td>
                <td className='text-end text-nowrap'>
                  {!presentation.isDefault && (
                    <button
                      type='button'
                      className='btn btn-sm'
                      title='Marcar como principal'
                      disabled={busyId === presentation.id}
                      onClick={() => makeDefault(presentation)}
                    >
                      <Star size={14} />
                    </button>
                  )}
                  <button
                    type='button'
                    className='btn btn-sm'
                    onClick={() => startEdit(presentation)}
                  >
                    Editar
                  </button>
                  {/* Sin formatos el producto deja de ser vendible, y el backend
                      responde 422. Se desactiva en vez de ofrecer un error. */}
                  <button
                    type='button'
                    className='btn btn-sm text-danger'
                    title={
                      isLastOne
                        ? 'Un producto debe conservar al menos un formato'
                        : 'Retirar'
                    }
                    disabled={isLastOne || busyId === presentation.id}
                    onClick={() => setPendingDelete(presentation)}
                  >
                    <Trash2 size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        {(isCreating || editingId) && (
          <form onSubmit={submit} noValidate className='presentation-form'>
            <h5 className='mb-3'>{editingId ? 'Editar formato' : 'Nuevo formato'}</h5>

            <Row>
              <Col md='7' className='mb-3'>
                {field('Nombre del formato', 'name', {
                  placeholder: 'Talla M · Caja x 100',
                })}
              </Col>
              <Col md='5' className='mb-3'>
                {field('Empaque', 'packaging', { placeholder: 'Caja' })}
              </Col>
            </Row>

            <Row>
              <Col md='4' className='mb-3'>
                {field('Precio (COP)', 'price', { type: 'number' })}
              </Col>
              <Col md='4' className='mb-3'>
                {field('Inventario', 'stock', { type: 'number' })}
              </Col>
              <Col md='4' className='mb-3'>
                {field('SKU', 'sku')}
              </Col>
            </Row>

            <Row>
              <Col md='4' className='mb-3'>
                {field('Cantidad', 'contentQuantity', { type: 'number' })}
              </Col>
              <Col md='4' className='mb-3'>
                {field('Unidad', 'contentUnit', { placeholder: 'unidad, mL, g' })}
              </Col>
              <Col md='4' className='mb-3 d-flex align-items-end'>
                {/* La cantidad va aparte del empaque para poder comparar el
                    precio por unidad entre formatos y entre proveedores. */}
                <small className='font-light'>
                  Cantidad y unidad permiten comparar el precio por unidad.
                </small>
              </Col>
            </Row>

            <div className='text-end'>
              <button
                type='button'
                className='btn btn-outline-secondary rounded-1 me-2 d-inline-flex align-items-center gap-1'
                onClick={cancel}
              >
                <X size={14} />
                Cancelar
              </button>
              <button
                type='submit'
                className='btn btn-primary rounded-1 d-inline-flex align-items-center gap-1'
                disabled={isAdding || isSaving}
              >
                <Check size={14} />
                {isAdding || isSaving ? 'Guardando...' : 'Guardar formato'}
              </button>
            </div>
          </form>
        )}

        {pendingDelete && (
          <ConfirmModal
            isOpen={Boolean(pendingDelete)}
            onClose={() => setPendingDelete(null)}
            onConfirm={confirmRemove}
            isLoading={busyId === pendingDelete.id}
            title='¿Retirar este formato?'
            confirmLabel='Sí, retirar'
          >
            <p className='mb-1'>
              <strong>{pendingDelete.name}</strong>
            </p>
            <p className='mb-0'>
              Deja de ofrecerse en el catálogo. Los pedidos que ya lo incluyan lo
              conservan.
            </p>
          </ConfirmModal>
        )}
      </ModalBody>

      <ModalFooter className='pt-0 text-end d-block'>
        <button
          type='button'
          className='btn btn-outline-secondary rounded-1 me-2'
          onClick={onClose}
        >
          Cerrar
        </button>
        <button
          type='button'
          className='btn btn-primary rounded-1 d-inline-flex align-items-center gap-1'
          disabled={isCreating}
          onClick={startCreate}
        >
          <Plus size={16} />
          Agregar formato
        </button>
      </ModalFooter>
    </Modal>
  );
};

export default ProductPresentationsModal;
