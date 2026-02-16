/**
 * PRODUCT SLICE (Redux Toolkit)
 *
 * Bu dosya, ürün listesiyle ilgili tüm state'i yönetir.
 * Async işlemler (API isteği) için createAsyncThunk kullanılır.
 *
 * Slice = state + actions + reducer + async operations tek pakette
 */

// Redux Toolkit fonksiyonlarını import et
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
// createSlice: Redux slice oluşturur
// createAsyncThunk: Async işlemler için (API çağrıları vs.)
// PayloadAction: Aksiyon veri tipi

import { Product, ProductResponse } from '@/types';      // Tip tanımları
import { fetchProducts } from '@/api/productService';   // API fonksiyonu

/**
 * ═══════════════════════════════════════════════════════════════
 * 1. STATE ŞABLONu (TypeScript Interface)
 * ═══════════════════════════════════════════════════════════════
 *
 * Redux state'te store.products şöyle görünecek:
 * {
 *   items: [...100 ürün],
 *   total: 194,          (toplam ürün sayısı)
 *   loading: false,      (yükleniyor mu?)
 *   error: null          (hata var mı?)
 * }
 */
interface ProductState {
    // Ürünlerin listesi
    items: Product[];

    // Veritabanındaki toplam ürün sayısı
    // Sayfalama yaparken kaç sayfada olduğunu hesaplamak için kullanılır
    total: number;

    // API isteği yapılıyor mu?
    // loading: true → Ürünleri yükleniyorum, spinner göster
    // loading: false → Ürünler yüklendi, göster
    loading: boolean;

    // API isteği sırasında hata oluştu mu?
    // error: null → Hata yok
    // error: "Network error" → Hata var, mesajı göster
    error: string | null;
}

/**
 * ═══════════════════════════════════════════════════════════════
 * 2. İLK STATE (BAŞLANGIÇ DEĞERLERİ)
 * ═══════════════════════════════════════════════════════════════
 */
const initialState: ProductState = {
    // Başlangıçta ürün yok
    items: [],

    // Toplam 0 ürün
    total: 0,

    // Başlangıçta yükleme durumunda
    loading: true,

    // Başlangıçta hata yok
    error: null,
};

/**
 * ═══════════════════════════════════════════════════════════════
 * 3. ASYNC THUNK: Asenkron API İsteği
 * ═══════════════════════════════════════════════════════════════
 *
 * createAsyncThunk ne yapıyor?
 * → API isteği başlatıldığında (.pending) loading=true yap
 * → İstek başarılı olduğunda (.fulfilled) veriyi state'e kaydet
 * → İstek başarısız olduğunda (.rejected) hata mesajını kaydet
 *
 * Bu otomatik olarak 3 state oluşturur:
 * 1. fetchProductsAsync.pending - isteği başlatırken
 * 2. fetchProductsAsync.fulfilled - istek başarılıyken
 * 3. fetchProductsAsync.rejected - istek başarısızken
 */
export const fetchProductsAsync = createAsyncThunk(
    // Action type adı (Redux devtools'da görünecek)
    // 'products/fetchAll' → Ürünleri getir aksionu
    'products/fetchAll',

    // Async fonksiyon
    // Parametreler: limit, skip, search
    async ({ limit, skip, search }: { limit: number; skip: number; search?: string }) => {
        // API'den ürünleri çek
        // search yoksa boş string gönder
        return await fetchProducts(limit, skip, search || '');
        // Dönen veri: ProductResponse { products: [...], total: 194, skip: 0, limit: 20 }
    }
);

/**
 * ═══════════════════════════════════════════════════════════════
 * 4. REDUX SLICE OLUŞTURMA
 * ═══════════════════════════════════════════════════════════════
 */
const productSlice = createSlice({
    // Slice adı
    name: 'products',

    initialState,

    /**
     * REDUCER'LAR: Senkron state değişiklikleri
     * Bu reducer'lar doğrudan dispatch() ile çağrılır
     */
    reducers: {
        /**
         * setProducts: Manuel olarak ürünleri ayarlama
         *
         * Kullanım örneği:
         *   dispatch(setProducts(productResponse))
         *
         * Ne yapıyor?
         *   - items'ı action.payload.products ile değiştir
         *   - total'ı action.payload.total ile değiştir
         */
        setProducts(state, action: PayloadAction<ProductResponse>) {
            // ProductResponse: { products: [...], total: 194, skip: 0, limit: 20 }
            state.items = action.payload.products;   // Ürünleri kaydet
            state.total = action.payload.total;      // Toplam sayısını kaydet
        },
    },

    /**
     * EXTRA REDUCER'LAR: Async thunk'lar için state değişiklikleri
     * fetchProductsAsync'in 3 durumu (pending, fulfilled, rejected) burada yönetilir
     */
    extraReducers: (builder) => {
        builder
            /**
             * DURUM 1: fetchProductsAsync.pending
             * İstek henüz başladı, API'ye bekleniyor
             *
             * Ne yap?
             * - loading = true (spinner göster)
             * - error = null (önceki hatayı temizle)
             */
            .addCase(fetchProductsAsync.pending, (state) => {
                state.loading = true;    // "Yükleniyor..." göster
                state.error = null;      // Hatayı temizle
            })

            /**
             * DURUM 2: fetchProductsAsync.fulfilled
             * API isteği başarılı oldu, veri geri geldi
             *
             * Ne yap?
             * - items = gelen ürünler
             * - total = toplam ürün sayısı
             * - loading = false (spinner gizle)
             */
            .addCase(fetchProductsAsync.fulfilled, (state, action) => {
                // action.payload = ProductResponse
                state.items = action.payload.products;   // Ürünleri kaydet
                state.total = action.payload.total;      // Toplam sayısını kaydet
                state.loading = false;                   // Spinner'ı gizle
            })

            /**
             * DURUM 3: fetchProductsAsync.rejected
             * API isteği başarısız oldu, hata oluştu
             *
             * Ne yap?
             * - loading = false (spinner gizle)
             * - error = hata mesajını kaydet (kullanıcıya göster)
             */
            .addCase(fetchProductsAsync.rejected, (state, action) => {
                state.loading = false;                                          // Spinner'ı gizle
                state.error = action.error.message || 'An error occurred';           // Hata mesajını kaydet
                // Eğer error.message yoksa, genel "Hata oluştu" yazısı göster
            });
    },
});

/**
 * ═══════════════════════════════════════════════════════════════
 * 5. ACTION VE REDUCER EXPORT'U
 * ═══════════════════════════════════════════════════════════════
 */

// Action creator'ını export et
// Bileşenlerde kullanabilmek için
//   dispatch(setProducts(data))
export const { setProducts } = productSlice.actions;

// Reducer'ı export et
// store.ts'de kullanıldı: reducer: { products: productSlice.reducer }
export default productSlice.reducer;
