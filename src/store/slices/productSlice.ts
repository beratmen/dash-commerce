import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Product, ProductResponse } from '@/types';
import { fetchProducts } from '@/api/productService';

interface ProductState {
    items: Product[];
    total: number;
    loading: boolean;
    error: string | null;
}

const initialState: ProductState = {
    items: [],
    total: 0,
    loading: false,
    error: null,
};

export const fetchProductsAsync = createAsyncThunk(
    'products/fetchAll',
    async ({ limit, skip, search }: { limit: number; skip: number; search?: string }) => {
        return await fetchProducts(limit, skip, search || '');
    }
);

const productSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {
        setProducts(state, action: PayloadAction<ProductResponse>) {
            state.items = action.payload.products;
            state.total = action.payload.total;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProductsAsync.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProductsAsync.fulfilled, (state, action) => {
                state.items = action.payload.products;
                state.total = action.payload.total;
                state.loading = false;
            })
            .addCase(fetchProductsAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Hata oluştu';
            });
    },
});

export const { setProducts } = productSlice.actions;
export default productSlice.reducer;
