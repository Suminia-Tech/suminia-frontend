'use client';

import type { ReactNode } from 'react';
import { Provider } from 'react-redux';

import { AuthInitializer, LoginModal } from '@/modules/auth';
import { store } from '@/store';

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      <AuthInitializer />
      {children}
      <LoginModal />
    </Provider>
  );
}
