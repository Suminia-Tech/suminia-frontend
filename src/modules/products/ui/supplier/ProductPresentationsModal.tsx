'use client';

import { useState, type FormEvent } from 'react';
import { Check, Edit2, Plus, Star, Trash2, X } from 'react-feather';
import { toast } from 'react-toastify';
import { Col, Modal, ModalBody, ModalFooter, ModalHeader, Row } from 'reactstrap';

import { extractErrorMessage, extractFieldErrors } from '@/shared/lib/apiError';
import { ConfirmModal, SelectWithCustom } from '@/shared/ui';

import {
  useAddPresentationMutation,
  useRemovePresentationMutation,
  useUpdatePresentationMutation,
} from '../../api/productsApi';
import { composePresentationName } from '../../lib/presentationName';
import { formatPrice } from '../../lib/productLabels';
import { CONTENT_UNITS, PACKAGING_SUGGESTIONS } from '../../lib/units';
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
  variant: '',
  packaging: '',
  price: '',
  stock: '',
  sku: '',
  barcode: '',
  contentQuantity: '',
  contentUnit: '',
};

type Draft = typeof EMPTY_DRAFT;

/* La variante se recupera de los atributos, que es donde la guarda el backend:
   el nombre esta compuesto y no se puede desarmar con fiabilidad. */
const readVariant = (attributes: unknown): string => {
  if (!attributes || typeof attributes !== 'object') return '';
  const value = (attributes as Record<string, unknown>).variante;
  return typeof value === 'string' ? value : '';
};

const toDraft = (presentation: ProductPresentation): Draft => ({
  variant: readVariant(presentation.attributes),
  packaging: presentation.packaging,
  price: String(presentation.price),
  stock: String(presentation.stock),
  sku: presentation.sku ?? '',
  barcode: presentation.barcode ?? '',
  contentQuantity:
    presentation.contentQuantity === null ? '' : String(presentation.contentQuantity),
  contentUnit: presentation.contentUnit ?? '',
});

/* Los opcionales vacios se omiten en vez de mandarse como cadena vacia: el DTO
   del backend corre con forbidNonWhitelisted y prefiere la ausencia. */
const toPayload = (draft: Draft) => ({
  variant: draft.variant.trim() || undefined,
  packaging: draft.packaging.trim(),
  price: Number(draft.price),
  stock: draft.stock.trim() ? Number(draft.stock) : 0,
  sku: draft.sku.trim() || undefined,
  barcode: draft.barcode.trim() || undefined,
  contentQuantity: Number(draft.contentQuantity),
  contentUnit: draft.contentUnit.trim(),
});

