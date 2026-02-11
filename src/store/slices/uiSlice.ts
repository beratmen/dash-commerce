import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// 1. HAFIZA ŞABLONU (Interface)
// Bu kısım, UI hafızasında nelerin saklanacağını "kural" olarak belirler.
interface UiState {
    currentPage: number;       // Şu an kaçıncı sayfadayız?
    itemsPerPage: number;      // Bir sayfada kaç ürün gösterilecek?
}

// 2. BAŞLANGIÇ DURUMU (initialState)
// Uygulama ilk açıldığında bu değerler ne olsun?
const initialState: UiState = {
    currentPage: 1,            // 1. sayfadan başlansın
    itemsPerPage: 20,          // Sayfa başına 20 ürün gelsin
};

// 3. SLICE (Dilim) OLUŞTURMA
// Burası hem veriyi (state) hem de o veriyi değiştirecek fonksiyonları (reducers) tek paket yapar.
const uiSlice = createSlice({
    name: 'ui',                // Bu hafıza diliminin Redux içindeki adı
    initialState,              // Yukarıda tanımladığımız başlangıç değerlerini buraya veriyoruz

    // REDUCERS: Hafızayı değiştiren "Akıllı Fonksiyonlar"
    reducers: {

        // Sayfa numarası değiştiğinde çalışır (Örn: 2. sayfaya basıldığında)
        setPage(state, action: PayloadAction<number>) {
            state.currentPage = action.payload; // Gelen sayfa numarasını hafızada güncelle
        },
    },
});

// 4. DIŞA AKTARMA (Exports)

// Fonksiyonları (Actions) ihraç ediyoruz ki bileşenlerden (components) çağırabilelim.
// Örn: dispatch(setPage(2)) diyerek sayfayı değiştirebileceğiz.
export const { setPage } = uiSlice.actions;

// Reducer'ı ihraç ediyoruz ki ana store.ts dosyasına kaydedebilelim.
export default uiSlice.reducer;