'use client';

import type { ReactNode } from 'react';
import { Button } from 'reactstrap';

/* Sustituye al <Btn attrBtn={{...}}> de la plantilla en los formularios
   propios. Recibe props normales en vez de un objeto anidado, y muestra el
   texto de carga sin que cada formulario repita el ternario. */

interface SubmitButtonProps {
  isLoading?: boolean;
  loadingLabel?: string;
  disabled?: boolean;
  className?: string;
  children: ReactNode;
}

const SubmitButton = ({
  isLoading = false,
  loadingLabel,
  disabled = false,
  className,
  children,
}: SubmitButtonProps) => (
  <Button type='submit' className={className} disabled={disabled || isLoading}>
    <span>{isLoading && loadingLabel ? loadingLabel : children}</span>
    <i className='fa fa-check'></i>
  </Button>
);

export default SubmitButton;
