// 'axiosInstance' projenin genel API ayarlarının (baseURL, timeout vb.) 
// yapıldığı özelleştirilmiş axios örneğidir.
import axiosInstance from '@/api/axios';

// API'den dönecek verinin yapısını (şemasını) belirten TypeScript tipi.
// Bu sayede 'response.data' içinde hangi alanların olduğunu editörümüz bilir.
import { ProductResponse, Product } from '@/types';

/**
 * Ürünleri getirmek için kullanılan asenkron fonksiyon.
 * @param limit - Sayfa başına kaç ürün çekilecek? (Varsayılan: 20)
 * @param skip - Kaçıncı üründen başlanacak? (Sayfalama/Pagination için kullanılır, Varsayılan: 0)
 * @returns Promise<ProductResponse> - API'den gelen ürün verilerini döndürür.
 */
export const fetchProducts = async (limit: number = 20, skip: number = 0, search: string = ''): Promise<ProductResponse> => {
    try {
        let url = `/products?limit=${limit}&skip=${skip}`;

        if (search) {
            url = `/products/search?q=${search}&limit=${limit}&skip=${skip}`;
        }

        const response = await axiosInstance.get<ProductResponse>(url);

        // Axios'ta asıl veri her zaman 'data' objesinin içindedir.
        return response.data;
    } catch (error) {
        // Hata durumunda konsola bilgilendirme yazılır.
        console.error('Error fetching products:', error);

        // Hatayı yukarı fırlatıyoruz ki bu fonksiyonu çağıran UI (bileşen), 
        // hata durumunda kullanıcıya bir uyarı gösterebilsin.
        throw error;
    }
};

// Tekil ürün detayı getirme fonksiyonu
export const fetchProductById = async (id: string): Promise<Product> => {
    const response = await axiosInstance.get<Product>(`/products/${id}`);
    return response.data;
};