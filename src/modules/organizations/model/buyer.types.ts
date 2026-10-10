import type {
  BuyerActivity,
  IpsSector,
  LegalNature,
  Organization,
} from './organization.types';

/* Un comprador es una Organization con type = BUYER. El backend lo expone como
   dominio propio en /buyers, de modo que aqui se le da nombre propio aunque hoy
   comparta forma con Organization: cuando el modulo sume campos suyos —credito,
   condiciones de pago— se agregan aqui sin tocar el tipo comun. */
export type Buyer = Organization;

/* taxId y legalName no viajan: identifican legalmente a la empresa y el DTO del
   backend corre con forbidNonWhitelisted, de modo que enviarlos da 422. */
export interface UpdateBuyerRequest {
  name?: string;
  email?: string;
  phone?: string | null;
  address?: string | null;
  city?: string | null;
  /* El perfil viaja entero: naturaleza y actividad juntas, y el sector o el
     detalle cuando aplican. */
  legalNature?: LegalNature | null;
  buyerActivity?: BuyerActivity | null;
  ipsSector?: IpsSector | null;
  activityOther?: string | null;
  /* La cuenta con la que paga: banco y numero juntos. */
  bankName?: string | null;
  bankAccountNumber?: string | null;
}
