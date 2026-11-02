'use client';

import type { CompanySection } from '../../lib/companySections';
import MyCompanyScreen from '../common/MyCompanyScreen';

/* Los datos de la empresa y el estado de su solicitud son lo mismo a los dos
   lados del marketplace: cambia el endpoint, no la pantalla. */
export const SupplierCompanyScreen = ({ section }: { section: CompanySection }) => (
  <MyCompanyScreen kind='supplier' section={section} />
);

export default SupplierCompanyScreen;
