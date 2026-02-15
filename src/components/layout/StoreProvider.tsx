'use client'; // Bu bileşen kullanıcı tarafında (tarayıcıda) çalışmalıdır.

import { useRef } from 'react';
import { Provider } from 'react-redux';
import { makeStore, AppStore } from '@/store/store';
import { setCartItems, getInitialCartItems } from '@/store/slices/cartSlice';

// 1. StoreProvider Bileşeni
// Uygulamayı saran ve tüm alt bileşenlerin Redux'a erişmesini sağlayan yapıdır.
export default function StoreProvider({ children }: { children: React.ReactNode }) {
    // 2. useRef Kullanımı - Sayfa her yenilendiğinde yeni Store oluşturulmasın diye.
    const storeRef = useRef<AppStore | null>(null);

    // 3. Store Oluşturma - İlk açılışta makeStore(), tarayıcıdaysa sepet localStorage'dan yüklenir.
    if (!storeRef.current) {
        storeRef.current = makeStore();
        if (typeof window !== 'undefined') {
            const items = getInitialCartItems();
            if (items.length > 0) {
                storeRef.current.dispatch(setCartItems(items));
            }
        }
    }

    // 4. Provider ile Sarmalama
    return <Provider store={storeRef.current}>{children}</Provider>;
}
