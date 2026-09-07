'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ChevronLeft, Image as ImageIcon, Lock } from 'react-feather';
import { Col, Row, Table } from 'reactstrap';

import { extractErrorMessage } from '@/shared/lib/apiError';

import { useGetPublicProductQuery } from '../../api/productsApi';
import { humanizeAttributeKey, toAttributePairs } from '../../lib/attributes';
import { taxLabel } from '../../lib/tax';
import { Price } from '../common/Price';

/* La ficha que se ve sin haber entrado.

   Enseña todo lo que describe al producto —composicion, registro del INVIMA,
   formatos, contenido— y no enseña el precio, que es lo unico reservado. Esa
   es la idea: que se pueda comprobar que Suminia tiene lo que se busca antes
   de registrarse, y que para saber cuanto cuesta haga falta hacerlo.

   No hay lista de otros proveedores: ese endpoint pide sesion, y sin precios
   tampoco habria nada que comparar. */
export const PublicProductScreen = ({ productId }: { productId: string }) => {
  const [activeImage, setActiveImage] = useState(0);
  const { data, isLoading, isError, error } = useGetPublicProductQuery(productId);

  if (isLoading) {
    return (
      <section className='section-b-space'>
        <div className='container-fluid-lg'>
          <p className='font-light'>Cargando...</p>
        </div>
      </section>
    );
  }

  if (isError || !data) {
    return (
      <section className='section-b-space'>
        <div className='container-fluid-lg'>
          <div className='alert alert-danger'>
            {extractErrorMessage(error, 'Este producto no está disponible.')}
          </div>
          <Link href='/catalog' className='btn btn-primary rounded-1'>
            Volver al catálogo
          </Link>
        </div>
      </section>
    );
  }

  const product = data.data;
  const attributes = toAttributePairs(product.attributes);
  const invima = product.catalogMedicine;
  const images = [...product.images].sort((a, b) => a.position - b.position);
  const cover = images[activeImage] ?? images[0] ?? null;

  return (
    <section className='section-b-space'>
      <div className='container-fluid-lg'>
        <Link
          href='/catalog'
          className='font-light d-inline-flex align-items-center gap-1 mb-3'
        >
          <ChevronLeft size={16} />
          Volver al catálogo
        </Link>

        <Row className='g-4'>
          <Col lg='5'>
            <div className='product-gallery'>
              <div className='product-gallery-main'>
                {cover ? (
                  /* eslint-disable-next-line @next/next/no-img-element -- las
                     imagenes viven en S3 y next/image exigiria declarar el
                     dominio del bucket en la configuracion. */
                  <img src={cover.url} alt={cover.alt ?? product.name} />
                ) : (
                  <ImageIcon size={32} />
                )}
              </div>

              {images.length > 1 && (
                <div className='product-gallery-thumbs'>
                  {images.map((image, index) => (
                    <button
                      type='button'
                      key={image.id}
                      className={index === activeImage ? 'active' : undefined}
                      onClick={() => setActiveImage(index)}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={image.url} alt={image.alt ?? product.name} />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </Col>

          <Col lg='7'>
            <div className='box-head'>
              <h3>{product.name}</h3>
            </div>

            <ul className='dashboard-profile'>
              <li className='dash-profile'>
                <span className='left font-light'>Proveedor</span>
                <span className='right'>{product.organizationName ?? '—'}</span>
              </li>
              <li className='dash-profile'>
                <span className='left font-light'>Categoría</span>
                <span className='right'>{product.categoryName ?? '—'}</span>
              </li>
              {product.brand && (
                <li className='dash-profile'>
                  <span className='left font-light'>Marca</span>
                  <span className='right'>{product.brand}</span>
                </li>
              )}
              <li className='dash-profile'>
                <span className='left font-light'>IVA</span>
                <span className='right'>{taxLabel(product.taxCategory)}</span>
              </li>
            </ul>

            {attributes.length > 0 && (
              <ul className='dashboard-profile'>
                {attributes.map((pair) => (
                  <li className='dash-profile' key={pair.key}>
                    <span className='left font-light'>
                      {humanizeAttributeKey(pair.key)}
                    </span>
                    <span className='right'>{pair.value}</span>
                  </li>
                ))}
              </ul>
            )}

            {product.description && (
              <p className='font-light mt-3'>{product.description}</p>
            )}

            {/* La llamada va aqui, junto a lo que falta, y no al final de la
                pagina: es donde el visitante se topa con que no ve el precio. */}
            <div className='public-price-cta'>
              <Lock size={17} />
              <div>
                <strong>¿Necesitas el precio?</strong>
                <p className='font-light'>
                  Registra tu empresa y, una vez aprobada, verás los precios de
                  todos los proveedores y podrás compararlos.
                </p>
                <Link href='/register' className='btn btn-primary rounded-1 btn-sm'>
                  Registrar mi empresa
                </Link>
              </div>
            </div>
          </Col>
        </Row>

        {invima && (
          <>
            <div className='box-head mt-4'>
              <h3>Información del INVIMA</h3>
            </div>
            <ul className='dashboard-profile'>
              <li className='dash-profile'>
                <span className='left font-light'>Composición</span>
                <span className='right'>
                  {invima.principiosActivos
                    .map((principio) =>
                      [principio.nombre, principio.cantidad, principio.unidad]
                        .filter(Boolean)
                        .join(' '),
                    )
                    .join(' + ')}
                </span>
              </li>
              <li className='dash-profile'>
                <span className='left font-light'>Registro sanitario</span>
                <span className='right'>{invima.registroSanitario}</span>
              </li>
              {invima.formaFarmaceutica && (
                <li className='dash-profile'>
                  <span className='left font-light'>Forma farmacéutica</span>
                  <span className='right'>{invima.formaFarmaceutica}</span>
                </li>
              )}
              {invima.viasAdministracion.length > 0 && (
                <li className='dash-profile'>
                  <span className='left font-light'>Vía de administración</span>
                  <span className='right'>{invima.viasAdministracion.join(', ')}</span>
                </li>
              )}
              {invima.titular && (
                <li className='dash-profile'>
                  <span className='left font-light'>Titular del registro</span>
                  <span className='right'>{invima.titular}</span>
                </li>
              )}
            </ul>
          </>
        )}

        <div className='box-head mt-4'>
          <h3>Formatos disponibles</h3>
        </div>

        <Table responsive className='align-middle'>
          <thead>
            <tr>
              <th>Formato</th>
              {product.presentations.some((p) => p.cum) && <th>CUM</th>}
              <th>Empaque</th>
              <th>Contenido</th>
              <th>Pedido mínimo</th>
              <th>Precio</th>
            </tr>
          </thead>
          <tbody>
            {product.presentations.map((presentation) => (
              <tr key={presentation.id}>
                <td>{presentation.name}</td>
                {product.presentations.some((p) => p.cum) && (
                  <td className='font-light'>{presentation.cum ?? '—'}</td>
                )}
                <td className='font-light'>{presentation.packaging}</td>
                <td className='font-light'>
                  {presentation.contentQuantity
                    ? `${presentation.contentQuantity} ${presentation.contentUnit ?? ''}`.trim()
                    : '—'}
                </td>
                <td className='font-light'>
                  {presentation.minOrderQuantity}
                  {presentation.orderMultiple > 1 &&
                    ` · de ${presentation.orderMultiple} en ${presentation.orderMultiple}`}
                </td>
                <td>
                  <Price
                    value={presentation.price}
                    currency={presentation.currency}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </section>
  );
};

export default PublicProductScreen;
