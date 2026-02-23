/**
 * REDUX STORE KURULUMU
 * Bu dosya Redux Toolkit kullanarak global state yönetim merkezi oluşturuyor.
 * AppDispatch ve RootState tipleri TypeScript ile güvenli kullanım sağlıyor.
 */

// Redux Toolkit'ten store oluşturan fonksiyonu import et
import { configureStore } from '@reduxjs/toolkit';

// Her bir state slice'ının yönetim fonksiyonlarını (reducer'ları) import et
import productReducer from './slices/productSlice';  // Ürünler state: listeleme, filtreleme vs.
import uiReducer from './slices/uiSlice';            // UI state: tema, modal açık/kapalı vs.
import cartReducer from './slices/cartSlice';        // Sepet state: ürünler, toplam fiyat vs.
import favoriteReducer from './slices/favoriteSlice'; // Favoriler state: ürünler

/**
 * localStorage Anahtarı
 * Sepeti tarayıcı depolamasında (localStorage) kaydetmek için kullanılan anahtar
 * Sayfa yenilense de sepet kaybedilmesin diye
 */
const CART_STORAGE_KEY = 'dash-commerce-cart';

/**
 * CUSTOM MIDDLEWARE: Sepeti localStorage'a Otomatik Kaydet
 *
 * Middleware Nedir? = Aksiyon çalıştıktan sonra ekstra işlem yapmak
 * Burada: Sepet değişirse → otomatik localStorage'a kaydet
 */
const cartPersistMiddleware =
    // İlk parametre: store objesi (getState ve dispatch fonksiyonları)
    (store: { getState: () => { cart: { items: unknown[] } }; dispatch: unknown }) =>

    // İkinci parametre: next - sonraki middleware'i çağıran fonksiyon
    (next: (a: unknown) => unknown) =>

    // Üçüncü parametre: action - bileşenden gelen aksiyon
    (action: unknown) => {
        // 1. Aksiyon normal Redux flow'da işleniyor
        const result = next(action);

        // 2. Action'ın tipini kontrol edebilmek için type assertion yaparız
        const a = action as { type?: string };

        // 3. Eğer aksiyon sepet ile ilgili ise (type: 'cart/...' gibi)
        if (a?.type?.startsWith('cart/')) {
            try {
                // 4. Store'dan sepet öğelerini al
                const items = store.getState().cart.items;

                // 5. Server ortamında çalıştığımızda hata olmasın diye,
                //    window objesi var mı kontrol et (tarayıcımı server ortamı mı?)
                if (typeof window !== 'undefined') {
                    // 6. Sepet öğelerini JSON formatına çevir
                    //    JSON.stringify: Nesne → JSON string
                    // 7. localStorage'a kaydet
                    //    'dash-commerce-cart': [{"id":1,"quantity":2},...]
                    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
                }
            } catch {
                // Hata olursa sessizce geç (localStorage dolu, izin yok vs.)
            }
        }

        // 8. Middleware sonucunu döndür
        return result;
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const favPersistMiddleware: any = (store: any) => (next: any) => (action: any) => {
    const result = next(action);
    // Eğer tetiklenen action'ın adı favorites ile başlıyorsa...
    if (action?.type?.startsWith('favorites/')) {
        try {
            if (typeof window !== 'undefined') {
                const items = store.getState().favorites.items;
                // Değişim olduğu anda ez ve kaydet
                window.localStorage.setItem('dash-favorites', JSON.stringify(items));
            }
        } catch {}
    }
    return result;
};

/**
 * Redux Store Oluşturma Fonksiyonu
 * makeStore() çağrıldığında, tüm state ve reducer'ları birleştirilmiş
 * bir Redux store objesi döner
 */
export const makeStore = () => {
    // configureStore: Redux store yapısını oluştur
    return configureStore({
        // REDUCER'LAR: Her bir slice'ın state yönetim fonksiyonları
        // Anahtar: Global state'teki property adı
        // Değer: O kısım için state değişiklikleri yapan reducer
        reducer: {
            // products: Redux state'te store.products → productReducer tarafından yönetilir
            products: productReducer,

            // ui: Redux state'te store.ui → uiReducer tarafından yönetilir
            ui: uiReducer,

            // cart: Redux state'te store.cart → cartReducer tarafından yönetilir
            cart: cartReducer,

            favorites: favoriteReducer,
        },

        // MIDDLEWARE'LER: Aksiyon çalıştıktan sonra ek işlemler yapan fonksiyonlar
        middleware: (getDefaultMiddleware) =>
            // Redux'ın varsayılan middleware'lerini al (hata kontrol vs.)
            // .concat(): Kendi middleware'imizi (cartPersistMiddleware) ekle
            getDefaultMiddleware().concat(cartPersistMiddleware, favPersistMiddleware),
    });
};

/**
 * TİP TANIMLARI (TypeScript)
 * Bunlar, store objesi hakkında TypeScript'e bilgi verir
 * Böylece hatalı kullanımda editor uyarı verir
 */

// AppStore tipi: configureStore'dan dönen store objesi tipi
// typeof makeStore = makeStore fonksiyonunun tipi
// ReturnType = fonksiyon çalıştıktan sonra ne döner
// Sonuç: Store objesi
export type AppStore = ReturnType<typeof makeStore>;

// RootState tipi: store.getState() çağrıldığında ne gelir?
// AppStore['getState'] = Store'daki getState() fonksiyonu
// ReturnType = getState() çalıştıktan sonra ne döner
// Sonuç: Global state objesi
//   {
//     products: {...},
//     ui: {...},
//     cart: {...}
//   }
export type RootState = ReturnType<AppStore['getState']>;

// AppDispatch tipi: dispatch fonksiyonunun tipi
// AppStore['dispatch'] = Store'daki dispatch() fonksiyonu
// Sonuç: Aksiyon tetiklemek için gereken fonksiyon tipi
//   dispatch({ type: 'cart/addToCart', payload: {...} })
export type AppDispatch = AppStore['dispatch'];

