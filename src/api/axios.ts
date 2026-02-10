import axios from 'axios'; // node_modules kütüphanesinden axios dosyası tanımlandı 

const axsiosInstance = axios.create({ // bir kutu içine bu ayarlar eklendi
    baseURL: 'https://dummyjson.com',
    timeout: 1500, // 15sn içinde cevap gelmezse istek sonlanır
    headers:{
        'Content-Type': 'application/json',
        //dilde konuştuğumuzu söylememiz gerekir. JSON paketidir, ona göre oku.
    },
});

export default axsiosInstance;