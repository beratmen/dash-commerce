// API'den dönecek verinin yapısı types ile belirtilir; response.data editörde bilinir.
import axiosInstance from '@/api/axios';
import { ProductResponse, Product } from '@/types';

/**
 * Ürünleri getirir. limit/skip ile sayfalama, search ile arama.
 */
export const fetchProducts = async (
    limit: number = 20,
    skip: number = 0,
    search: string = ''
): Promise<ProductResponse> => {
    try {
        const url = search
            ? `/products/search?q=${search}&limit=${limit}&skip=${skip}`
            : `/products?limit=${limit}&skip=${skip}`;
        const response = await axiosInstance.get<ProductResponse>(url);
        return response.data;
    } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
    }
};

// Tekil ürün detayı getirme
export const fetchProductById = async (id: string): Promise<Product> => {
    const response = await axiosInstance.get<Product>(`/products/${id}`);
    return response.data;
};
