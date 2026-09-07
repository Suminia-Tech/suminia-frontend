'use client';

import { useState, type FormEvent } from 'react';
import { Check, Edit2, Plus, Star, Trash2, X } from 'react-feather';
import { toast } from 'react-toastify';
import { Col, Modal, ModalBody, ModalFooter, ModalHeader, Row } from 'reactstrap';

import { extractErrorMessage, extractFieldErrors } from '@/shared/lib/apiError';
import { ConfirmModal, SelectWithCustom } from '@/shared/ui';

import {
  useAddPresentationMutation,
  useGetCatalogMedicineQuery,
  useRemovePresentationMutation,
  useUpdatePresentationMutation,
} from '../../api/productsApi';
import { composePresentationName } from '../../lib/presentationName';
import {
  MAX_PRICE_TIERS,
  validateOrderQuantities,
  validateTiers,
} from '../../lib/priceTiers';
import { formatPrice } from '../../lib/productLabels';
import { CONTENT_UNITS, PACKAGING_SUGGESTIONS } from '../../lib/units';
import type { Product, ProductPresentation } from '../../model/product.types';

/* Un escalon a medio escribir: las dos cifras son texto hasta que se guarda,
   porque un input numerico vacio no es 0 sino "todavia nada". */
interface TierDraft {
  minQuantity: string;
  price: string;
}

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
  /* La presentacion del maestro que este formato ofrece. De ahi sale el CUM. */
  catalogPresentationId: '',
  contentQuantity: '',
  contentUnit: '',
  minOrderQuantity: '1',
  orderMultiple: '1',
  priceTiers: [] as TierDraft[],
};

type Draft = typeof EMPTY_DRAFT;

/* Los campos de texto, que son los que sabe pintar el ayudante `field`. Los
   escalones son una lista y se editan aparte. */
type TextField = {
  [K in keyof Draft]: Draft[K] extends string ? K : never;
}[keyof Draft];

/* La variante se recupera de los atributos, que es donde la guarda el backend:
   el nombre esta compuesto y no se puede desarmar con fiabilidad. */
const readAttribute = (attributes: unknown, key: string): string => {
  if (!attributes || typeof attributes !== 'object') return '';
  const value = (attributes as Record<string, unknown>)[key];
  return typeof value === 'string' ? value : '';
};

const toDraft = (presentation: ProductPresentation): Draft => ({
  variant: readAttribute(presentation.attributes, 'variante'),
  packaging: presentation.packaging,
  price: String(presentation.price),
  stock: String(presentation.stock),
  sku: presentation.sku ?? '',
  barcode: presentation.barcode ?? '',
  catalogPresentationId: presentation.catalogPresentationId ?? '',
  contentQuantity:
    presentation.contentQuantity === null ? '' : String(presentation.contentQuantity),
  contentUnit: presentation.contentUnit ?? '',
  minOrderQuantity: String(presentation.minOrderQuantity),
  orderMultiple: String(presentation.orderMultiple),
  priceTiers: presentation.priceTiers.map((tier) => ({
    minQuantity: String(tier.minQuantity),
    price: String(tier.price),
  })),
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
  catalogPresentationId: draft.catalogPresentationId || undefined,
  contentQuantity: Number(draft.contentQuantity),
  contentUnit: draft.contentUnit.trim(),
  minOrderQuantity: Number(draft.minOrderQuantity || 1),
  orderMultiple: Number(draft.orderMultiple || 1),
  /* Siempre se manda, aunque este vacio: el backend lo interpreta como
     "reemplaza la escala por esta", y omitirlo dejaria la anterior puesta al
     borrar el ultimo escalon. */
  priceTiers: draft.priceTiers
    .filter((tier) => tier.minQuantity.trim() && tier.price.trim())
    .map((tier) => ({
      minQuantity: Number(tier.minQuantity),
      price: Number(tier.price),
    })),
});

