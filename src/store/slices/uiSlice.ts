/**
 * UI SLICE (Redux Toolkit)
 *
 * Bu dosya, UI ile ilgili tüm state'i (sayfalama, arama vs.) yönetir.
 * Redux Toolkit'in createSlice kullanılarak yazılmıştır.
 *
 * Slice = state + actions + reducer tek pakette
 */

// Redux Toolkit fonksiyonlarını import et
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
// createSlice: Redux slice oluşturur (state + reducer + actions)
// PayloadAction: Action'ün veri tipini tanımlar

/**
 * ═══════════════════════════════════════════════════════════════
 * 1. STATE ŞABLONu (TypeScript Interface)
 * ═══════════════════════════════════════════════════════════════
 *
 * Bu interface, UI state'in yapısını tanımlar.
 * Redux store'da state.ui şöyle görünecek:
 * {
 *   currentPage: 1,
 *   itemsPerPage: 20,
 *   searchQuery: ''
 * }
 */
interface UiState {
    // Kullanıcının şu an kaçıncı sayfada olduğu
    // Örneğin: currentPage: 1 = 1. sayfada, currentPage: 2 = 2. sayfada
    currentPage: number;

    // Bir sayfada kaç ürün gösterilecek?
    // Örneğin: itemsPerPage: 20 = Sayfada 20 ürün olacak
    itemsPerPage: number;

    // Kullanıcının arama kutusuna yazdığı metin
    // Örneğin: searchQuery: 'iphone' = iPhone araması
    searchQuery: string;
}

/**
 * ═══════════════════════════════════════════════════════════════
 * 2. İLK STATE (BAŞLANGIÇ DEĞERLERİ)
 * ═══════════════════════════════════════════════════════════════
 *
 * Uygulama açıldığında UI state'in hangi değerlerle başlayacağı
 */
const initialState: UiState = {
    // Başlangıçta 1. sayfada olacağız
    currentPage: 1,

    // Sayfada 20 ürün gösterilecek (fetchProducts(20, 0) ile eşleşir)
    itemsPerPage: 20,

    // Başlangıçta arama sorgusu boş olacak
    searchQuery: '',
};

/**
 * ═══════════════════════════════════════════════════════════════
 * 3. REDUX SLICE OLUŞTURMA
 * ═══════════════════════════════════════════════════════════════
 *
 * Slice = state + actions + reducer tek pakette
 * Redux Toolkit otomatik olarak action creator'ları ve reducer'ı oluşturur
 */
const uiSlice = createSlice({
    // Slice'ın adı (Redux devtools'da görünecek)
    // Aksiyonların type'ı: 'ui/setPage', 'ui/setSearchQuery' olacak
    name: 'ui',

    // Başlangıç state'i
    initialState,

    /**
     * REDUCER'LAR: State değişiklikleri yapan fonksiyonlar
     * Her reducer bir aksiyon tetiklendiğinde çalışır
     */
    reducers: {
        /**
         * REDUCER 1: setPage
         *
         * İşi: Kullanıcı başka sayfaya gittiğinde currentPage'i güncelleme
         *
         * Kullanım örneği:
         *   dispatch(setPage(2))  → 2. sayfaya git
         *   dispatch(setPage(5))  → 5. sayfaya git
         */
        setPage(state, action: PayloadAction<number>) {
            // state: Güncel UI state objesi
            // action: { type: 'ui/setPage', payload: 2 }
            // action.payload: Kullanıcının gitmek istediği sayfa (2, 5 vs.)

            // State'i doğrudan değiştirebilirim (Redux Toolkit bunu yönetir)
            state.currentPage = action.payload;
            // Artık state.currentPage = 2
        },

        /**
         * REDUCER 2: setSearchQuery
         *
         * İşi: Kullanıcı arama yaptığında
         *      1. Arama sorgusunu güncelleme
         *      2. 1. sayfaya dönüp yeni sonuçları gösterme
         *
         * Kullanım örneği:
         *   dispatch(setSearchQuery('iphone'))  → 'iphone' araması
         *   dispatch(setSearchQuery('samsung'))  → 'samsung' araması
         */
        setSearchQuery(state, action: PayloadAction<string>) {
            // action.payload: Kullanıcının yazdığı arama metni
            // Örneğin: action.payload = 'iphone'

            // 1. Arama sorgusunu güncelle
            state.searchQuery = action.payload;

            // 2. Yeni arama sonuçları 1. sayfada göstermek için
            //    sayfa numarasını 1'e ayarla
            //    (Yoksa 5. sayfada arama yapsak bile, sonuçlar 1. sayfada çıkacak)
            state.currentPage = 1;
        },
    },
});

/**
 * ═══════════════════════════════════════════════════════════════
 * 4. ACTION'LAR VE REDUCER EXPORT'U
 * ═══════════════════════════════════════════════════════════════
 */

// Action creator'ları export et
// Redux Toolkit otomatik olarak oluşturdu (reducer fonksiyonlarından)
//
// setPage, setSearchQuery bileşenlerde dispatch() ile kullanılacak:
//   dispatch(setPage(2))
//   dispatch(setSearchQuery('iphone'))
export const { setPage, setSearchQuery } = uiSlice.actions;

// Reducer'ı export et
// store.ts'de kullanıldı: reducer: { ui: uiSlice.reducer }
export default uiSlice.reducer;
