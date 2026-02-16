/**
 * CART SLICE (Redux Toolkit)
 *
 * Bu dosya, alışveriş sepetiyle ilgili tüm state'i yönetir.
 * Sepeti localStorage'a otomatik kaydetmek için helper fonksiyonlar var.
 *
 * NOT: store.ts'deki cartPersistMiddleware, bu slice'daki
 * aksiyon tetiklendiğinde auto matik olarak localStorage'a kaydeder
 */

// Redux Toolkit fonksiyonlarını import et
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
// createSlice: Redux slice oluşturur
// PayloadAction: Aksiyon veri tipi

import { CartItem } from '@/types';  // Sepet öğesi tip tanımı

/**
 * ═══════════════════════════════════════════════════════════════
 * HELPERS: localStorage İşlemleri
 * ═══════════════════════════════════════════════════════════════
 */

// localStorage'da sepeti kaydetmek için anahtar
const CART_STORAGE_KEY = 'dash-commerce-cart';

/**
 * localStorage'dan sepeti okuma fonksiyonu
 *
 * Sayfa yenilendiğinde sepet kaybedilmesin diye,
 * localStorage'dan sepeti geri yükler
 */
function loadCartFromStorage(): CartItem[] {
    // Server ortamında window yok, hata olmasın diye kontrol et
    if (typeof window === 'undefined') return [];

    try {
        // localStorage'dan kayıtlı sepeti al
        const saved = localStorage.getItem(CART_STORAGE_KEY);

        // Eğer kayıtlı sepet varsa, JSON'dan nesneye çevir
        // Yoksa boş dizi döndür
        return saved ? JSON.parse(saved) : [];
    } catch {
        // Hata olursa (localStorage dolu, izin yok vs.) boş liste döndür
        return [];
    }
}

/**
 * ═══════════════════════════════════════════════════════════════
 * 1. STATE ŞABLONu (TypeScript Interface)
 * ═══════════════════════════════════════════════════════════════
 *
 * Redux state'te store.cart şöyle görünecek:
 * {
 *   items: [
 *     { productId: 1, quantity: 2, title: "iPhone", price: 999, ... },
 *     { productId: 5, quantity: 1, title: "Samsung", price: 799, ... }
 *   ]
 * }
 */
interface CartState {
    // Sepe tek öğeler (ürünler)
    items: CartItem[];
}

/**
 * ═══════════════════════════════════════════════════════════════
 * 2. İLK STATE (BAŞLANGIÇ DEĞERLERİ)
 * ═══════════════════════════════════════════════════════════════
 */
export const getInitialCartItems = (): CartItem[] => loadCartFromStorage();

const initialState: CartState = {
    // Başlangıçta sepet boş
    items: [],
};

/**
 * ═══════════════════════════════════════════════════════════════
 * 3. REDUX SLICE OLUŞTURMA
 * ═══════════════════════════════════════════════════════════════
 */
