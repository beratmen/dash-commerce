import { useDispatch, useSelector } from 'react-redux';    //burda hooklar eklendi
import type { TypedUseSelectorHook } from 'react-redux';    //Tipleştirilmiş selector oluşturma tipi
import type { RootState, AppDispatch } from './store';

// 1. useAppDispatch - Tipleştirilmiş useDispatch (aksiyon tetiklerken tip kontrolü).
export const useAppDispatch: () => AppDispatch = useDispatch;

// 2. useAppSelector - RootState ile güçlendirilmiş useSelector (autocomplete için).
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

//useAppDispatch: Type-safe, hatalı aksiyon veremezsin
//useAppSelector: Autocomplete, yanlış alan erişimi engellenir

//hooks.ts ile useSelector ve useDispatch'i tip güvenli (type-safe) hale getirdim.