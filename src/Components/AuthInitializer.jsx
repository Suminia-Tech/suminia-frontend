'use client';

import { useAuthInitialize } from '@/hooks/useAuthInitialize';

export function AuthInitializer() {
	useAuthInitialize();
	return null;
}
