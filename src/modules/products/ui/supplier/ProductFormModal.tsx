'use client';

import { useState, type ChangeEvent, type FormEvent } from 'react';
import { Plus, X } from 'react-feather';
import { Col, Modal, ModalBody, ModalFooter, ModalHeader, Row } from 'reactstrap';

import { extractErrorMessage, extractFieldErrors } from '@/shared/lib/apiError';

import {
  useCreateProductMutation,
  useGetCategoriesQuery,
  useUpdateProductMutation,
} from '../../api/productsApi';
import {
  fromAttributePairs,
  toAttributePairs,
  type AttributePair,
} from '../../lib/attributes';
import type { Product, ProductStatus } from '../../model/product.types';

/* Alta y edicion de un producto. La empresa no se pide: el backend la toma de
   la sesion de quien crea, de modo que no hay forma de publicar en el catalogo
   de otro proveedor.

   Al crear se pide ademas el primer formato de venta, porque un producto sin
   formatos no tiene precio ni inventario y el backend lo rechaza con 422. Los
   demas formatos se agregan despues, ya sobre el producto creado.

   Sigue la estructura de los modales del panel de cuenta: cabecera vacia
   (el tema saca el boton de cierre fuera del marco), contenido en el cuerpo y
   acciones en el pie. */

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** Si viene, el modal edita ese producto; si no, crea uno nuevo. */
  product?: Product | null;
}

/* El padre monta este modal con key={product?.id ?? 'nuevo'}. Hace falta
   porque el estado del formulario se calcula una sola vez, al montar: sin la
   key, abrir "editar" sobre otro producto reutilizaria el componente y
   dejaria los campos del anterior. */

const FORM_ID = 'product-form';

const INITIAL = {
  name: '',
  categoryId: '',
  brand: '',
  manufacturer: '',
  description: '',
  status: 'DRAFT' as ProductStatus,
  presentationName: '',
  packaging: '',
  price: '',
  stock: '',
  sku: '',
};

type FormState = typeof INITIAL;

const toFormState = (product?: Product | null): FormState => {
  if (!product) return INITIAL;

  return {
    ...INITIAL,
    name: product.name,
    categoryId: product.categoryId,
    brand: product.brand ?? '',
    manufacturer: product.manufacturer ?? '',
    description: product.description ?? '',
    status: product.status,
  };
};

