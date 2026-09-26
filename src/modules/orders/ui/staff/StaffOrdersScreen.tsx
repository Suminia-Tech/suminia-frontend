'use client';

import OrdersListScreen from '../common/OrdersListScreen';

/* Todos los pedidos de la plataforma, para el personal de Suminia.

   El alcance no se pide: el backend devuelve todos cuando quien consulta no
   pertenece a ninguna empresa. Aqui no se decide quien ve que. */
export const StaffOrdersScreen = () => <OrdersListScreen side='staff' />;

export default StaffOrdersScreen;
