'use client';

import { Plus, X } from 'react-feather';

import { Panel } from '@/shared/ui';

import type { IdentificationType } from '../../model/organization.types';

/* Los accionistas y beneficiarios finales de la empresa, en la declaracion.

   Suminia tiene que saber quien esta detras de la empresa a la que le compra
   o le vende, por control de riesgo. Una tarjeta por persona —como las
   bodegas y los contactos—: quien es, de que sociedad es accionista y con
   cuanto. La sociedad puede ser la propia empresa o una que a su vez es
   accionista de ella; asi se llega hasta la persona natural. */

export interface OwnerValues {
  idType: IdentificationType;
  idNumber: string;
  name: string;
  companyName: string;
  companyTaxId: string;
  /** Texto mientras se escribe: "33,5". */
  ownership: string;
}

export const ID_TYPE_OPTIONS: { value: IdentificationType; label: string }[] = [
  { value: 'CC', label: 'Cédula de ciudadanía' },
  { value: 'CE', label: 'Cédula de extranjería' },
  { value: 'NIT', label: 'NIT' },
  { value: 'PASSPORT', label: 'Pasaporte' },
  { value: 'OTHER', label: 'Otro' },
];

const MAX_OWNERS = 30;

export const emptyOwner = (companyName = '', companyTaxId = ''): OwnerValues => ({
  idType: 'CC',
  idNumber: '',
  name: '',
  companyName,
  companyTaxId,
  ownership: '',
});

/* "33,5" o "33.5" → 33.5; nulo si no es un numero. */
export const parseOwnership = (texto: string): number | null => {
  const n = Number(texto.replace(',', '.').trim());
  return texto.trim() && Number.isFinite(n) ? n : null;
};

/* Lo que falta en cada fila, por su posicion; vacio si esta completa. */
export const ownerErrorsOf = (owners: OwnerValues[]): Record<number, string> => {
  const errors: Record<number, string> = {};
  owners.forEach((owner, index) => {
    const pct = parseOwnership(owner.ownership);
    if (!owner.idNumber.trim() || !owner.name.trim() || !owner.companyName.trim() || !owner.companyTaxId.trim()) {
      errors[index] = 'Completa la identificación, el nombre y la sociedad de la que es accionista.';
    } else if (pct === null || pct <= 0 || pct > 100) {
      errors[index] = 'La participación va de 0 a 100%.';
    }
  });
  return errors;
};

const BeneficialOwnersFields = ({
  owners,
  onChange,
  errors,
  emptyError,
  defaultCompany,
}: {
  owners: OwnerValues[];
  onChange: (owners: OwnerValues[]) => void;
  errors: Record<number, string>;
  /** Cuando no hay ninguna fila. */
  emptyError?: string;
  /** La propia empresa, para precargar la sociedad de una fila nueva. */
  defaultCompany: { name: string; taxId: string };
}) => {
  const cambiar = (index: number, patch: Partial<OwnerValues>) =>
    onChange(owners.map((owner, i) => (i === index ? { ...owner, ...patch } : owner)));

  return (
    <Panel
      title='Accionistas y beneficiarios finales'
      description='Quiénes son los dueños de la empresa y de qué sociedad es accionista cada uno, con su porcentaje de participación. Si eres persona natural, regístrate tú con el 100%.'
    >
      <div className='form-grid'>
        {owners.map((owner, index) => {
          const id = (field: string) => `accionista-${index}-${field}`;
          return (
            <fieldset className='form-grid-full contact-area' key={index}>
              <div className='contact-area-head'>
                <span className='form-group-title'>
                  {owner.name.trim() || `Accionista ${index + 1}`}
                </span>
                {owners.length > 1 && (
                  <button
                    type='button'
                    className='btn btn-outline-secondary btn-sm'
                    aria-label='Quitar accionista'
                    title='Quitar accionista'
                    onClick={() => onChange(owners.filter((_, i) => i !== index))}
                  >
                    <X size={15} />
                  </button>
                )}
              </div>
              <div className='form-grid'>
                <div>
                  <label className='form-label' htmlFor={id('tipo')}>
                    Tipo de identificación
                  </label>
                  <select
                    id={id('tipo')}
                    className='form-control'
                    value={owner.idType}
                    onChange={(event) =>
                      cambiar(index, { idType: event.target.value as IdentificationType })
                    }
                  >
                    {ID_TYPE_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className='form-label' htmlFor={id('numero')}>
                    No. de identificación
                  </label>
                  <input
                    id={id('numero')}
                    type='text'
                    className='form-control'
                    maxLength={30}
                    value={owner.idNumber}
                    onChange={(event) => cambiar(index, { idNumber: event.target.value })}
                  />
                </div>
                <div className='form-grid-full'>
                  <label className='form-label' htmlFor={id('nombre')}>
                    Nombre completo o razón social
                  </label>
                  <input
                    id={id('nombre')}
                    type='text'
                    className='form-control'
                    maxLength={180}
                    value={owner.name}
                    onChange={(event) => cambiar(index, { name: event.target.value })}
                  />
                </div>
                <div>
                  <label className='form-label' htmlFor={id('sociedad')}>
                    Sociedad de la que es accionista
                  </label>
                  <input
                    id={id('sociedad')}
                    type='text'
                    className='form-control'
                    maxLength={180}
                    value={owner.companyName}
                    onChange={(event) => cambiar(index, { companyName: event.target.value })}
                  />
                </div>
                <div>
                  <label className='form-label' htmlFor={id('nit')}>
                    NIT de esa sociedad
                  </label>
                  <input
                    id={id('nit')}
                    type='text'
                    className='form-control'
                    maxLength={30}
                    placeholder='900123456-8'
                    value={owner.companyTaxId}
                    onChange={(event) => cambiar(index, { companyTaxId: event.target.value })}
                  />
                </div>
                <div>
                  <label className='form-label' htmlFor={id('participacion')}>
                    % de participación
                  </label>
                  <input
                    id={id('participacion')}
                    type='text'
                    inputMode='decimal'
                    className='form-control'
                    placeholder='60'
                    value={owner.ownership}
                    onChange={(event) =>
                      cambiar(index, { ownership: event.target.value.replace(/[^\d.,]/g, '') })
                    }
                  />
                </div>
              </div>
              {errors[index] && <small className='text-danger'>{errors[index]}</small>}
            </fieldset>
          );
        })}

        {owners.length === 0 && emptyError && (
          <small className='text-danger form-grid-full'>{emptyError}</small>
        )}

        {owners.length < MAX_OWNERS && (
          <div className='form-grid-full'>
            <button
              type='button'
              className='btn btn-outline-secondary btn-sm btn-with-icon'
              onClick={() =>
                onChange([...owners, emptyOwner(defaultCompany.name, defaultCompany.taxId)])
              }
            >
              <Plus size={15} /> Añadir accionista
            </button>
          </div>
        )}
      </div>
    </Panel>
  );
};

export default BeneficialOwnersFields;
