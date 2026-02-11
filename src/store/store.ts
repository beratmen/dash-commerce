import { configureStore } from '@reduxjs/toolkit';
import productReducer from './slices/productSlice';
import uiReducer from './slices/uiSlice';

export const makeStore = () => {
    return configureStore({
        reducer: {
            products: productReducer,
            ui: uiReducer,
        },
    });
};

export type AppStore = ReturnType<typeof makeStore>;

export type RootState = ReturnType<AppStore['getState']>;

export type AppDispatch = AppStore['dispatch'];