const validate = (draft: Draft, isMedicine: boolean): Record<string, string> => {
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

  /* Un medicamento vende presentaciones que el INVIMA ya tiene registradas: sin
     elegir cual, la oferta no se puede comparar con la de nadie. */
  if (isMedicine && !draft.catalogPresentationId) {
    errors.catalogPresentationId = 'Elige la presentación del INVIMA';
  }

  const minimo = Number(draft.minOrderQuantity || 1);
  const multiplo = Number(draft.orderMultiple || 1);
  const cantidades = validateOrderQuantities(minimo, multiplo);
  if (cantidades) errors.minOrderQuantity = cantidades;

  const escalones = validateTiers(
    draft.priceTiers
      .filter((tier) => tier.minQuantity.trim() && tier.price.trim())
      .map((tier) => ({
        minQuantity: Number(tier.minQuantity),
        price: Number(tier.price),
      })),
    Number(draft.price),
    minimo,
  );
  if (escalones) errors.priceTiers = escalones;

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

  /* Las presentaciones del maestro, para poder elegir cual se vende. Solo se
     piden si el producto es un medicamento: un insumo no tiene maestro. */
  const isMedicine = Boolean(product.catalogMedicineId);
  const { data: catalogDetail } = useGetCatalogMedicineQuery(
    product.catalogMedicineId ?? '',
    { skip: !isMedicine },
  );
  const catalogPresentations = catalogDetail?.data.presentations ?? [];

  /* Las que ya usa otro formato: el backend rechaza repetir un CUM dentro del
     mismo producto —seria la misma oferta dos veces— y ofrecerlo aqui solo
     llevaria al error. */
  const usadas = new Set(
    presentations
      .filter((presentation) => presentation.id !== editingId)
      .map((presentation) => presentation.catalogPresentationId)
      .filter((id): id is string => Boolean(id)),
  );

  const setTier = (index: number, key: keyof TierDraft, value: string) => {
    setDraft((current) => ({
      ...current,
      priceTiers: current.priceTiers.map((tier, i) =>
        i === index ? { ...tier, [key]: value } : tier,
      ),
    }));
    setErrors((current) => ({ ...current, priceTiers: '' }));
  };

  const addTier = () =>
    setDraft((current) => ({
      ...current,
      priceTiers: [...current.priceTiers, { minQuantity: '', price: '' }],
    }));

  const removeTier = (index: number) =>
    setDraft((current) => ({
      ...current,
      priceTiers: current.priceTiers.filter((_, i) => i !== index),
    }));

  const set = (field: TextField) => (value: string) => {
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

    const validationErrors = validate(draft, isMedicine);
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
    key: TextField,
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
                <th className='num'>Pedido</th>
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
                      {/* El CUM antes que el SKU: el SKU lo pone el proveedor y
                          solo le sirve a el, el CUM lo reconoce cualquiera. */}
                      {presentation.cum ? (
                        <small className='font-light'>CUM {presentation.cum}</small>
                      ) : (
                        presentation.sku && (
                          <small className='font-light'>{presentation.sku}</small>
                        )
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
                  {/* Minimo y multiplo juntos: son la misma regla —lo que de
                      verdad se puede pedir— y separarlos en dos columnas obliga
                      a recomponerla mentalmente. */}
                  <td className='num font-light'>
                    {presentation.minOrderQuantity > 1 || presentation.orderMultiple > 1
                      ? `${presentation.minOrderQuantity}${
                          presentation.orderMultiple > 1
                            ? ` · de ${presentation.orderMultiple} en ${presentation.orderMultiple}`
                            : ''
                        }`
                      : '—'}
                  </td>
                  <td className='num'>
                    <strong>
                      {formatPrice(presentation.price, presentation.currency)}
                    </strong>
                    {presentation.priceTiers.length > 0 && (
                      <small className='font-light d-block'>
                        desde{' '}
                        {formatPrice(
                          presentation.priceTiers[presentation.priceTiers.length - 1]
                            .price,
                          presentation.currency,
                        )}
                      </small>
                    )}
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
              {/* Que presentacion comercial del INVIMA se vende. El CUM sale
                  de ahi y no se teclea: identifica el envase exacto, y es lo que
                  enfrenta la caja de 30 de un proveedor con la de otro. */}
              {isMedicine && (
                <Col md='8' className='mb-3'>
                  <label className='form-label font-light'>
                    Presentación del INVIMA
                  </label>
                  <select
                    className='form-control'
                    value={draft.catalogPresentationId}
                    onChange={(event) =>
                      set('catalogPresentationId')(event.target.value)
                    }
                  >
                    <option value=''>Selecciona la presentación</option>
                    {catalogPresentations.map((presentation) => (
                      <option
                        value={presentation.id}
                        key={presentation.id}
                        disabled={usadas.has(presentation.id)}
                      >
                        {presentation.cantidad ? `${presentation.cantidad} · ` : ''}
                        {presentation.descripcionComercial ?? `CUM ${presentation.cum}`}
                        {usadas.has(presentation.id) ? ' (ya la ofreces)' : ''}
                      </option>
                    ))}
                  </select>
                  {errors.catalogPresentationId ? (
                    <small className='text-danger'>
                      {errors.catalogPresentationId}
                    </small>
                  ) : (
                    <small className='font-light'>
                      De aquí sale el CUM de este formato.
                    </small>
                  )}
                </Col>
              )}
            </Row>

            {/* Nadie despacha una caja suelta, y casi nadie empaca de uno en
                uno. Sin esto el comprador arma un pedido que no se le va a
                despachar, y lo descubre cuando ya esta hecho. */}
            <Row>
              <Col md='4' className='mb-3'>
                {field('Pedido mínimo', 'minOrderQuantity', { type: 'number' })}
                {errors.minOrderQuantity ? (
                  <small className='text-danger'>{errors.minOrderQuantity}</small>
                ) : (
                  <small className='font-light'>Lo mínimo que despachas.</small>
                )}
              </Col>
              <Col md='4' className='mb-3'>
                {field('Múltiplo de venta', 'orderMultiple', { type: 'number' })}
                <small className='font-light'>
                  Se vende de {draft.orderMultiple || 1} en {draft.orderMultiple || 1}.
                </small>
              </Col>
            </Row>

            {/* El descuento por cantidad es la negociacion misma en B2B: sin
                el, acordar el precio de verdad obliga a salirse de Suminia. */}
            <div className='price-tiers'>
              <div className='price-tiers-head'>
                <div>
                  <h6>Precio por volumen</h6>
                  <p className='font-light'>
                    Por debajo del primer escalón se cobra{' '}
                    {draft.price ? formatPrice(Number(draft.price), 'COP') : 'el precio base'}.
                  </p>
                </div>
                {draft.priceTiers.length < MAX_PRICE_TIERS && (
                  <button
                    type='button'
                    className='btn btn-sm btn-outline-secondary rounded-1 d-inline-flex align-items-center gap-1'
                    onClick={addTier}
                  >
                    <Plus size={14} />
                    Agregar escalón
                  </button>
                )}
              </div>

              {draft.priceTiers.length === 0 ? (
                <p className='font-light price-tiers-empty'>
                  Sin escalones, el precio es el mismo para cualquier cantidad.
                </p>
              ) : (
                <ul className='price-tiers-list'>
                  {draft.priceTiers.map((tier, index) => (
                    <li key={index}>
                      <span className='font-light'>Desde</span>
                      <input
                        type='number'
                        min='2'
                        className='form-control'
                        placeholder='50'
                        value={tier.minQuantity}
                        onChange={(event) =>
                          setTier(index, 'minQuantity', event.target.value)
                        }
                      />
                      <span className='font-light'>unidades, a</span>
                      <input
                        type='number'
                        min='0'
                        className='form-control'
                        placeholder='17200'
                        value={tier.price}
                        onChange={(event) => setTier(index, 'price', event.target.value)}
                      />
                      <button
                        type='button'
                        onClick={() => removeTier(index)}
                        aria-label='Quitar escalón'
                      >
                        <X size={15} />
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              {errors.priceTiers && (
                <small className='text-danger'>{errors.priceTiers}</small>
              )}
            </div>

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
