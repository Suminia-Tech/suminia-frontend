/* Contrato de las sedes de entrega con el backend.

   Viven en `organizations` y no en un modulo propio porque son de la empresa:
   las administra quien administra la empresa, con sus mismos permisos, y se
   editan desde su misma pantalla de cuenta. */

export interface DeliveryLocation {
  id: string;
  /** Como la llaman dentro de la empresa: "Sede Norte", "Bodega central". */
  name: string;
  address: string;
  city: string;
  department: string | null;
  /** Quien firma la entrega: el transportador llama a la puerta, no a la centralita. */
  contactName: string | null;
  contactPhone: string | null;
  receivingHours: string | null;
  /** Como entrar: porteria, muelle, piso. */
  notes: string | null;
  /** La que se propone al pedir. Una por empresa. */
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DeliveryLocationInput {
  name: string;
  address: string;
  city: string;
  department?: string | null;
  contactName?: string | null;
  contactPhone?: string | null;
  receivingHours?: string | null;
  notes?: string | null;
  isDefault?: boolean;
}

export interface UpdateDeliveryLocationRequest {
  id: string;
  data: Partial<DeliveryLocationInput>;
}
