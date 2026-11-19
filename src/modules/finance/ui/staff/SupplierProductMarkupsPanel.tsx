'use client';

import { useState } from 'react';
import { toast } from 'react-toastify';

import { extractErrorMessage } from '@/shared/lib/apiError';
import { hasPermission } from '@/shared/lib/permissions';
import { Panel } from '@/shared/ui';
import { useAppSelector } from '@/store/hooks';

import {
  useGetCommercialLinesQuery,
  useGetFinanceSettingsQuery,
  useGetOrganizationFinanceQuery,
  useGetSupplierProductMarkupsQuery,
  useUpdateProductMarkupMutation,
} from '../../api/financeApi';
import { formatPercent } from '../../lib/format';
import type { ProductMarkup } from '../../model/finance.types';
import OrganizationChanges from './OrganizationChanges';

/* El incremento de los productos de un proveedor, en su ficha.

   El incremento se fija por linea comercial y no por proveedor: lo que pesa
   en el margen es que se vende, no a quien se le compra. La excepcion es el
   producto: uno cuyas condiciones de mercado —un competidor, un volumen
   grande, un precio regulado— piden otro margen se pacta aqui, solo el. Vacio
   es "el de su linea", y cambiar la linea lo alcanza. */
export const SupplierProductMarkupsPanel = ({ supplierId }: { supplierId: string }) => {
  const permissions = useAppSelector((state) => state.auth.user?.permissions);
  const editable = hasPermission(permissions, 'finance:manage');
  const { data } = useGetSupplierProductMarkupsQuery(supplierId);
  const { data: lineas } = useGetCommercialLinesQuery();
  const { data: ajustes } = useGetFinanceSettingsQuery();
  const { data: finanzas } = useGetOrganizationFinanceQuery(supplierId);

  if (!data) return null;
  const productos = data.data;
  const general = ajustes?.data.commissionRate ?? null;
  const deLinea = (producto: ProductMarkup) =>
    lineas?.data.find((l) => l.line === producto.line)?.markupRate ?? general;
  const pactados = productos.filter((p) => p.rate !== null).length;

  return (
    <Panel
      className='organization-finance-panel'
      title='Incremento por producto'
      description={
        pactados === 0
          ? 'Cada producto se vende con el incremento de su línea comercial. Si las condiciones de mercado de un producto piden otro margen, pacta el suyo aquí: solo cambia ese producto.'
          : `${pactados === 1 ? 'Un producto tiene' : `${pactados} productos tienen`} un incremento pactado en vez del de su línea; el resto se vende con el de su línea. Los pedidos hechos conservan el suyo.`
      }
    >
      {productos.length === 0 ? (
        <p className='font-light mb-0'>Este proveedor todavía no tiene productos.</p>
      ) : (
        <div className='catalog-table-scroll'>
          <table className='catalog-table markup-table'>
            <thead>
              <tr>
                <th>Producto</th>
                <th>Línea comercial</th>
                <th className='num'>De su línea</th>
                <th>Incremento del producto</th>
              </tr>
            </thead>
            <tbody>
              {productos.map((producto) => (
                <MarkupRow
                  key={`${producto.productId}-${producto.rate}`}
                  producto={producto}
                  lineRate={deLinea(producto)}
                  editable={editable}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
      {finanzas && <OrganizationChanges changes={finanzas.data.changes} />}
    </Panel>
  );
};

const MarkupRow = ({
  producto,
  lineRate,
  editable,
}: {
  producto: ProductMarkup;
  lineRate: number | null;
  editable: boolean;
}) => {
  const [update, { isLoading }] = useUpdateProductMarkupMutation();
  const actual = producto.rate === null ? '' : String(producto.rate);
  const [valor, setValor] = useState(actual);

  const guardar = async (rate: number | null) => {
    try {
      await update({ productId: producto.productId, supplierId: producto.supplierId, rate }).unwrap();
      toast.success(
        rate === null
          ? `${producto.name} vuelve al incremento de su línea`
          : `Incremento de ${producto.name} guardado`,
      );
    } catch (err) {
      toast.error(extractErrorMessage(err, 'No se pudo guardar el incremento.'));
    }
  };

  return (
    <tr>
      <td>
        {producto.name}
        {producto.category && <span className='d-block font-light'>{producto.category}</span>}
      </td>
      <td>{producto.lineLabel ?? <span className='font-light'>Sin línea: el general</span>}</td>
      <td className='num'>{lineRate === null ? '—' : formatPercent(lineRate)}</td>
      <td>
        {editable ? (
          <div className='markup-edit'>
            <input
              type='number'
              min={0}
              max={50}
              step={0.5}
              className='form-control'
              aria-label={`Incremento de ${producto.name}`}
              placeholder='El de su línea'
              value={valor}
              onChange={(event) => setValor(event.target.value)}
            />
            <span className='font-light'>%</span>
            {valor !== actual && valor !== '' && (
              <button
                type='button'
                className='btn btn-primary btn-sm'
                disabled={isLoading}
                onClick={() => guardar(Number(valor))}
              >
                {isLoading ? 'Guardando...' : 'Guardar'}
              </button>
            )}
            {producto.rate !== null && (
              <button
                type='button'
                className='btn btn-outline-secondary btn-sm'
                disabled={isLoading}
                onClick={() => guardar(null)}
              >
                Volver al de su línea
              </button>
            )}
          </div>
        ) : producto.rate === null ? (
          <span className='font-light'>El de su línea</span>
        ) : (
          formatPercent(producto.rate)
        )}
      </td>
    </tr>
  );
};

export default SupplierProductMarkupsPanel;
