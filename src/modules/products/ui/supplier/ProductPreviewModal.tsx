'use client';

import { Image as ImageIcon, Lock } from 'react-feather';
import { Col, Modal, ModalBody, ModalFooter, ModalHeader, Row } from 'reactstrap';

import { humanizeAttributeKey, type AttributePair } from '../../lib/attributes';

/* Lo que el proveedor lleva escrito, con la forma de la ficha que vera el
   comprador. Solo lo que necesita la vista previa, y ya en texto: el
   formulario lo compone y aqui solo se pinta. */
export interface ProductPreviewData {
  name: string;
  categoryName: string;
  brand: string;
  manufacturer: string;
  sanitaryRegistration: string;
  description: string;
  attributes: AttributePair[];
  /* La primera presentacion; nula al editar, donde no se toca. */
  presentation: {
    name: string;
    packaging: string;
    content: string;
    stock: string;
  } | null;
  /* Lo que el comprador no ve. */
  internal: {
    price: string;
    stock: string;
    sku: string;
    tax: string;
  };
}

interface ProductPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: ProductPreviewData;
}

/* Un dato que falta se dice en el mismo lugar donde iria, tenue: al revisar
   es justo lo que se quiere encontrar. */
const Falta = ({ children = 'Sin completar' }: { children?: string }) => (
  <span className='is-empty'>{children}</span>
);

/* La ficha del producto tal como la vera el comprador en Suminia, con lo
   escrito hasta ahora, y debajo los datos internos, que solo ven el
   proveedor y Suminia.

   Sin imagen ni precio de venta, y se dice en su lugar: las fotos se suben
   despues de crear el producto, y el precio al comprador lo fija Suminia con
   su incremento, que el proveedor no ve. El codigo CRS tampoco existe todavia:
   lo asigna la base al crear. */
const ProductPreviewModal = ({ isOpen, onClose, data }: ProductPreviewModalProps) => {
  const especificaciones = data.attributes.filter(
    (pair) => pair.key.trim() && pair.value.trim(),
  );

  return (
    <Modal
      className='product-preview-modal'
      size='xl'
      centered
      scrollable
      isOpen={isOpen}
      toggle={onClose}
    >
      <ModalHeader toggle={onClose}></ModalHeader>

      <ModalBody>
        <div className='box-head'>
          <h3>Vista previa del producto</h3>
        </div>
        <p className='font-light product-preview-note'>
          Así verá el comprador tu producto en Suminia, con lo que llevas registrado.
        </p>

        <Row className='g-4'>
          <Col md='4'>
            <div className='product-preview-image'>
              <ImageIcon size={28} />
              <span>Imagen del producto</span>
            </div>
          </Col>

          <Col md='8'>
            <div className='product-detail'>
              <div className='product-detail-tags'>
                {data.categoryName ? (
                  <span className='product-detail-category'>{data.categoryName}</span>
                ) : (
                  <Falta>Sin categoría</Falta>
                )}
                <span className='product-detail-stock'>Disponible</span>
              </div>

              <h1 className='product-detail-title'>
                {data.name || <Falta>Sin nombre</Falta>}
              </h1>

              <p className='product-detail-supplier'>
                <strong>CRS asignado al crear</strong>
                {data.brand && (
                  <>
                    {' · '}
                    <span className='font-light'>Marca {data.brand}</span>
                  </>
                )}
              </p>

              <p className='product-detail-registry'>
                Registro sanitario INVIMA{' '}
                {data.sanitaryRegistration ? (
                  <strong>{data.sanitaryRegistration}</strong>
                ) : (
                  <span className='font-light'>· no informado</span>
                )}
              </p>

              <div className='product-detail-price'>
                <span className='font-light'>Precio de venta definido por Suminia</span>
              </div>

              {data.description ? (
                <p className='product-detail-description font-light'>{data.description}</p>
              ) : (
                <p className='product-detail-description'>
                  <Falta>Sin descripción</Falta>
                </p>
              )}
            </div>
          </Col>
        </Row>

        <div className='product-detail-sheet'>
          <section className='product-detail-block'>
            <div className='box-head'>
              <h3>Especificaciones</h3>
            </div>
            <ul className='data-list'>
              <li>
                <span className='font-light'>Marca</span>
                <span>{data.brand || <Falta />}</span>
              </li>
              <li>
                <span className='font-light'>Fabricante</span>
                <span>{data.manufacturer || <Falta />}</span>
              </li>
              {especificaciones.map((pair) => (
                <li key={pair.key}>
                  <span className='font-light'>{humanizeAttributeKey(pair.key)}</span>
                  <span>{pair.value}</span>
                </li>
              ))}
            </ul>
          </section>

          {data.presentation && (
            <section className='product-detail-block'>
              <div className='box-head'>
                <h3>Presentaciones</h3>
              </div>
              <table className='table align-middle format-table'>
                <thead>
                  <tr>
                    <th>Presentación</th>
                    <th>Empaque</th>
                    <th>Contenido</th>
                    <th>Existencias</th>
                    <th className='text-end'>Precio</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <strong>{data.presentation.name || <Falta />}</strong>
                    </td>
                    <td className='font-light'>{data.presentation.packaging || <Falta />}</td>
                    <td className='font-light'>{data.presentation.content || <Falta />}</td>
                    <td className='font-light'>{data.presentation.stock || <Falta />}</td>
                    <td className='text-end font-light'>Definido por Suminia</td>
                  </tr>
                </tbody>
              </table>
            </section>
          )}

          {/* Lo que el comprador no ve, aparte y marcado: el precio al que le
              vende a Suminia, lo que reserva y su codigo interno. */}
          <section className='product-detail-block product-preview-internal'>
            <div className='box-head'>
              <h3>
                <Lock size={16} className='me-2' />
                Datos internos
              </h3>
            </div>
            <p className='font-light'>Solo los ves tú y Suminia. El comprador no los ve.</p>
            <ul className='data-list'>
              {data.presentation && (
                <>
                  <li>
                    <span className='font-light'>Tu precio a Suminia (sin IVA)</span>
                    <span>{data.internal.price || <Falta />}</span>
                  </li>
                  <li>
                    <span className='font-light'>Inventario disponible para Suminia</span>
                    <span>{data.internal.stock || <Falta />}</span>
                  </li>
                  <li>
                    <span className='font-light'>SKU del proveedor</span>
                    <span>{data.internal.sku || <Falta>No aplica</Falta>}</span>
                  </li>
                </>
              )}
              <li>
                <span className='font-light'>IVA</span>
                <span>{data.internal.tax}</span>
              </li>
            </ul>
          </section>
        </div>
      </ModalBody>

      <ModalFooter className='text-end d-block'>
        <button type='button' className='btn btn-outline-secondary' onClick={onClose}>
          Cerrar
        </button>
      </ModalFooter>
    </Modal>
  );
};

export default ProductPreviewModal;