const validate = (draft: Draft): Record<string, string> => {
  const errors: Record<string, string> = {};
  if (!draft.packaging.trim()) errors.packaging = 'Indica el empaque';
  if (!draft.price.trim()) errors.price = 'Ingresa el precio';
  else if (Number.isNaN(Number(draft.price)) || Number(draft.price) <= 0)
    errors.price = 'El precio debe ser mayor que cero';

  /* Cantidad y unidad son lo que hace comparable el formato: de ellas sale el
     precio por unidad. Un formato de una sola pieza declara 1 y "unidad". */
  if (!draft.contentQuantity.trim()) errors.contentQuantity = 'Ingresa la cantidad';
  else if (
    Number.isNaN(Number(draft.contentQuantity)) ||
    Number(draft.contentQuantity) <= 0
  )
    errors.contentQuantity = 'Debe ser mayor que cero';
  if (!draft.contentUnit.trim()) errors.contentUnit = 'Indica la unidad';

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
    props: { type?: string; placeholder?: string; list?: string } = {},
  ) => (
    <>
      <label className='form-label font-light'>{label}</label>
      <input
        type={props.type ?? 'text'}
        min={props.type === 'number' ? '0' : undefined}
        step={props.type === 'number' ? 'any' : undefined}
        list={props.list}
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

        <div className='catalog-panel'>
          <table className='catalog-table'>
            <thead>
              <tr>
                <th>Formato</th>
                <th>Empaque</th>
                <th className='num'>Contenido</th>
                <th className='num'>Precio</th>
                <th className='num'>Inventario</th>
                <th className='actions'></th>
              </tr>
            </thead>
            <tbody>
              {presentations.map((presentation) => (
                <tr key={presentation.id}>
                  <td>
                    <span className='catalog-product-text'>
                      <strong>{presentation.name}</strong>
                      {presentation.sku && (
                        <small className='font-light'>{presentation.sku}</small>
                      )}
                    </span>
                  </td>
                  <td>
                    <span className='chip'>{presentation.packaging}</span>
                  </td>
                  <td className='num font-light'>
                    {presentation.contentQuantity
                      ? `${presentation.contentQuantity} ${presentation.contentUnit ?? ''}`.trim()
                      : '—'}
                  </td>
                  <td className='num'>
                    <strong>
                      {formatPrice(presentation.price, presentation.currency)}
                    </strong>
                  </td>
                  <td
                    className={`num${presentation.stock === 0 ? ' text-danger' : ' font-light'}`}
                  >
                    {presentation.stock === 0 ? 'Agotado' : presentation.stock}
                  </td>
                  <td className='actions'>
                    <div className='row-actions'>
                      <button
                        type='button'
                        title={
                          presentation.isDefault
                            ? 'Es el formato principal'
                            : 'Marcar como principal'
                        }
                        aria-label='Marcar como principal'
                        className={presentation.isDefault ? 'is-active' : undefined}
                        disabled={presentation.isDefault || busyId === presentation.id}
                        onClick={() => makeDefault(presentation)}
                      >
                        <Star
                          size={15}
                          fill={presentation.isDefault ? 'currentColor' : 'none'}
                        />
                      </button>
                      <button
                        type='button'
                        title='Editar formato'
                        aria-label='Editar formato'
                        onClick={() => startEdit(presentation)}
                      >
                        <Edit2 size={15} />
                      </button>
                      {/* Sin formatos el producto deja de ser vendible, y el
                          backend responde 422. Se desactiva en vez de ofrecer
                          un error. */}
                      <button
                        type='button'
                        className='is-danger'
                        title={
                          isLastOne
                            ? 'Un producto debe conservar al menos un formato'
                            : 'Retirar formato'
                        }
                        aria-label='Retirar formato'
                        disabled={isLastOne || busyId === presentation.id}
                        onClick={() => setPendingDelete(presentation)}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {(isCreating || editingId) && (
          <form onSubmit={submit} noValidate className='presentation-form'>
            <h5 className='mb-3'>{editingId ? 'Editar formato' : 'Nuevo formato'}</h5>

            <Row>
              <Col md='6' className='mb-3'>
                {field('Variante (opcional)', 'variant', { placeholder: 'Talla M' })}
                <small className='font-light'>Talla, calibre, presentación.</small>
              </Col>
              <Col md='6' className='mb-3'>
                <label className='form-label font-light'>Empaque</label>
                <SelectWithCustom
                  options={PACKAGING_SUGGESTIONS}
                  value={draft.packaging}
                  onChange={set('packaging')}
                  emptyLabel='Selecciona el empaque'
                  customPlaceholder='Escribe el empaque'
                />
                {errors.packaging && (
                  <small className='text-danger'>{errors.packaging}</small>
                )}
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
                <label className='form-label font-light'>Unidad</label>
                <SelectWithCustom
                  options={CONTENT_UNITS}
                  value={draft.contentUnit}
                  onChange={set('contentUnit')}
                  emptyLabel='Selecciona la unidad'
                  customPlaceholder='Escribe la unidad'
                />
                {errors.contentUnit && (
                  <small className='text-danger'>{errors.contentUnit}</small>
                )}
              </Col>
              {/* El codigo de barras identifica el formato en bodega, no el
                  producto: la caja x 100 y la x 10 llevan uno distinto. */}
              <Col md='4' className='mb-3'>
                {field('Código de barras', 'barcode', { placeholder: '7701234567890' })}
              </Col>
            </Row>

            {/* El nombre no se escribe: se compone de lo de arriba. Verlo
                mientras se rellena hace evidente para que sirve cada campo. */}
            <div className='name-preview'>
              <span className='font-light'>Se guardará como</span>
              <strong>
                {composePresentationName({
                  packaging: draft.packaging,
                  contentQuantity: draft.contentQuantity,
                  contentUnit: draft.contentUnit,
                  variant: draft.variant,
                }) || '—'}
              </strong>
            </div>

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
