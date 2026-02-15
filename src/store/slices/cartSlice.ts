import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CartItem } from '@/types';

const CART_STORAGE_KEY = 'dash-commerce-cart';

function loadCartFromStorage(): CartItem[] {
    if (typeof window === 'undefined') return [];
    try {
        const saved = localStorage.getItem(CART_STORAGE_KEY);
        return saved ? JSON.parse(saved) : [];
    } catch {
        return [];
    }
}

interface CartState {
    items: CartItem[];
}

export const getInitialCartItems = (): CartItem[] => loadCartFromStorage();

const initialState: CartState = {
    items: [],
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        setCartItems(_, action: PayloadAction<CartItem[]>) {
            return { items: action.payload };
        },
        addToCart(state, action: PayloadAction<CartItem>) {
            const { productId, quantity, title, price, thumbnail } = action.payload;
            const existing = state.items.find((i) => i.productId === productId);
            if (existing) {
                existing.quantity += quantity;
            } else {
                state.items.push({
                    productId,
                    quantity,
                    title,
                    price,
                    thumbnail,
                });
            }
        },
        removeFromCart(state, action: PayloadAction<number>) {
            state.items = state.items.filter((i) => i.productId !== action.payload);
        },
        updateQuantity(state, action: PayloadAction<{ productId: number; quantity: number }>) {
            const { productId, quantity } = action.payload;
            const item = state.items.find((i) => i.productId === productId);
            if (!item) return;
            if (quantity <= 0) {
                state.items = state.items.filter((i) => i.productId !== productId);
            } else {
                item.quantity = quantity;
            }
        },
        clearCart(state) {
            state.items = [];
        },
    },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart, setCartItems } = cartSlice.actions;

export const selectCartItems = (state: { cart: CartState }) => state.cart.items;
export const selectCartTotalQuantity = (state: { cart: CartState }) =>
    state.cart.items.reduce((sum, i) => sum + i.quantity, 0);
export const selectCartTotalPrice = (state: { cart: CartState }) =>
    state.cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0);

export default cartSlice.reducer;
