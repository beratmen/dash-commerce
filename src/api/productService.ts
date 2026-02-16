// API'den dönecek verinin yapısı types ile belirtilir; response.data editörde bilinir.
import axiosInstance from '@/api/axios';
import { ProductResponse, Product } from '@/types';

/* Bu dosya API işlemleri için fonksiyonlar sağlıyor 
ürünleri çekmek, arama yapmak, detay almak için. */

/**
 * Ürünleri getirir. limit/skip ile sayfalama, search ile arama.
 */
export const fetchProducts = async (
    limit: number = 20, // limit ile 20 ürün getir
    skip: number = 0,   // başından başla 
    search: string = '' // string olarak arama yapar boş bir parametre almış
): Promise<ProductResponse> => {
    try {
        const url = search
            ? `/products/search?q=${search}&limit=${limit}&skip=${skip}`
            : `/products?limit=${limit}&skip=${skip}&delay=3000`;
        const response = await axiosInstance.get<ProductResponse>(url); //URL GET isteği gönder
        return response.data;   //API den gelen veri
    } catch (error) {
        console.error('Error fetching products:', error);
        throw error;    //hatayı ata, başka yerde kullan
    }
};

// Tekil ürün detayı getirme
export const fetchProductById = async (id: string): Promise<Product> => {
    const response = await axiosInstance.get<Product>(`/products/${id}`); //Backtick içinde değişken
    return response.data;
};

/*
productService.ts gibi dosyalarda spesifik uç noktalar (endpoints) tanımlı.
Bu sayede API değişikliklerini tek bir noktadan yönetebiliyoruz.
*/