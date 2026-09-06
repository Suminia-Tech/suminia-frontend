import { useDispatch, useSelector } from 'react-redux';

import type { AppDispatch, RootState } from './index';

/* Versiones tipadas de los hooks de react-redux. Usar estas en el codigo nuevo
   evita anotar RootState en cada useSelector. */
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector = useSelector.withTypes<RootState>();
