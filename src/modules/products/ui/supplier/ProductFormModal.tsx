'use client';

import { useState, type ChangeEvent, type FormEvent } from 'react';
import { Plus, X } from 'react-feather';
import { Col, Modal, ModalBody, ModalFooter, ModalHeader, Row } from 'reactstrap';

import { extractErrorMessage, extractFieldErrors } from '@/shared/lib/apiError';
import { SelectWithCustom } from '@/shared/ui';

import {
  useCreateProductMutation,
  useGetCatalogMedicineQuery,
  useGetCategoriesQuery,
  useUpdateProductMutation,
} from '../../api/productsApi';
import {
  fromAttributePairs,
  toAttributePairs,
  type AttributePair,
} from '../../lib/attributes';
import { composePresentationName } from '../../lib/presentationName';
import { PRODUCT_TYPE_HELP } from '../../lib/productTypes';
import { TAX_OPTIONS, defaultTaxCategory } from '../../lib/tax';
import { CONTENT_UNITS, PACKAGING_SUGGESTIONS } from '../../lib/units';
import type {
  CatalogMedicine,
  CatalogMedicineSearchResult,
  Product,
  ProductType,
  TaxCategory,
} from '../../model/product.types';
import CatalogMedicinePicker from './CatalogMedicinePicker';

