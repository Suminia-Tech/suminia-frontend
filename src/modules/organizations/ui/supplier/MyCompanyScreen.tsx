'use client';

import MyCompanyScreen from '../common/MyCompanyScreen';

/* Los datos de la empresa y el estado de su solicitud son lo mismo a los dos
   lados del marketplace: cambia el endpoint, no la pantalla. */
export const SupplierCompanyScreen = () => <MyCompanyScreen kind='supplier' />;

export default SupplierCompanyScreen;
