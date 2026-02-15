import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// 1. HAFIZA ŞABLONU (Interface)
interface UiState {
    currentPage: number;       // Şu an kaçıncı sayfadayız?
    itemsPerPage: number;     // Bir sayfada kaç ürün gösterilecek?
    searchQuery: string;       // Arama sorgusu
}

// 2. BAŞLANGIÇ DURUMU
const initialState: UiState = {
    currentPage: 1,
    itemsPerPage: 20,
    searchQuery: '',
};

// 3. SLICE - state ve reducers tek pakette.
const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        // Sayfa numarası değiştiğinde (örn: 2. sayfaya basıldığında)
        setPage(state, action: PayloadAction<number>) {
            state.currentPage = action.payload;
        },
        setSearchQuery(state, action: PayloadAction<string>) {
            state.searchQuery = action.payload;
            state.currentPage = 1; // Arama yapıldığında 1. sayfaya dön
        },
    },
});

export const { setPage, setSearchQuery } = uiSlice.actions;
export default uiSlice.reducer;
