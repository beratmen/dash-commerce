import { fetchProducts } from '@/api/productService';
import ProductsView from '@/components/ProductsView';
import { Suspense } from 'react';
import { CircularProgress, Box } from '@mui/material';

// 1. ASYNC SERVER COMPONENT
// Bu fonksiyon bir 'Server Component'dır. Başına 'async' ekleyerek 
// doğrudan fonksiyon içinde 'await' ile veri çekmemize izin verir.
export default async function ProductsPage() {

    // 2. SSR FETCH (Sunucu Taraflı Veri Çekme)
    // Ürünler daha sayfa kullanıcıya gönderilmeden önce sunucuda çekilir.
    // Bu sayede:
    // - SEO performansı artar (Arama motorları ürünleri hemen görür).
    // - Kullanıcı sayfayı açtığında ilk 20 ürün anında ekrana gelir.
    const initialData = await fetchProducts(20, 0);

    return (
        // 3. SUSPENSE (Yükleme Durumu Yönetimi)
        // Eğer ProductsView içinde başka asenkron işlemler varsa veya 
        // sayfa yüklenirken bir gecikme olursa, 'fallback' kısmındaki kod çalışır.
        <Suspense fallback={
            // 4. LOADING SPINNER (Dönen Yükleme İkonu)
            // Sayfa yüklenirken kullanıcının boş ekran görmemesi için ortalanmış bir dönen ikon gösterir.
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress />
            </Box>
        }>
            {/* 5. CLIENT COMPONENT ENTEGRASYONU 
          Sunucuda çektiğimiz veriyi (initialData), etkileşimli olan 
          (filtreleme, arama yapabilen) ProductsView bileşenine paslıyoruz. */}
            <ProductsView initialData={initialData} />
        </Suspense>
    );
}