const ProductFormModal = ({ isOpen, onClose, product }: ProductFormModalProps) => {
  const isEditing = Boolean(product);
  const { data: categoriesData } = useGetCategoriesQuery();
  const categories = categoriesData?.data ?? [];

  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
  const isSaving = isCreating || isUpdating;

  const [form, setForm] = useState<FormState>(() => toFormState(product));
  /* Los atributos van aparte del resto del formulario: son una lista que crece,
     no un campo. */
  const [attributes, setAttributes] = useState<AttributePair[]>(() =>
    toAttributePairs(product?.attributes),
  );
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [generalError, setGeneralError] = useState<string | null>(null);

  const handleChange =
    (field: keyof FormState) =>
    (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const { value } = event.target;
      setForm((current) => ({ ...current, [field]: value }));
      setErrors((current) => ({ ...current, [field]: undefined }));
      setGeneralError(null);
    };

  const setAttribute = (index: number, field: keyof AttributePair, value: string) => {
    setAttributes((current) =>
      current.map((pair, i) => (i === index ? { ...pair, [field]: value } : pair)),
    );
  };

  const addAttribute = () => setAttributes((current) => [...current, { key: '', value: '' }]);

  const removeAttribute = (index: number) =>
    setAttributes((current) => current.filter((_, i) => i !== index));

  const validate = () => {
    const next: Record<string, string> = {};
    if (!form.name.trim()) next.name = 'Ingresa el nombre del producto';
    if (!form.categoryId) next.categoryId = 'Selecciona una categoría';

    if (!isEditing) {
      if (!form.presentationName.trim())
        next.presentationName = 'Ingresa cómo se llama el formato';
      if (!form.packaging.trim()) next.packaging = 'Indica el empaque';
      if (!form.price.trim()) next.price = 'Ingresa el precio';
      else if (Number.isNaN(Number(form.price)) || Number(form.price) <= 0)
        next.price = 'El precio debe ser un número mayor que cero';
    }

    return next;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) return setErrors(validationErrors);

    /* Los opcionales vacios se omiten en vez de mandarse como cadena vacia: el
       DTO del backend corre con forbidNonWhitelisted y prefiere ausencia. */
    const common = {
      name: form.name.trim(),
      categoryId: form.categoryId,
      status: form.status,
      brand: form.brand.trim() || undefined,
      manufacturer: form.manufacturer.trim() || undefined,
      description: form.description.trim() || undefined,
      attributes: fromAttributePairs(attributes),
    };

    try {
      if (product) {
        await updateProduct({ id: product.id, data: common }).unwrap();
      } else {
        await createProduct({
          ...common,
          presentations: [
            {
              name: form.presentationName.trim(),
              packaging: form.packaging.trim(),
              price: Number(form.price),
              stock: form.stock.trim() ? Number(form.stock) : 0,
              sku: form.sku.trim() || undefined,
            },
          ],
        }).unwrap();
      }

      setForm(toFormState(product));
      setAttributes(toAttributePairs(product?.attributes));
      setErrors({});
      onClose();
    } catch (error) {
      const fieldErrors = extractFieldErrors(error);
      setErrors(fieldErrors);
      if (Object.keys(fieldErrors).length === 0) {
        setGeneralError(
          extractErrorMessage(error, 'No se pudo guardar el producto.'),
        );
      }
    }
  };

  return (
    <Modal
      className='add-address-modal product-form-modal'
      centered
      isOpen={isOpen}
      toggle={onClose}
    >
      {/* Vacia a proposito: el tema posiciona el boton de cierre fuera del
          marco y le da padding cero a la cabecera. */}
      <ModalHeader toggle={onClose}></ModalHeader>

      <ModalBody>
        <div className='box-head'>
          <h3>{isEditing ? 'Editar producto' : 'Nuevo producto'}</h3>
        </div>

        <form id={FORM_ID} onSubmit={handleSubmit} noValidate>
          <Row>
            {/* Al editar no hay columna de formato, de modo que los datos del
                producto ocupan el ancho entero en vez de dejar un hueco. */}
            <Col lg={isEditing ? '12' : '6'}>
              <div className='mb-3'>
                <label className='form-label font-light'>Nombre del producto</label>
                <input
                  type='text'
                  className='form-control'
                  value={form.name}
                  onChange={handleChange('name')}
                />
                {errors.name && <small className='text-danger'>{errors.name}</small>}
              </div>

              <div className='mb-3'>
                <label className='form-label font-light'>Categoría</label>
                <select
                  className='form-control'
                  value={form.categoryId}
                  onChange={handleChange('categoryId')}
                >
                  <option value=''>Selecciona una categoría</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {errors.categoryId && (
                  <small className='text-danger'>{errors.categoryId}</small>
                )}
              </div>

              <Row>
                <Col sm='6' className='mb-3'>
                  <label className='form-label font-light'>Marca</label>
                  <input
                    type='text'
                    className='form-control'
                    value={form.brand}
                    onChange={handleChange('brand')}
                  />
                </Col>
                <Col sm='6' className='mb-3'>
                  <label className='form-label font-light'>Fabricante</label>
                  <input
                    type='text'
                    className='form-control'
                    value={form.manufacturer}
                    onChange={handleChange('manufacturer')}
                  />
                </Col>
              </Row>

              <div className='mb-3'>
                <label className='form-label font-light'>Descripción</label>
                <textarea
                  className='form-control'
                  rows={3}
                  value={form.description}
                  onChange={handleChange('description')}
                />
              </div>

              {/* Caracteristicas propias del producto: material y esterilidad
                  en un insumo, y manana el CUM y el registro INVIMA de un
                  medicamento. Se guardan en una columna JSONB, de modo que
                  sumar un tipo no pide una migracion. */}
              <div className='mb-3'>
                <label className='form-label font-light'>Características</label>
                {attributes.map((pair, index) => (
                  <div className='attribute-row' key={index}>
                    <input
                      type='text'
                      className='form-control'
                      placeholder='Material'
                      value={pair.key}
                      onChange={(event) => setAttribute(index, 'key', event.target.value)}
                    />
                    <input
                      type='text'
                      className='form-control'
                      placeholder='Nitrilo'
                      value={pair.value}
                      onChange={(event) => setAttribute(index, 'value', event.target.value)}
                    />
                    <button
                      type='button'
                      className='attribute-remove'
                      aria-label='Quitar característica'
                      onClick={() => removeAttribute(index)}
                    >
                      <X size={15} />
                    </button>
                  </div>
                ))}
                <button
                  type='button'
                  className='btn btn-link p-0 font-light d-inline-flex align-items-center gap-1'
                  onClick={addAttribute}
                >
                  <Plus size={14} />
                  Agregar característica
                </button>
              </div>

              <div className='mb-3'>
                <label className='form-label font-light'>Estado</label>
                <select
                  className='form-control'
                  value={form.status}
                  onChange={handleChange('status')}
                >
                  <option value='DRAFT'>Borrador — solo lo ves tú</option>
                  <option value='ACTIVE'>Publicado — visible en el catálogo</option>
                  {isEditing && <option value='INACTIVE'>Retirado del catálogo</option>}
                </select>
              </div>
            </Col>

            {!isEditing && (
              <Col lg='6' className='product-form-aside'>
                <h5 className='mb-1'>Primer formato de venta</h5>
                <p className='font-light'>
                  Un producto se vende en uno o varios formatos: caja x 100, talla M,
                  frasco de 500 mL. Empieza con uno y agrega los demás después.
                </p>

                <div className='mb-3'>
                  <label className='form-label font-light'>Nombre del formato</label>
                  <input
                    type='text'
                    className='form-control'
                    placeholder='Talla M · Caja x 100'
                    value={form.presentationName}
                    onChange={handleChange('presentationName')}
                  />
                  {errors.presentationName && (
                    <small className='text-danger'>{errors.presentationName}</small>
                  )}
                </div>

                <Row>
                  <Col sm='6' className='mb-3'>
                    <label className='form-label font-light'>Empaque</label>
                    <input
                      type='text'
                      className='form-control'
                      placeholder='Caja'
                      value={form.packaging}
                      onChange={handleChange('packaging')}
                    />
                    {errors.packaging && (
                      <small className='text-danger'>{errors.packaging}</small>
                    )}
                  </Col>
                  <Col sm='6' className='mb-3'>
                    <label className='form-label font-light'>SKU</label>
                    <input
                      type='text'
                      className='form-control'
                      value={form.sku}
                      onChange={handleChange('sku')}
                    />
                  </Col>
                </Row>

                <Row>
                  <Col sm='6' className='mb-3'>
                    <label className='form-label font-light'>Precio (COP)</label>
                    <input
                      type='number'
                      min='0'
                      className='form-control'
                      value={form.price}
                      onChange={handleChange('price')}
                    />
                    {errors.price && <small className='text-danger'>{errors.price}</small>}
                  </Col>
                  <Col sm='6' className='mb-3'>
                    <label className='form-label font-light'>Inventario</label>
                    <input
                      type='number'
                      min='0'
                      className='form-control'
                      value={form.stock}
                      onChange={handleChange('stock')}
                    />
                  </Col>
                </Row>
              </Col>
            )}
          </Row>

          {generalError && <div className='alert alert-danger mt-3'>{generalError}</div>}
        </form>
      </ModalBody>

      <ModalFooter className='pt-0 text-end d-block'>
        <button
          type='button'
          className='btn btn-outline-secondary rounded-1 me-2'
          onClick={onClose}
        >
          Cancelar
        </button>
        <button
          type='submit'
          form={FORM_ID}
          className='btn btn-primary rounded-1'
          disabled={isSaving}
        >
          {isSaving ? 'Guardando...' : isEditing ? 'Guardar cambios' : 'Crear producto'}
        </button>
      </ModalFooter>
    </Modal>
  );
};

export default ProductFormModal;
