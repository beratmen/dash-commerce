import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Product, ProductResponse } from '@/types';
import { fetchProducts, fetchProductById } from '@/api/productService';

interface ProductState {
    items: Product[];
    selectedProduct: Product | null; // [YENİ] Seçili ürün
    total: number;
    loading: boolean;
    error: string | null;
}

const initialState: ProductState = {
    items: [],
    selectedProduct: null, // [YENİ]
    total: 0,
    loading: false,
    error: null,
};

// Ürün çekme (Liste)
export const fetchProductsAsync = createAsyncThunk(
    'products/fetchAll',
    async ({ limit, skip, search }: { limit: number; skip: number; search?: string }) => {
        return await fetchProducts(limit, skip, search || '');
    }
);

// Tekil ürün çekme (Detay) [YENİ]
export const fetchProductByIdAsync = createAsyncThunk(
    'products/fetchOne',
    async (id: string) => {
        return await fetchProductById(id);
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
        // SSR'dan gelen tekil veriyi client'a yüklemek için [YENİ]
        setSelectedProduct(state, action: PayloadAction<Product>) {
            state.selectedProduct = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            // Liste
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
            })
            // Detay [YENİ]
            .addCase(fetchProductByIdAsync.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProductByIdAsync.fulfilled, (state, action) => {
                state.selectedProduct = action.payload;
                state.loading = false;
            })
            .addCase(fetchProductByIdAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Ürün detayı alınamadı';
            });
    },
});

export const { setProducts, setSelectedProduct } = productSlice.actions;
export default productSlice.reducer;