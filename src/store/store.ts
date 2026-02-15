import { configureStore } from '@reduxjs/toolkit';
import productReducer from './slices/productSlice';
import uiReducer from './slices/uiSlice';
import cartReducer from './slices/cartSlice';

const CART_STORAGE_KEY = 'dash-commerce-cart';

const cartPersistMiddleware =
    (store: { getState: () => { cart: { items: unknown[] } }; dispatch: unknown }) =>
    (next: (a: unknown) => unknown) =>
    (action: unknown) => {
        const result = next(action);
        const a = action as { type?: string };
        if (a?.type?.startsWith('cart/')) {
            try {
                const items = store.getState().cart.items;
                if (typeof window !== 'undefined') {
                    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
                }
            } catch {
                // ignore
            }
        }
        return result;
    };

export const makeStore = () => {
    return configureStore({
        reducer: {
            products: productReducer,
            ui: uiReducer,
            cart: cartReducer,
        },
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware().concat(cartPersistMiddleware),
    });
};

export type AppStore = ReturnType<typeof makeStore>;

export type RootState = ReturnType<AppStore['getState']>;

export type AppDispatch = AppStore['dispatch'];
