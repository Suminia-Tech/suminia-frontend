'use client';

import { useState, type ChangeEvent, type FormEvent } from 'react';
import { Eye, Plus, X } from 'react-feather';
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
import {
  cantidadConUnidad,
  composePresentationName,
  precioPor,
  precioUnitario,
} from '../../lib/presentationName';
import { PRODUCT_TYPE_HELP } from '../../lib/productTypes';
import { TAX_OPTIONS, defaultTaxCategory, taxLabel } from '../../lib/tax';
import { formatPrice } from '../../lib/productLabels';
import { CONTENT_UNITS, PACKAGING_SUGGESTIONS } from '../../lib/units';
import type {
  CatalogMedicine,
  CatalogMedicineSearchResult,
  Product,
  ProductType,
  TaxCategory,
} from '../../model/product.types';
import CatalogMedicinePicker from './CatalogMedicinePicker';
import ProductPreviewModal, { type ProductPreviewData } from './ProductPreviewModal';

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
  /* Si necesita frio o temperatura controlada. Suminia todavia no los vende,
     de modo que un si no se guarda: frena el alta. Por eso no viaja al
     backend ni se pregunta al editar —todo producto existente ya dijo que
     no—. Vacia es "no ha respondido". */
  const [needsTemperature, setNeedsTemperature] = useState<'' | 'yes' | 'no'>('');
  const blockedByTemperature = !isEditing && needsTemperature === 'yes';
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
    if (!isEditing && !needsTemperature)
      next.needsTemperature = 'Responde si requiere condiciones especiales de temperatura';

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

    if (blockedByTemperature) return;

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

  /* No se deduce del tipo: los medicamentos estan excluidos, pero entre los
     insumos hay gravados al 19%, al 5% y excluidos. Sin esto no se puede
     facturar. Al crear va al lado del precio, que es con lo que se lee: el
     precio se declara sin IVA y el IVA es lo que se le suma. */
  /* La vista previa: lo escrito hasta ahora, con la forma de la ficha que
     vera el comprador. Sin presentacion al editar: ahi se edita solo el
     producto. */
  const [previewOpen, setPreviewOpen] = useState(false);
  const presentacion = isEditing
    ? ''
    : composePresentationName({
        packaging: form.packaging,
        contentQuantity: form.contentQuantity,
        contentUnit: form.contentUnit,
        variant: form.variant,
      });
  const unitario = precioUnitario(form.price, form.contentQuantity, form.contentUnit);

  const vistaPrevia: ProductPreviewData = {
    name: form.name.trim(),
    categoryName: categories.find((category) => category.id === form.categoryId)?.name ?? '',
    brand: form.brand.trim(),
    manufacturer: form.manufacturer.trim(),
    sanitaryRegistration: form.sanitaryRegistration.trim(),
    description: form.description.trim(),
    attributes,
    presentation: isEditing
      ? null
      : {
          name: presentacion,
          packaging: form.packaging,
          content: cantidadConUnidad(form.contentQuantity, form.contentUnit),
          stock: form.stock.trim(),
        },
    internal: {
      price: form.price.trim() ? formatPrice(Number(form.price)) : '',
      stock: form.stock.trim(),
      sku: form.sku.trim(),
      tax: taxLabel(form.taxCategory),
    },
  };

  const ivaField = (
    <>
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
    </>
  );

  return (
    <Modal
      className='add-address-modal product-form-modal modal-sticky-footer'
      centered
      scrollable
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
            Si modificas información técnica o sanitaria del producto, su publicación
            se suspenderá temporalmente al guardar los cambios. Volverá a estar
            disponible para compras una vez Suminia apruebe la actualización.
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

              {/* Justo despues de la categoria y antes de todo lo demas: si la
                  respuesta frena el alta, que lo sepa antes de llenar el resto. */}
              {!isEditing && (
                <fieldset className='mb-3'>
                  <legend className='form-label font-light'>
                    ¿Este producto requiere condiciones especiales de temperatura para su
                    almacenamiento o transporte?
                  </legend>
                  {(
                    [
                      { value: 'no', label: 'No' },
                      { value: 'yes', label: 'Sí' },
                    ] as const
                  ).map((option) => (
                    <div className='form-check form-check-inline' key={option.value}>
                      <input
                        id={`producto-temperatura-${option.value}`}
                        type='radio'
                        name='producto-temperatura'
                        className='form-check-input'
                        checked={needsTemperature === option.value}
                        onChange={() => {
                          setNeedsTemperature(option.value);
                          setErrors((current) => ({ ...current, needsTemperature: undefined }));
                        }}
                      />
                      <label
                        className='form-check-label'
                        htmlFor={`producto-temperatura-${option.value}`}
                      >
                        {option.label}
                      </label>
                    </div>
                  ))}
                  {errors.needsTemperature && (
                    <small className='text-danger d-block'>{errors.needsTemperature}</small>
                  )}
                  {blockedByTemperature && (
                    <div className='alert alert-warning mt-2 mb-0'>
                      En el momento Suminia no comercializará productos que requieran
                      condiciones especiales de temperatura. Estamos avanzando para
                      brindarte un mejor servicio.
                    </div>
                  )}
                </fieldset>
              )}

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
                  {errors.reference && (
                    <small className='text-danger'>{errors.reference}</small>
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

              {/* Al editar no hay columna de presentacion: el IVA queda aqui. */}
              {isEditing && <div className='mb-3'>{ivaField}</div>}

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
                  Registra la unidad de venta y su contenido (por ejemplo, caja x 10 o
                  frasco x 500 mL). Podrás agregar otras presentaciones una vez creado el
                  producto.
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
                    <small className='font-light'>Talla, calibre o color, si aplica.</small>
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

                {/* El contenido va pegado a la unidad de venta porque es su
                    otra mitad: "Caja" sola no dice nada, "Caja x 50" si. Al
                    final del formulario nadie lo encontraba. De cantidad y
                    unidad sale ademas el precio por unidad, que es lo que
                    revela que la caja de 100 sale mejor que la de 10. */}
                <Row>
                  <Col sm='6' className='mb-3'>
                    <label className='form-label font-light'>Contenido</label>
                    <input
                      type='number'
                      min='0'
                      step='any'
                      className='form-control'
                      placeholder='50'
                      value={form.contentQuantity}
                      onChange={handleChange('contentQuantity')}
                    />
                    {errors.contentQuantity && (
                      <small className='text-danger'>{errors.contentQuantity}</small>
                    )}
                  </Col>
                  <Col sm='6' className='mb-3'>
                    <label className='form-label font-light'>Unidad de medida</label>
                    <SelectWithCustom
                      options={CONTENT_UNITS}
                      value={form.contentUnit}
                      onChange={(value) => setField('contentUnit', value)}
                      emptyLabel='Selecciona la unidad de medida'
                      customPlaceholder='Escribe la unidad de medida'
                    />
                    {errors.contentUnit && (
                      <small className='text-danger'>{errors.contentUnit}</small>
                    )}
                  </Col>
                </Row>



                <Row>
                  <Col sm='6' className='mb-3'>
                    <label className='form-label font-light'>
                      Tu precio a Suminia {precioPor(form.packaging)} (COP, sin IVA)
                    </label>
                    <input
                      type='number'
                      min='0'
                      className='form-control'
                      value={form.price}
                      onChange={handleChange('price')}
                    />
                    {errors.price ? (
                      <small className='text-danger'>{errors.price}</small>
                    ) : (
                      unitario && (
                        <small className='font-light'>
                          Equivale a {formatPrice(unitario.valor)} por {unitario.unidad}.
                        </small>
                      )
                    )}
                  </Col>
                  <Col sm='6' className='mb-3'>
                    {ivaField}
                  </Col>
                </Row>

                <Row>
                  <Col sm='6' className='mb-3'>
                    {/* No todo lo que tiene en bodega: lo que reserva para Suminia.
                        Si pone todo, un comprador puede pedir lo que ya vendio
                        por otro lado. */}
                    <label className='form-label font-light'>
                      Inventario disponible para Suminia
                    </label>
                    <input
                      type='number'
                      min='0'
                      className='form-control'
                      value={form.stock}
                      onChange={handleChange('stock')}
                    />
                  </Col>
                  <Col sm='6' className='mb-3'>
                    {/* "del proveedor": el codigo de Suminia es otro (CRS), y un
                        "SKU" a secas se confundia con el. */}
                    <label className='form-label font-light'>SKU del proveedor</label>
                    <input
                      type='text'
                      className='form-control'
                      value={form.sku}
                      onChange={handleChange('sku')}
                    />
                  </Col>
                </Row>

              </Col>
            )}
          </Row>

          {generalError && <div className='alert alert-danger mt-3'>{generalError}</div>}
        </form>
      </ModalBody>

      {/* La vista previa a la izquierda, separada de cancelar y guardar: es
          para revisar, no una de las dos salidas del formulario. */}
      <ModalFooter className='pt-0 d-flex flex-wrap gap-2 product-form-footer'>
        <button
          type='button'
          className='btn btn-outline-secondary btn-with-icon me-auto'
          onClick={() => setPreviewOpen(true)}
        >
          <Eye size={15} /> Vista previa del producto
        </button>
        <button
          type='button'
          className='btn btn-outline-secondary'
          onClick={onClose}
        >
          Cancelar
        </button>
        <button
          type='submit'
          form={FORM_ID}
          className='btn btn-primary'
          disabled={isSaving || blockedByTemperature}
        >
          {isSaving ? 'Guardando...' : isEditing ? 'Guardar cambios' : 'Crear producto'}
        </button>
      </ModalFooter>

      <ProductPreviewModal
        isOpen={previewOpen}
        onClose={() => setPreviewOpen(false)}
        data={vistaPrevia}
      />
    </Modal>
  );
};

export default ProductFormModal;
