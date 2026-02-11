// 'axiosInstance' projenin genel API ayarlarının (baseURL, timeout vb.) 
// yapıldığı özelleştirilmiş axios örneğidir.
import axiosInstance from '@/api/axios';

// API'den dönecek verinin yapısını (şemasını) belirten TypeScript tipi.
// Bu sayede 'response.data' içinde hangi alanların olduğunu editörümüz bilir.
import { ProductResponse } from '@/types';

/**
 * Ürünleri getirmek için kullanılan asenkron fonksiyon.
 * @param limit - Sayfa başına kaç ürün çekilecek? (Varsayılan: 20)
 * @param skip - Kaçıncı üründen başlanacak? (Sayfalama/Pagination için kullanılır, Varsayılan: 0)
 * @returns Promise<ProductResponse> - API'den gelen ürün verilerini döndürür.
 */
export const fetchProducts = async (limit: number = 20, skip: number = 0): Promise<ProductResponse> => {
    try {
        // GET isteği atılır. 
        // Generics kullanılarak <ProductResponse> ile gelen verinin tipi tanımlanır.
        // Query params (?limit=20&skip=0) URL'e eklenerek sunucuya gönderilir.
        const response = await axiosInstance.get<ProductResponse>(`/products?limit=${limit}&skip=${skip}`);

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