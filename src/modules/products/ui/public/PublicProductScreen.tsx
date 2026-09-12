'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ChevronLeft, Image as ImageIcon, Lock } from 'react-feather';
import { Col, Row, Table } from 'reactstrap';

import { extractErrorMessage } from '@/shared/lib/apiError';
import { useAppSelector } from '@/store/hooks';

import { useGetMedicineOffersQuery } from '../../api/productsApi';
import { useCatalogProduct } from '../../hooks/useCatalogProducts';
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
  const hydrated = useAppSelector((state) => state.auth.hydrated);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const { data, isLoading, isError, error } = useCatalogProduct(productId);

  /* Quien mas vende este mismo medicamento. Solo con sesion: el endpoint la
     exige, y sin precios la comparacion no diria nada de todas formas. */
  const { data: offersData } = useGetMedicineOffersQuery(productId, {
    skip: !isAuthenticated,
  });
  const offers = offersData?.data ?? [];

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

            <div className='dashboard-profile'>
              <ul className='dash-profile'>
                <li>
                  <div className='left'>
                    <h6 className='font-light'>Proveedor</h6>
                  </div>
                  <div className='right'>
                    <h6>{product.organizationName ?? '—'}</h6>
                  </div>
                </li>
                <li>
                  <div className='left'>
                    <h6 className='font-light'>Categoría</h6>
                  </div>
                  <div className='right'>
                    <h6>{product.categoryName ?? '—'}</h6>
                  </div>
                </li>
                {product.brand && (
                  <li>
                    <div className='left'>
                      <h6 className='font-light'>Marca</h6>
                    </div>
                    <div className='right'>
                      <h6>{product.brand}</h6>
                    </div>
                  </li>
                )}
                <li>
                  <div className='left'>
                    <h6 className='font-light'>IVA</h6>
                  </div>
                  <div className='right'>
                    <h6>{taxLabel(product.taxCategory)}</h6>
                  </div>
                </li>
                {attributes.map((pair) => (
                  <li key={pair.key}>
                    <div className='left'>
                      <h6 className='font-light'>
                        {humanizeAttributeKey(pair.key)}
                      </h6>
                    </div>
                    <div className='right'>
                      <h6>{pair.value}</h6>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {product.description && (
              <p className='font-light mt-3'>{product.description}</p>
            )}

            {/* La llamada va aqui, junto a lo que falta, y no al final de la
                pagina: es donde el visitante se topa con que no ve el precio.

                Solo para quien no ha entrado. A quien ya tiene sesion y espera
                aprobacion se lo cuenta la franja de arriba, y pedirle que
                registre la empresa que acaba de registrar no tiene sentido.
                Espera a `hydrated` porque la sesion se lee de localStorage, que
                el servidor no ve. */}
            {hydrated && !isAuthenticated && (
              <div className='public-price-cta'>
                <Lock size={17} />
                <div>
                  <strong>¿Necesitas el precio?</strong>
                  <p className='font-light'>
                    Registra tu empresa y, en cuanto quede aprobada, verás los
                    precios y podrás pedir.
                  </p>
                  <Link href='/register' className='btn btn-primary rounded-1 btn-sm'>
                    Registrar mi empresa
                  </Link>
                </div>
              </div>
            )}
          </Col>
        </Row>

        {/* La razon de ser del maestro: el mismo medicamento, varios
            proveedores, un solo sitio para compararlos. */}
        {offers.length > 0 && (
          <>
            <div className='box-head mt-4'>
              <h3>
                Otros proveedores de este medicamento
                <span className='font-light'> · {offers.length}</span>
              </h3>
            </div>
            <ul className='medicine-offers'>
              {offers.map((offer) => (
                <li key={offer.productId}>
                  <Link href={`/catalog/${offer.productId}`}>
                    <span className='offer-supplier'>
                      <strong>{offer.organizationName ?? 'Proveedor'}</strong>
                      <small className='font-light'>
                        {offer.presentationCount}{' '}
                        {offer.presentationCount === 1 ? 'formato' : 'formatos'}
                        {offer.inStock ? '' : ' · sin existencias'}
                      </small>
                    </span>
                    <span className='offer-price'>
                      <small className='font-light'>desde</small>
                      <strong>
                        <Price value={offer.fromPrice} currency={offer.currency} />
                      </strong>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </>
        )}

        {invima && (
          <>
            <div className='box-head mt-4'>
              <h3>Información del INVIMA</h3>
            </div>
            <div className='dashboard-profile'>
              <ul className='dash-profile'>
                <li>
                  <div className='left'>
                    <h6 className='font-light'>Composición</h6>
                  </div>
                  <div className='right'>
                    <h6>
                      {invima.principiosActivos
                        .map((principio) =>
                          [principio.nombre, principio.cantidad, principio.unidad]
                            .filter(Boolean)
                            .join(' '),
                        )
                        .join(' + ')}
                    </h6>
                  </div>
                </li>
                <li>
                  <div className='left'>
                    <h6 className='font-light'>Registro sanitario</h6>
                  </div>
                  <div className='right'>
                    <h6>{invima.registroSanitario}</h6>
                  </div>
                </li>
                {invima.formaFarmaceutica && (
                  <li>
                    <div className='left'>
                      <h6 className='font-light'>Forma farmacéutica</h6>
                    </div>
                    <div className='right'>
                      <h6>{invima.formaFarmaceutica}</h6>
                    </div>
                  </li>
                )}
                {invima.viasAdministracion.length > 0 && (
                  <li>
                    <div className='left'>
                      <h6 className='font-light'>Vía de administración</h6>
                    </div>
                    <div className='right'>
                      <h6>{invima.viasAdministracion.join(', ')}</h6>
                    </div>
                  </li>
                )}
                {invima.titular && (
                  <li>
                    <div className='left'>
                      <h6 className='font-light'>Titular del registro</h6>
                    </div>
                    <div className='right'>
                      <h6>{invima.titular}</h6>
                    </div>
                  </li>
                )}
              </ul>
            </div>
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
