import { useDispatch, useSelector } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from './store';

// 1. useAppDispatch - Tipleştirilmiş useDispatch (aksiyon tetiklerken tip kontrolü).
export const useAppDispatch: () => AppDispatch = useDispatch;

// 2. useAppSelector - RootState ile güçlendirilmiş useSelector (autocomplete için).
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;