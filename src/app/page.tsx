'use client'; // Bu bileşen tarayıcı tarafında çalışmalı çünkü yönlendirme işlemi tarayıcıda (Client-side) yapılır.

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
    const router = useRouter(); // Next.js'in yönlendirme aracını (router) çağırıyoruz.

    useEffect(() => {
        // Bileşen ekrana ilk geldiği (mount olduğu) anda çalışır:
        // Kullanıcıyı otomatik olarak '/products' sayfasına gönderir.
        router.push('/products');
    }, [router]);

    // Sayfa başka bir yere yönlendirileceği için ekrana bir şey çizmemize gerek yok.
    // Bu yüzden 'null' (boş) dönüyoruz.
    return null;
}