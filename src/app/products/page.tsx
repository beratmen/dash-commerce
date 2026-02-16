import { fetchProducts } from '@/api/productService';   // Ürün veri API'si
import ProductsView from '@/components/ProductsView';   // Ürünleri gösteren bileşen
import { Suspense } from 'react';   // Yükleme sırasında fallback göster
import { CircularProgress, Box } from '@mui/material';  // Yükleme tüneli (spinner)

// 1. ASYNC SERVER COMPONENT - await ile sunucuda veri çekilir.
export default async function ProductsPage() {
    // 2. SSR FETCH - Ürünler sayfa gönderilmeden önce sunucuda çekilir (SEO, hızlı ilk yükleme).
    const initialData = await fetchProducts(20, 0);
    // bana 0.üründen başla ve 20 ürün getir gelen ürünleri initialData içine ata

    return (
        <Suspense fallback={
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                {/* Suspense ile ekran boş kalmasın diye Fallback gösterir */}
                <CircularProgress />
                {/* Bir kez yüklenirken gösterilir sonra kaldırılır */}
            </Box>
        }>
            {/* Sunucuda çekilen veri (initialData) etkileşimli ProductsView'a prop olarak geçer. */}
            <ProductsView initialData={initialData} />
        </Suspense>
    );
}
