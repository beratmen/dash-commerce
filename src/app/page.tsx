'use client'; // Yönlendirme tarayıcıda yapıldığı için client component.

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
    const router = useRouter();

    // Bileşen mount olduğunda kullanıcıyı /products sayfasına gönderir.
    useEffect(() => {
        router.push('/products');
    }, [router]);

    // Yönlendirme yapılacağı için ekrana çizim yok.
    return null;
}
