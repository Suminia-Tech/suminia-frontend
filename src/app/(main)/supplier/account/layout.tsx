'use client';

import type { ReactNode } from 'react';

/* La cuenta ya no lleva barra lateral propia: sus secciones estan en el panel
   del area, de modo que tener otra al lado seria navegar dos veces lo mismo. */
const AccountLayout = ({ children }: { children: ReactNode }) => <>{children}</>;

export default AccountLayout;