const cartSlice = createSlice({
    // Slice adı
    name: 'cart',

    initialState,

    /**
     * REDUCER'LAR: Sepet işlemleri
     * Her reducer bir aksiyon tetiklendiğinde çalışır
     * (Her aksiyon tetiklenince store.ts'deki middleware da devrede girer ve localStorage'a kaydeder)
     */
    reducers: {
        /**
         * setCartItems: Tüm sepeti değiştir
         *
         * Kullanım örneği:
         *   dispatch(setCartItems([...]))   // Tüm sepeti yeni öğelerle değiştir
         *
         * Neden gerekli?
         *   - localStorage'dan yüklenen sepeti Redux'a yükledikten sonra
         */
        setCartItems(_, action: PayloadAction<CartItem[]>) {
            // Tamamını değiştir (payload ile gelen yeni listeyi kullan)
            return { items: action.payload };
        },

        /**
         * addToCart: Sepete ürün ekleme veya miktarı artırma
         *
         * Kullanım örneği:
         *   dispatch(addToCart({ productId: 5, quantity: 2, title: "iPhone", ... }))
         *
         * Ne yapıyor?
         *   - Aynı ürün varsa: miktarını artır
         *   - Aynı ürün yoksa: yeni ürün ekle
         */
        addToCart(state, action: PayloadAction<CartItem>) {
            // Gelen sepet öğesini destructure edilir
            const { productId, quantity, title, price, thumbnail } = action.payload;

            // Sepette aynı ürün var mı bak
            const existing = state.items.find((i) => i.productId === productId);

            if (existing) {
                // Varsa: miktarını artır
                // Örneğin: 2 tane iPhone var, 3 tane daha eklenmek isteniyor
                //   existing.quantity = 2 + 3 = 5
                existing.quantity += quantity;
            } else {
                // Yoksa: yeni ürün olarak sepete ekle
                state.items.push({
                    productId,
                    quantity,
                    title,
                    price,
                    thumbnail,
                });
            }
        },

        /**
         * removeFromCart: Sepetten ürün silme
         *
         * Kullanım örneği:
         *   dispatch(removeFromCart(5))   // Ürün ID'si 5'i tekamesinden sil
         *
         * Ne yapıyor?
         *   - Verilen productId'ye sahip ürünü sepetten kaldırır
         */
        removeFromCart(state, action: PayloadAction<number>) {
            // action.payload = productId
            // Sepetten verilen ID'ye sahip öğeyi filtrele (başka olanları tut)
            state.items = state.items.filter((i) => i.productId !== action.payload);
        },

        /**
         * updateQuantity: Sepetteki ürünün miktarını değiştir
         *
         * Kullanım örneği:
         *   dispatch(updateQuantity({ productId: 5, quantity: 3 }))   // 3 tane
         *   dispatch(updateQuantity({ productId: 5, quantity: 0 }))   // Sil
         *
         * Ne yapıyor?
         *   - Quantity 0 veya altında ise: ürünü sepetten sil
         *   - Quantity > 0 ise: ürünün miktarını güncelle
         */
        updateQuantity(state, action: PayloadAction<{ productId: number; quantity: number }>) {
            const { productId, quantity } = action.payload;

            // Sepette bu ID'ye sahip ürünü bul
            const item = state.items.find((i) => i.productId === productId);

            // Eğer ürün yoksa, işlem yapma
            if (!item) return;

            // Quantity 0 veya altında ise, ürünü sepetten sil
            if (quantity <= 0) {
                state.items = state.items.filter((i) => i.productId !== productId);
            } else {
                // Quantity > 0 ise, yeni miktarı kaydet
                item.quantity = quantity;
            }
        },

        /**
         * clearCart: Sepeti tamamen boşalt
         *
         * Kullanım örneği:
         *   dispatch(clearCart())   // Tüm sepeti temizle
         *
         * Ne yapıyor?
         *   - Sepe tek tüm öğeleri siler
         *   - Ödeme başarılı olduğunda çağrılır
         */
        clearCart(state) {
            state.items = [];   // Sepeti boş yap
        },
    },
});

/**
 * ═══════════════════════════════════════════════════════════════
 * 4. ACTION'LAR VE REDUCER EXPORT'U
 * ═══════════════════════════════════════════════════════════════
 */

// Action creator'ları export et
// Bileşenlerde kullanılabilmek için
export const { addToCart, removeFromCart, updateQuantity, clearCart, setCartItems } = cartSlice.actions;

/**
 * ═══════════════════════════════════════════════════════════════
 * 5. SELECTOR'LAR: State'ten veri çıkarmak
 * ═══════════════════════════════════════════════════════════════
 *
 * Selector'lar, state'ten belirli verileri çıkarmak için kullanılır.
 * Bileşenlerde useAppSelector() ile beraber kullanılır.
 *
 * Kullanım örneği:
 *   const items = useAppSelector(selectCartItems);
 *   const total = useAppSelector(selectCartTotalPrice);
 */

// Sepetteki tüm ürünleri döndür
export const selectCartItems = (state: { cart: CartState }) => state.cart.items;

// Sepetteki toplam miktar (adet) hesapla
// Örneğin: 2 iPhone + 3 Samsung = 5 adet
export const selectCartTotalQuantity = (state: { cart: CartState }) =>
    state.cart.items.reduce((sum, i) => sum + i.quantity, 0);
    // reduce: Her ürünün quantity'sini topla

// Sepetteki toplam fiyat hesapla
// Örneğin: 2*999 + 3*799 = 4395
export const selectCartTotalPrice = (state: { cart: CartState }) =>
    state.cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    // reduce: Her ürünün (fiyat * miktar) toplamını hesapla

// Reducer'ı export et
// store.ts'de kullanıldı: reducer: { cart: cartSlice.reducer }
export default cartSlice.reducer;
