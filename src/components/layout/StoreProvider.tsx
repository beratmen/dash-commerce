/**
 * STORE PROVIDER (Redux Sağlayıcı)
 *
 * Bu bileşen uygulamayı Redux store'u ile sarmalayarak, tüm alt bileşenlerin
 * Redux state'ine ve dispatch fonksiyonlarına erişmesini sağlar.
 *
 * Temel Görevler:
 * - Redux store'unu oluşturmak
 * - localStorage'dan kaydedilmiş sepet verilerini yüklemek
 * - Tüm uygulamayı Redux Provider ile kapsamak
 *
 * Neden "use client" lazım?
 * - useRef hook'u client tarafında çalışır
 * - Redux store'uu yaratırken React'ın client hooks'larını kullanırız
 * - Provider uygulamaya state management ekler
 */
'use client';  // Bu bileşen tarayıcıda (client-side) çalışmalıdır

import { useRef, useEffect } from 'react';  // React hooks: Ref ve Effect
import { Provider } from 'react-redux';  // Redux sağlayıcı: Tüm bileşenlere Redux erişimi sağlar
import { makeStore, AppStore } from '@/store/store';  // Store fabrikası ve tiplemesi
import { setCartItems, getInitialCartItems } from '@/store/slices/cartSlice';  // Sepet aksiyon'ları

/**
 * StoreProvider Bileşeni
 *
 * Bu bileşen tarafından sarmalanan tüm alt bileşenler Redux state'ine erişebilir.
 *
 * Render Sırası:
 * 1. useRef ile Redux store'u oluştur (sayfa reload olsa bile aynı store kalır)
 * 2. localStorage'dan önceki sepet verilerini (varsa) yükle
 * 3. Tüm uygulamayı Redux Provider ile kap
 */
export default function StoreProvider({ children }: { children: React.ReactNode }) {
    /**
     * useRef: Redux Store'u Tutacak Container
     *
     * Neden useRef kullanıyor?
     * - StoreProvider her render olduğunda yeniden create edilmiş olsun istemeyiz
     * - useRef: Sayfa reload olsa bile aynı store referansı kullanılır
     * - Normal variable: Sayfa reload'da yeniden oluşturulur (state kaybolur)
     *
     * Tip: AppStore | null
     * - null: İlk render'da henüz store yoktur
     * - AppStore: Redux store objesi
     */
    const storeRef = useRef<AppStore | null>(null);

    /**
     * STORE OLUŞTURMA VE LOCALSTORAGE YÜKLEME
     *
     * Bu if block'u sadece ilk render'da çalışır (storeRef.current henüz null ise)
     *
     * Adımlar:
     * 1. makeStore(): İlk kez Redux store'u oluştur
     * 2. typeof window !== 'undefined': Tarayıcıda mıyız? (Server-side rendering'de çalışmaz)
     * 3. getInitialCartItems(): localStorage'dan önceki sepet verilerini çek
     * 4. setCartItems(): Sepeti Redux state'e yükle
     */
    // eslint-disable-next-line react-hooks/refs
    if (!storeRef.current) {
        // STEP 1: Redux store'u fabrikadan oluştur
        storeRef.current = makeStore();
    }

    /**
     * LOCALSTORAGE YÜKLEME (useEffect)
     *
     * Bu efekt sadece bileşen tarayıcıya (client) mount olduktan sonra çalışır.
     * Bu sayede sunucu ve istemci arasındaki HTML uyuşmazlığı (hydration error) önlenir.
     */
    useEffect(() => {
        // getInitialCartItems(): localStorage'dan önceki sepet verilerini çek
        const items = getInitialCartItems();

        // Eğer localStorage'da sepet varsa, Redux state'e yükle
        if (items.length > 0 && storeRef.current) {
            storeRef.current.dispatch(setCartItems(items));
        }
    }, []);

    /**
     * RENDER: Redux Provider ile Sarmalama
     *
     * <Provider store={storeRef.current}>
     *   - Tüm alt bileşenleri Redux'a bağlar
     *   - useAppDispatch() ve useAppSelector() hook'ları kullanılabilir hale gelir
     *   - State değiştiğinde ilgili bileşenler re-render olur
     */
    // eslint-disable-next-line react-hooks/refs
    return <Provider store={storeRef.current!}>{children}</Provider>;
}

