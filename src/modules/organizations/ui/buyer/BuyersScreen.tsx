'use client';

import OrganizationsScreen from '../common/OrganizationsScreen';

/* Hasta ahora no habia forma de revisar un comprador: el listado del admin solo
   consultaba /suppliers, que fija type = SUPPLIER, de modo que una empresa
   compradora registrada no aparecia en ningun sitio y se quedaba pendiente para
   siempre. */
export const BuyersScreen = () => <OrganizationsScreen kind='buyer' />;

export default BuyersScreen;
