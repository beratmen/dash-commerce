import { useDispatch, useSelector, useStore } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch, AppStore } from './store';

// 1. useAppDispatch
// Standart useDispatch'in "tipleştirilmiş" versiyonu.
// Bileşenlerde bir aksiyon (action) tetiklerken veri tiplerinin doğruluğunu kontrol eder.
export const useAppDispatch: () => AppDispatch = useDispatch;

// 2. useAppSelector
// Standart useSelector'un projenize özel RootState ile güçlendirilmiş versiyonu.
// Hafızadan veri çekerken (state. ...) noktaya bastığınızda tüm state yapısını görmenizi sağlar.
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// 3. useAppStore
// Tüm Redux Store nesnesine doğrudan erişim gerektiğinde kullanılan tipleştirilmiş araç.
export const useAppStore: () => AppStore = useStore;


/**
 * NEDEN BU DOSYAYI KULLANIYORUZ?
 * 
 * Normal Redux hook'ları projenizin içindeki verilerin (ürünler, sepet vs.) yapısını bilmez.
 * Bu dosya sayesinde TypeScript'e projemizin hafıza yapısını (store) öğretiyoruz. 
 * Böylece kod yazarken otomatik tamamlama (autocomplete) çalışır ve hata yapma ihtimalimiz azalır.
 */