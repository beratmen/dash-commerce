'use client'; // Yönlendirme tarayıcıda yapıldığı için client component.

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
    const router = useRouter(); // Sayfalar arası yönlendirme yapar

    // Bileşen render olduğunda kullanıcıyı /products sayfasına gönderir.
    useEffect(() => {
        router.push('/products'); // Sayfalar arası yönlendirmeye yarar
    }, [router]); //Dependency: Sayfa yüklendiğinde 1 kez çalışır, router değişirse tekrar çalışır

    {/* Sayfa Yüklendiği zaman kullanıcı /products sayfasına yönlendirir */}

    // Yönlendirme yapılacağı için ekranda bir şey gösterilmesine gerek yok
    return null; 
}
