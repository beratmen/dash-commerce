import axios from 'axios';

// Projenin genel API ayarları (baseURL, timeout vb.) bu örnek üzerinden yapılır.
const axiosInstance = axios.create({
    baseURL: 'https://dummyjson.com',
    timeout: 1500, // 15sn içinde cevap gelmezse istek sonlanır
    headers: { 'Content-Type': 'application/json' },
});

export default axiosInstance;
