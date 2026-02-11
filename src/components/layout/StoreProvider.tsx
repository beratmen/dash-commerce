'use client'; // Bu bileşen kullanıcı tarafında (tarayıcıda) çalışmalıdır.

import { useRef } from 'react';
import { Provider } from 'react-redux';
import { makeStore, AppStore } from '@/store/store';

// 1. StoreProvider Bileşeni
// Uygulamayı saran ve tüm alt bileşenlerin Redux'a erişmesini sağlayan yapıdır.
export default function StoreProvider({
    children,
}: {
    children: React.ReactNode; // Bu Provider'ın içine girecek olan tüm HTML/Bileşenler
}) {
    // 2. useRef Kullanımı
    // Neden useRef? Sayfa her yenilendiğinde veya bileşen tekrar render olduğunda 
    // yeni bir Store (hafıza) oluşturulmasın, mevcut olan korunsun diye.
    const storeRef = useRef<AppStore | null>(null);

    // 3. Store Oluşturma
    // Eğer store henüz oluşturulmadıysa (ilk açılış), makeStore() fonksiyonunu çağırıp 
    // hafızayı belleğe (storeRef.current) alıyoruz.
    if (!storeRef.current) {
        storeRef.current = makeStore();
    }

    // 4. Provider ile Sarmalama
    // Redux'un kendi Provider bileşenini kullanarak, oluşturduğumuz store'u 
    // tüm uygulamaya (children) dağıtıyoruz.
    return <Provider store={storeRef.current}>{children}</Provider>;
}