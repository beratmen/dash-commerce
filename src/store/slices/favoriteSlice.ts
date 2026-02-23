import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FavoriteItem } from '@/types';

// localStorage'dan okuma fonksiyonu (Başlangıçta sepet dolu mu bak)
const loadFavorites = (): FavoriteItem[] => {
    if (typeof window === 'undefined') return []; // Sadece browser'da çalışır
    const saved = localStorage.getItem('dash-favorites');
    return saved ? JSON.parse(saved) : [];
};

// Başlangıç State'i
const initialState = {
    items: loadFavorites(),
};

const favoriteSlice = createSlice({
    name: 'favorites',
    initialState,
    reducers: {
        // Hem tıkla ekle, hem tıkla çıkar (Toggle mantığı)
        toggleFavorite(state, action: PayloadAction<FavoriteItem>) {
            const product = action.payload;
            // Bu eleman içeride var mı? findIndex -1 dönerse yoktur.
            const existingIndex = state.items.findIndex(i => i.productId === product.productId);

            if (existingIndex >= 0) {
                // Varsa diziden at (Filtrelemeden bile kolay yol: splice ile kes)
                state.items.splice(existingIndex, 1);
            } else {
                // Yoksa dizinin en sonuna pusula
                state.items.push(product);
            }
        },
    },
});

export const { toggleFavorite } = favoriteSlice.actions;
// Bileşenlerde listeyi hızlıca çekmek için Selector
export const selectFavorites = (state: { favorites: { items: FavoriteItem[] } }) => state.favorites.items;
export default favoriteSlice.reducer;
