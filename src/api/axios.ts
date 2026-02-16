import axios from 'axios';

// Projenin genel API ayarları (baseURL, timeout vb.) bu örnek üzerinden yapılır.
//axiosInstance yapılandırılmış bir axios nesnesi - ayarları tanımlanmış HTTP istek aracısı.
const axiosInstance = axios.create({    //Axios'un konfigüre edilmiş versiyonunu oluştur
    baseURL: 'https://dummyjson.com',
    timeout: 5000, // 5sn içinde cevap gelmezse istek sonlanır
    headers: { 'Content-Type': 'application/json' },    //İstek Başlıkları JSON Formatı
});

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response){
            const status = error.response.status;

            if (status === 500){
                window.location.href = '/error'
            }
        }
        return Promise.reject(error)
    }
);

export default axiosInstance;


/*
API servislerini burada topladım. axios.ts içerisinde temel konfigürasyon (baseURL, headers) yer alır.
*/