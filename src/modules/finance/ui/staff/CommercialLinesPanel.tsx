'use client';

import { useState, type ReactNode } from 'react';
import { toast } from 'react-toastify';

import { extractErrorMessage } from '@/shared/lib/apiError';
import { Panel, SkeletonRows } from '@/shared/ui';

import {
  useAssignCategoryLineMutation,
  useGetCommercialLinesQuery,
  useUpdateCommercialLineMutation,
} from '../../api/financeApi';
import { formatPercent } from '../../lib/format';
import type { CommercialLine, CommercialLineSetting } from '../../model/finance.types';

/* El precio de reventa, por linea comercial.

   Suminia le compra al proveedor a su precio y le vende a la institucion con
   un incremento sobre ese costo. El incremento es de la linea —insumos,
   equipos, mobiliario, dispositivos, medicamentos— y cada categoria del
   catalogo cae en una. Lo que se cambia aqui se ve en el catalogo al
   instante; los pedidos ya hechos conservan su precio.

   Junto al incremento, el margen que deja sobre la venta: un 13% sobre el
   costo es un 11,5% de lo que se cobra, y es este ultimo el que se compara
   con el informe. */
export const CommercialLinesPanel = ({
  editable,
  general,
  children,
}: {
  editable: boolean;
  general: number;
  children?: ReactNode;
}) => {
  const { data, isLoading } = useGetCommercialLinesQuery();
  const lineas = data?.data ?? [];
  const mezcla = lineas.reduce((s, l) => s + l.planMixRate, 0);

  return (
    <Panel
      title='Incremento por línea comercial'
      description={`Sobre el costo del proveedor, antes de IVA. Lo que no tenga línea usa el general, ${formatPercent(general)}.`}
    >
      {isLoading ? (
        <SkeletonRows rows={5} />
      ) : (
        <>
          {Math.round(mezcla) !== 100 && (
            <p className='panel-warning'>
              La mezcla del plan suma {formatPercent(Math.round(mezcla * 10) / 10)}: debería sumar
              100%.
            </p>
          )}
          <div className='catalog-table-scroll'>
            <table className='catalog-table plan-table'>
              <thead>
                <tr>
                  <th>Línea</th>
                  <th className='num'>Incremento</th>
                  <th className='num'>Rango sano</th>
                  <th className='num'>Mezcla del plan</th>
                  <th className='num'>Margen sobre venta</th>
                  {editable && <th />}
                </tr>
              </thead>
              <tbody>
                {lineas.map((linea) => (
                  <LineRow
                    key={`${linea.line}-${linea.markupRate}-${linea.minRate}-${linea.maxRate}-${linea.planMixRate}`}
                    linea={linea}
                    editable={editable}
                  />
                ))}
              </tbody>
            </table>
          </div>
          <CategoryLines lineas={lineas} editable={editable} />
          {children}
        </>
      )}
    </Panel>
  );
};

type Campo = 'markupRate' | 'minRate' | 'maxRate' | 'planMixRate';

const LineRow = ({ linea, editable }: { linea: CommercialLineSetting; editable: boolean }) => {
  const [update, { isLoading }] = useUpdateCommercialLineMutation();
  const [campos, setCampos] = useState<Record<Campo, string>>({
    markupRate: String(linea.markupRate),
    minRate: String(linea.minRate),
    maxRate: String(linea.maxRate),
    planMixRate: String(linea.planMixRate),
  });
  const cambiados = (Object.keys(campos) as Campo[]).filter(
    (c) => Number(campos[c]) !== linea[c],
  );
  const m = Number(campos.markupRate);
  const fuera = m < Number(campos.minRate) || m > Number(campos.maxRate);
  const margen = m > 0 ? Math.round((m / (100 + m)) * 1000) / 10 : 0;

  const guardar = async () => {
    try {
      await update({
        line: linea.line,
        ...Object.fromEntries(cambiados.map((c) => [c, Number(campos[c])])),
      }).unwrap();
      toast.success(`${linea.label}: guardado`);
    } catch (err) {
      toast.error(extractErrorMessage(err, 'No se pudo guardar.'));
    }
  };

  const input = (campo: Campo, etiqueta: string) => (
    <input
      type='number'
      className='form-control plan-input'
      aria-label={`${etiqueta} · ${linea.label}`}
      min={0}
      max={100}
      step={0.5}
      disabled={!editable}
      value={campos[campo]}
      onChange={(event) => setCampos((actual) => ({ ...actual, [campo]: event.target.value }))}
    />
  );

  return (
    <tr>
      <td>
        <strong>{linea.label}</strong>
        <small className='font-light d-block'>
          {linea.categories.length > 0
            ? linea.categories.map((c) => c.name).join(', ')
            : 'Sin categorías'}
        </small>
      </td>
      <td className='num'>
        <span className='plan-cell'>
          {input('markupRate', 'Incremento')}%
        </span>
        {fuera && <span className='document-state is-danger mt-1'>Fuera de rango</span>}
      </td>
      <td className='num'>
        <span className='plan-cell'>
          {input('minRate', 'Mínimo')} – {input('maxRate', 'Máximo')}%
        </span>
      </td>
      <td className='num'>
        <span className='plan-cell'>{input('planMixRate', 'Mezcla')}%</span>
      </td>
      <td className='num'>{formatPercent(margen)}</td>
      {editable && (
        <td className='num'>
          <button
            type='button'
            className='btn btn-primary btn-sm'
            disabled={cambiados.length === 0 || isLoading}
            onClick={guardar}
          >
            {isLoading ? 'Guardando...' : 'Guardar'}
          </button>
        </td>
      )}
    </tr>
  );
};

/* En que linea cae cada categoria del catalogo. Se guarda al elegir: es un
   solo dato, y moverla cambia al instante el precio de sus productos. */
const CategoryLines = ({
  lineas,
  editable,
}: {
  lineas: CommercialLineSetting[];
  editable: boolean;
}) => {
  const [assign, { isLoading }] = useAssignCategoryLineMutation();
  const categorias = lineas
    .flatMap((l) => l.categories.map((c) => ({ ...c, line: l.line })))
    .sort((a, b) => a.name.localeCompare(b.name, 'es'));
  if (categorias.length === 0) return null;

  const mover = async (categoryId: string, nombre: string, line: CommercialLine) => {
    try {
      await assign({ categoryId, line }).unwrap();
      toast.success(`${nombre} pasa a ${lineas.find((l) => l.line === line)?.label}`);
    } catch (err) {
      toast.error(extractErrorMessage(err, 'No se pudo mover la categoría.'));
    }
  };

  return (
    <div className='plan-categories'>
      <h3 className='order-subhead'>Categorías del catálogo</h3>
      <div className='form-grid'>
        {categorias.map((c) => (
          <div key={c.id}>
            <label className='form-label' htmlFor={`linea-${c.id}`}>
              {c.name}
            </label>
            <select
              id={`linea-${c.id}`}
              className='form-control'
              disabled={!editable || isLoading}
              value={c.line}
              onChange={(event) => mover(c.id, c.name, event.target.value as CommercialLine)}
            >
              {lineas.map((l) => (
                <option key={l.line} value={l.line}>
                  {l.label}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommercialLinesPanel;
