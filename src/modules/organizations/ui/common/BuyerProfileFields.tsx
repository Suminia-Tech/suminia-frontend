'use client';

import { Panel } from '@/shared/ui';

import {
  BUYER_ACTIVITY_OPTIONS,
  IPS_SECTOR_OPTIONS,
  LEGAL_NATURE_OPTIONS,
} from '../../lib/commercialProfile';
import type { BuyerActivity, IpsSector, LegalNature } from '../../model/organization.types';

/* Lo que el comprador escribe de su perfil. Cadenas: vacia es "sin elegir". */
export interface BuyerProfileValues {
  legalNature: LegalNature | '';
  buyerActivity: BuyerActivity | '';
  ipsSector: IpsSector | '';
  activityOther: string;
  bankName: string;
  bankAccountNumber: string;
}

export type BuyerProfileErrors = Partial<Record<keyof BuyerProfileValues, string>>;

interface BuyerProfileFieldsProps {
  values: BuyerProfileValues;
  errors: BuyerProfileErrors;
  onChange: (values: Partial<BuyerProfileValues>) => void;
}

/* Lo que el comprador declara de si mismo para que Suminia lo apruebe: quien
   es —persona juridica o natural, y a que se dedica— y con que cuenta paga.

   La actividad depende de la naturaleza: cambiar de juridica a natural borra
   la actividad elegida, que en la otra lista no existe. */
const BuyerProfileFields = ({ values, errors, onChange }: BuyerProfileFieldsProps) => {
  const actividades = values.legalNature ? BUYER_ACTIVITY_OPTIONS[values.legalNature] : [];

  return (
    <>
      <Panel
        title='Naturaleza de la organización'
        description='Decide qué documentos te pedimos para verificar tu empresa.'
      >
        <div className='form-grid'>
          <fieldset className='form-grid-full'>
            <legend className='form-label'>¿Cuál es la naturaleza de su organización?</legend>
            <div className='yes-no'>
              {LEGAL_NATURE_OPTIONS.map((option) => (
                <div className='form-check' key={option.value}>
                  <input
                    id={`naturaleza-${option.value}`}
                    type='radio'
                    name='naturaleza'
                    className='form-check-input'
                    checked={values.legalNature === option.value}
                    onChange={() =>
                      onChange({
                        legalNature: option.value,
                        buyerActivity: '',
                        ipsSector: '',
                        activityOther: '',
                      })
                    }
                  />
                  <label className='form-check-label' htmlFor={`naturaleza-${option.value}`}>
                    {option.label}
                  </label>
                </div>
              ))}
            </div>
            {errors.legalNature && <small className='text-danger'>{errors.legalNature}</small>}
          </fieldset>

          {values.legalNature && (
            <div className='form-grid-full'>
              <label className='form-label' htmlFor='actividad'>
                ¿Cuál es su actividad?
              </label>
              <select
                id='actividad'
                className='form-control'
                value={values.buyerActivity}
                onChange={(event) =>
                  onChange({
                    buyerActivity: event.target.value as BuyerActivity | '',
                    ipsSector: '',
                    activityOther: '',
                  })
                }
              >
                <option value=''>Elige la actividad</option>
                {actividades.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors.buyerActivity && (
                <small className='text-danger'>{errors.buyerActivity}</small>
              )}
            </div>
          )}

          {values.buyerActivity === 'IPS' && (
            <fieldset className='form-grid-full'>
              <legend className='form-label'>¿La IPS es pública, mixta o privada?</legend>
              <div className='yes-no'>
                {IPS_SECTOR_OPTIONS.map((option) => (
                  <div className='form-check' key={option.value}>
                    <input
                      id={`sector-${option.value}`}
                      type='radio'
                      name='sector'
                      className='form-check-input'
                      checked={values.ipsSector === option.value}
                      onChange={() => onChange({ ipsSector: option.value })}
                    />
                    <label className='form-check-label' htmlFor={`sector-${option.value}`}>
                      {option.label}
                    </label>
                  </div>
                ))}
              </div>
              {errors.ipsSector && <small className='text-danger'>{errors.ipsSector}</small>}
            </fieldset>
          )}

          {values.buyerActivity === 'OTHER' && (
            <div className='form-grid-full'>
              <label className='form-label' htmlFor='actividad-otra'>
                ¿Cuál?
              </label>
              <input
                id='actividad-otra'
                type='text'
                className='form-control'
                maxLength={255}
                value={values.activityOther}
                onChange={(event) => onChange({ activityOther: event.target.value })}
              />
              {errors.activityOther && (
                <small className='text-danger'>{errors.activityOther}</small>
              )}
            </div>
          )}
        </div>
      </Panel>

      <Panel
        title='Medio de pago'
        description='La cuenta con la que pagas tus pedidos. Súbela también como certificado bancario en los documentos legales.'
      >
        <div className='alert alert-info'>
          El medio de pago registrado debe pertenecer al comprador o estar previamente
          autorizado por Suminia.
        </div>
        <div className='form-grid'>
          <div>
            <label className='form-label' htmlFor='pago-banco'>
              Banco
            </label>
            <input
              id='pago-banco'
              type='text'
              className='form-control'
              placeholder='Bancolombia'
              value={values.bankName}
              onChange={(event) => onChange({ bankName: event.target.value })}
            />
          </div>
          <div>
            <label className='form-label' htmlFor='pago-cuenta'>
              Número de cuenta
            </label>
            <input
              id='pago-cuenta'
              type='text'
              inputMode='numeric'
              className='form-control'
              value={values.bankAccountNumber}
              onChange={(event) => onChange({ bankAccountNumber: event.target.value })}
            />
          </div>
          {errors.bankAccountNumber && (
            <small className='text-danger form-grid-full'>{errors.bankAccountNumber}</small>
          )}
        </div>
      </Panel>
    </>
  );
};

/* Lo que exige el backend antes de guardar: naturaleza y actividad juntas, el
   sector de una IPS, el detalle de "otra", y banco y cuenta juntos. Vacio el
   perfil entero tambien vale: se puede guardar lo demas y volver despues. */
export const validateBuyerProfile = (values: BuyerProfileValues): BuyerProfileErrors => {
  const errors: BuyerProfileErrors = {};
  const tocado = values.legalNature || values.buyerActivity;

  if (tocado) {
    if (!values.legalNature) errors.legalNature = 'Elige la naturaleza de tu organización.';
    if (!values.buyerActivity) errors.buyerActivity = 'Elige la actividad.';
    if (values.buyerActivity === 'IPS' && !values.ipsSector) {
      errors.ipsSector = 'Indica si es pública, mixta o privada.';
    }
    if (values.buyerActivity === 'OTHER' && !values.activityOther.trim()) {
      errors.activityOther = 'Describe la actividad.';
    }
  }

  if (!values.bankName.trim() !== !values.bankAccountNumber.trim()) {
    errors.bankAccountNumber = 'Indica el banco y el número de cuenta juntos.';
  }

  return errors;
};

export default BuyerProfileFields;
