import { formatDate } from '@/shared/lib/dates';

import { formatChangeValue } from '../../lib/format';
import type { FinanceChange } from '../../model/finance.types';

/* El historial de las reglas de una empresa, debajo de donde se cambian. */
export const OrganizationChanges = ({ changes }: { changes: FinanceChange[] }) =>
  changes.length === 0 ? null : (
    <div className='catalog-table-scroll mt-3'>
      <table className='catalog-table'>
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Cambio</th>
            <th>Antes</th>
            <th>Ahora</th>
            <th>Quién</th>
          </tr>
        </thead>
        <tbody>
          {changes.map((cambio) => (
            <tr key={cambio.id}>
              <td>{formatDate(cambio.createdAt)}</td>
              <td>{cambio.label}</td>
              <td className='font-light'>{formatChangeValue(cambio.field, cambio.oldValue)}</td>
              <td>{formatChangeValue(cambio.field, cambio.newValue)}</td>
              <td>{cambio.userName}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

export default OrganizationChanges;