/* Alta y edicion de un producto. La empresa no se pide: el backend la toma de
   la sesion de quien crea, de modo que no hay forma de publicar en el catalogo
   de otro proveedor.

   Al crear se pide ademas la primera presentacion, porque un producto sin
   presentaciones no tiene precio ni inventario y el backend lo rechaza con 422.
   Las demas se agregan despues, ya sobre el producto creado.

   El estado no se elige aqui. Todo producto nace en borrador y se publica
   enviandolo a revision desde la lista: lo aprueba direccion tecnica, no el
   proveedor.

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
  reference: '',
  sanitaryRegistration: '',
  description: '',
  variant: '',
  packaging: '',
  price: '',
  stock: '',
  sku: '',
  contentQuantity: '',
  contentUnit: '',
  taxCategory: 'IVA_19' as TaxCategory,
  /* La presentacion del maestro que ofrece el primer formato. Solo aplica a un
     medicamento: de ahi sale su CUM. */
  catalogPresentationId: '',
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
    reference: product.reference ?? '',
    sanitaryRegistration: product.sanitaryRegistration ?? '',
    description: product.description ?? '',
    taxCategory: product.taxCategory,
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
  /* Aparte del resto porque es un si o no, no un texto. Solo cuenta en un
     dispositivo medico: decide si se le exige el CCAA. */
  const [isManufacturerOrImporter, setManufacturerOrImporter] = useState(
    () => product?.isManufacturerOrImporter ?? false,
  );
  /* El tipo no se elige: es el de la categoria. Al editar, mientras llegan las
     categorias, vale el que ya tiene el producto. */
  const type: ProductType | null =
    categories.find((category) => category.id === form.categoryId)?.productType ??
    (product && form.categoryId === product.categoryId ? product.type : null);
  const isMedicine = type === 'MEDICINE';
  /* Los atributos van aparte del resto del formulario: son una lista que crece,
     no un campo. Aqui solo quedan los libres —material, esterilidad—: lo
     regulatorio de un medicamento ya no se escribe, se lee del maestro. */
  const [attributes, setAttributes] = useState<AttributePair[]>(() =>
    toAttributePairs(product?.attributes),
  );

  /* El medicamento elegido del maestro. Al editar viene con el producto; al
     crear lo pone el buscador. */
  const [catalogMedicine, setCatalogMedicine] = useState<CatalogMedicine | null>(
    () => product?.catalogMedicine ?? null,
  );

  /* Sus presentaciones, para poder elegir la que se vende en el primer formato.
     Se piden solo al crear: al editar, los formatos se gestionan en su propio
     modal. */
  const { data: catalogDetail } = useGetCatalogMedicineQuery(
    catalogMedicine?.id ?? '',
    { skip: !catalogMedicine || isEditing },
  );
  const catalogPresentations = catalogDetail?.data.presentations ?? [];
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [generalError, setGeneralError] = useState<string | null>(null);

  const setField = (field: keyof FormState, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setGeneralError(null);
  };

  const handleChange =
    (field: keyof FormState) =>
    (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const { value } = event.target;
      setForm((current) => ({ ...current, [field]: value }));
      setErrors((current) => ({ ...current, [field]: undefined }));
      setGeneralError(null);
    };

  /* Cambiar de categoria puede cambiar el tipo, y eso arrastra dos cosas: el
     enlace al maestro deja de tener sentido fuera de un medicamento, y el
     impuesto que se propone es otro. Se ajustan aqui para que el formulario no
     quede en un estado que el backend va a rechazar. */
  const handleCategoryChange = (categoryId: string) => {
    const next = categories.find((category) => category.id === categoryId)?.productType;

    setForm((current) => ({
      ...current,
      categoryId,
      ...(next && next !== type
        ? { taxCategory: defaultTaxCategory(next), catalogPresentationId: '' }
        : {}),
    }));
    if (next !== 'MEDICINE') setCatalogMedicine(null);
    setErrors((current) => ({ ...current, categoryId: undefined }));
    setGeneralError(null);
  };

  /* El INVIMA ya declara cuantas unidades trae la presentacion, de modo que
     volver a pedirla seria pedir dos veces el mismo dato y dar por bueno que las
     dos versiones coincidan. Se rellena y se deja editable: la unidad "U" del
     dataset no siempre es la que el proveedor usa para vender. */
  const handleCatalogPresentation = (id: string) => {
    const elegida = catalogPresentations.find(
      (presentation) => presentation.id === id,
    );

    setForm((current) => ({
      ...current,
      catalogPresentationId: id,
      contentQuantity: elegida?.cantidad ? String(elegida.cantidad) : current.contentQuantity,
      contentUnit: elegida?.cantidad ? 'unidad' : current.contentUnit,
    }));
    setErrors((current) => ({ ...current, catalogPresentationId: undefined }));
  };

  const handleCatalogSelect = (medicine: CatalogMedicineSearchResult | null) => {
    setCatalogMedicine(
      medicine
        ? {
            ...medicine,
            /* El buscador devuelve lo justo para reconocerlo; el resto de la
               ficha llega con el detalle y con la respuesta del producto. */
            expediente: '',
            fechaVencimiento: null,
            viasAdministracion: [],
            descripcionAtc: null,
            activo: true,
          }
        : null,
    );
    setForm((current) => ({ ...current, catalogPresentationId: '' }));
    setErrors((current) => ({ ...current, catalogMedicineId: undefined }));
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

    /* Un medicamento se elige del maestro: es lo que lo identifica y lo que
       pone su oferta al lado de las de otros proveedores. El backend lo rechaza
       igual; aqui se avisa antes de mandar. */
    if (isMedicine) {
      if (!catalogMedicine) {
        next.catalogMedicineId = 'Busca y elige el medicamento en el catálogo del INVIMA';
      } else if (!isEditing && !form.catalogPresentationId) {
        next.catalogPresentationId = 'Elige la presentación que vas a vender';
      }
    }

    if (!isEditing) {
      if (!form.packaging.trim()) next.packaging = 'Indica la unidad de venta';
      if (!form.price.trim()) next.price = 'Ingresa el precio';
      else if (Number.isNaN(Number(form.price)) || Number(form.price) <= 0)
        next.price = 'El precio debe ser un número mayor que cero';

      /* De la cantidad y la unidad sale el precio por unidad, que es con lo que
         el comprador decide. Un formato de una sola pieza declara 1 y "unidad". */
      if (!form.contentQuantity.trim()) next.contentQuantity = 'Ingresa la cantidad';
      else if (
        Number.isNaN(Number(form.contentQuantity)) ||
        Number(form.contentQuantity) <= 0
      )
        next.contentQuantity = 'Debe ser mayor que cero';
      if (!form.contentUnit.trim()) next.contentUnit = 'Indica la unidad';
    }

    return next;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      return setErrors(validationErrors);
    }

    /* Los opcionales vacios se omiten en vez de mandarse como cadena vacia: el
       DTO del backend corre con forbidNonWhitelisted y prefiere ausencia. */
    const common = {
      name: form.name.trim(),
      categoryId: form.categoryId,
      brand: form.brand.trim() || undefined,
      manufacturer: form.manufacturer.trim() || undefined,
      /* null y no undefined: undefined es "no lo toques", y vaciar el campo al
         editar tiene que llegar como vaciado. */
      reference: form.reference.trim() || null,
      /* Un medicamento no lo declara: lo lee del maestro del INVIMA. */
      sanitaryRegistration: isMedicine ? null : form.sanitaryRegistration.trim() || null,
      isManufacturerOrImporter: type === 'MEDICAL_DEVICE' && isManufacturerOrImporter,
      description: form.description.trim() || undefined,
      taxCategory: form.taxCategory,
      /* null y no undefined al quitarlo: undefined significaria "no lo toques"
         y el enlace se quedaria puesto en un producto que ya no es medicamento. */
      catalogMedicineId: isMedicine ? (catalogMedicine?.id ?? null) : null,
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
              variant: form.variant.trim() || undefined,
              packaging: form.packaging.trim(),
              price: Number(form.price),
              stock: form.stock.trim() ? Number(form.stock) : 0,
              sku: form.sku.trim() || undefined,
              contentQuantity: Number(form.contentQuantity),
              contentUnit: form.contentUnit.trim(),
              catalogPresentationId: form.catalogPresentationId || undefined,
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

        {/* Lo que la revision dejo dicho, donde se va a corregir. */}
        {product?.status === 'REJECTED' && product.reviewNote && (
          <div className='alert alert-danger'>
            <strong>Dirección técnica lo devolvió:</strong> {product.reviewNote}
          </div>
        )}
        {product?.status === 'ACTIVE' && (
          <div className='alert alert-warning'>
            Este producto está publicado. Si cambias su nombre, marca, referencia,
            fabricante o registro sanitario, o lo pasas a una categoría con otros
            requisitos, vuelve a revisión y sale del catálogo hasta que se apruebe.
          </div>
        )}

        <form id={FORM_ID} onSubmit={handleSubmit} noValidate>
          <Row>
            {/* Al editar no hay columna de presentacion, de modo que los datos
                del producto ocupan el ancho entero en vez de dejar un hueco. */}
            <Col lg={isEditing ? '12' : '6'}>
              {/* La categoria va primero porque decide lo que se pide
                  despues: un medicamento se elige del INVIMA, un dispositivo
                  medico adjunta documentos. */}
              <div className='mb-3'>
                <label className='form-label font-light'>Categoría</label>
                <select
                  className='form-control'
                  value={form.categoryId}
                  onChange={(event) => handleCategoryChange(event.target.value)}
                >
                  <option value=''>Selecciona una categoría</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {errors.categoryId ? (
                  <small className='text-danger'>{errors.categoryId}</small>
                ) : (
                  <small className='font-light'>
                    {(type && PRODUCT_TYPE_HELP[type]) ??
                      'Según la categoría te pediremos unos datos u otros.'}
                  </small>
                )}
              </div>

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

              <Row>
                <Col sm='6' className='mb-3'>
                  <label className='form-label font-light'>Marca</label>
                  <input
                    type='text'
                    className='form-control'
                    value={form.brand}
                    onChange={handleChange('brand')}
                  />
                  {errors.brand && <small className='text-danger'>{errors.brand}</small>}
                </Col>
                {/* La referencia es lo que separa un producto de otro. Dos
                    modelos son dos productos; las presentaciones son las formas
                    de vender uno solo. */}
                <Col sm='6' className='mb-3'>
                  <label className='form-label font-light'>
                    Referencia / modelo{isMedicine && ' (opcional)'}
                  </label>
                  <input
                    type='text'
                    className='form-control'
                    placeholder='HEM-7120'
                    value={form.reference}
                    onChange={handleChange('reference')}
                  />
                  {errors.reference ? (
                    <small className='text-danger'>{errors.reference}</small>
                  ) : (
                    <small className='font-light'>
                      Otra referencia se crea como otro producto.
                    </small>
                  )}
                </Col>
              </Row>

              <Row>
                <Col sm={isMedicine ? '12' : '6'} className='mb-3'>
                  <label className='form-label font-light'>Fabricante</label>
                  <input
                    type='text'
                    className='form-control'
                    value={form.manufacturer}
                    onChange={handleChange('manufacturer')}
                  />
                </Col>
                {/* Un medicamento no lo escribe: lo toma del INVIMA. */}
                {!isMedicine && (
                  <Col sm='6' className='mb-3'>
                    <label className='form-label font-light'>Registro sanitario</label>
                    <input
                      type='text'
                      className='form-control'
                      placeholder='INVIMA 2019DM-0019872'
                      value={form.sanitaryRegistration}
                      onChange={handleChange('sanitaryRegistration')}
                    />
                    {errors.sanitaryRegistration && (
                      <small className='text-danger'>{errors.sanitaryRegistration}</small>
                    )}
                  </Col>
                )}
              </Row>

              {/* Solo en un dispositivo medico: quien lo fabrica o lo importa
                  tiene que aportar ademas el CCAA. */}
              {type === 'MEDICAL_DEVICE' && (
                <div className='form-check mb-3'>
                  <input
                    id='manufacturer-or-importer'
                    type='checkbox'
                    className='form-check-input'
                    checked={isManufacturerOrImporter}
                    onChange={(event) => setManufacturerOrImporter(event.target.checked)}
                  />
                  <label className='form-check-label' htmlFor='manufacturer-or-importer'>
                    Soy fabricante o importador de este producto
                    <small className='font-light d-block'>
                      Te pediremos el CCAA junto con el registro sanitario y la ficha
                      técnica.
                    </small>
                  </label>
                </div>
              )}

              <div className='mb-3'>
                <label className='form-label font-light'>Descripción</label>
                <textarea
                  className='form-control'
                  rows={3}
                  value={form.description}
                  onChange={handleChange('description')}
                />
              </div>

              {/* Un medicamento no se describe: se elige del maestro del
                  INVIMA. Aparece con el tipo y no antes, que a quien vende
                  guantes no le sirve de nada.

                  Lo que se gana no es solo ahorrarle cinco campos: dos
                  proveedores que eligen la misma ficha quedan enfrentados, y
                  poder comparar ofertas del mismo medicamento es a lo que el
                  comprador entra a Suminia. */}
              {isMedicine && (
                <div className='medicine-fields'>
                  <h5>Medicamento del INVIMA</h5>
                  <p className='font-light'>
                    Búscalo y elígelo: su composición, su forma farmacéutica y su
                    registro sanitario se toman de ahí, y tu oferta queda junto a
                    las de los demás proveedores del mismo medicamento.
                  </p>

                  <CatalogMedicinePicker
                    selected={catalogMedicine}
                    onSelect={handleCatalogSelect}
                    error={errors.catalogMedicineId}
                  />
                </div>
              )}

              {/* No se deduce del tipo: los medicamentos estan excluidos, pero
                  entre los insumos hay gravados al 19%, al 5% y excluidos. Sin
                  esto no se puede facturar. */}
              <div className='mb-3'>
                <label className='form-label font-light'>IVA</label>
                <select
                  className='form-control'
                  value={form.taxCategory}
                  onChange={handleChange('taxCategory')}
                >
                  {TAX_OPTIONS.map((option) => (
                    <option value={option.value} key={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <small className='font-light'>
                  {TAX_OPTIONS.find((option) => option.value === form.taxCategory)?.help}
                </small>
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

            </Col>

            {!isEditing && (
              <Col lg='6' className='product-form-aside'>
                <h5 className='mb-1'>Primera presentación</h5>
                <p className='font-light'>
                  Las formas de vender esta misma referencia: caja x 100, talla M,
                  frasco de 500 mL. Empieza con una y agrega las demás después.
                </p>

                {/* Que presentacion comercial se vende. De aqui sale el CUM,
                    que es lo que enfrenta la caja de 30 de un proveedor con la
                    caja de 30 de otro. */}
                {isMedicine && catalogMedicine && (
                  <div className='mb-3'>
                    <label className='form-label font-light'>
                      Presentación del INVIMA
                    </label>
                    <select
                      className='form-control'
                      value={form.catalogPresentationId}
                      onChange={(event) => handleCatalogPresentation(event.target.value)}
                    >
                      <option value=''>Selecciona la presentación</option>
                      {catalogPresentations.map((presentation) => (
                        <option value={presentation.id} key={presentation.id}>
                          {presentation.cantidad ? `${presentation.cantidad} · ` : ''}
                          {presentation.descripcionComercial ?? `CUM ${presentation.cum}`}
                        </option>
                      ))}
                    </select>
                    {errors.catalogPresentationId ? (
                      <small className='text-danger'>{errors.catalogPresentationId}</small>
                    ) : (
                      <small className='font-light'>
                        Su CUM identifica lo que vendes y permite compararlo.
                      </small>
                    )}
                  </div>
                )}

                <Row>
                  <Col sm='6' className='mb-3'>
                    <label className='form-label font-light'>Variante (opcional)</label>
                    <input
                      type='text'
                      className='form-control'
                      placeholder='Talla M'
                      value={form.variant}
                      onChange={handleChange('variant')}
                    />
                    <small className='font-light'>Talla, calibre, color.</small>
                  </Col>
                  <Col sm='6' className='mb-3'>
                    <label className='form-label font-light'>Unidad de venta</label>
                    <SelectWithCustom
                      options={PACKAGING_SUGGESTIONS}
                      value={form.packaging}
                      onChange={(value) => setField('packaging', value)}
                      emptyLabel='Selecciona la unidad de venta'
                      customPlaceholder='Escribe la unidad de venta'
                    />
                    {errors.packaging && (
                      <small className='text-danger'>{errors.packaging}</small>
                    )}
                  </Col>
                </Row>


                <Row>
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

                {/* Cantidad y unidad son lo que hace comparable el formato: de
                    ellas sale el precio por unidad, que es lo que revela que la
                    caja de 100 sale mejor que la de 10. */}
                <Row>
                  <Col sm='6' className='mb-3'>
                    <label className='form-label font-light'>Cantidad</label>
                    <input
                      type='number'
                      min='0'
                      step='any'
                      className='form-control'
                      placeholder='100'
                      value={form.contentQuantity}
                      onChange={handleChange('contentQuantity')}
                    />
                    {errors.contentQuantity && (
                      <small className='text-danger'>{errors.contentQuantity}</small>
                    )}
                  </Col>
                  <Col sm='6' className='mb-3'>
                    <label className='form-label font-light'>Unidad</label>
                    <SelectWithCustom
                      options={CONTENT_UNITS}
                      value={form.contentUnit}
                      onChange={(value) => setField('contentUnit', value)}
                      emptyLabel='Selecciona la unidad'
                      customPlaceholder='Escribe la unidad'
                    />
                    {errors.contentUnit && (
                      <small className='text-danger'>{errors.contentUnit}</small>
                    )}
                  </Col>
                </Row>

                {/* El nombre no se escribe: se compone de lo de arriba. Verlo
                    mientras se rellena es lo que hace evidente para que sirve
                    cada campo, sin un parrafo que lo explique. */}
                <div className='name-preview'>
                  <span className='font-light'>Se guardará como</span>
                  <strong>
                    {composePresentationName({
                      packaging: form.packaging,
                      contentQuantity: form.contentQuantity,
                      contentUnit: form.contentUnit,
                      variant: form.variant,
                    }) || '—'}
                  </strong>
                </div>
              </Col>
            )}
          </Row>

          {generalError && <div className='alert alert-danger mt-3'>{generalError}</div>}
        </form>
      </ModalBody>

      <ModalFooter className='pt-0 text-end d-block'>
        <button
          type='button'
          className='btn btn-outline-secondary me-2'
          onClick={onClose}
        >
          Cancelar
        </button>
        <button
          type='submit'
          form={FORM_ID}
          className='btn btn-primary'
          disabled={isSaving}
        >
          {isSaving ? 'Guardando...' : isEditing ? 'Guardar cambios' : 'Crear producto'}
        </button>
      </ModalFooter>
    </Modal>
  );
};

export default ProductFormModal;
