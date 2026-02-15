import { fetchProducts } from '@/api/productService';
import ProductsView from '@/components/ProductsView';
import { Suspense } from 'react';
import { CircularProgress, Box } from '@mui/material';

// 1. ASYNC SERVER COMPONENT - await ile sunucuda veri çekilir.
export default async function ProductsPage() {
    // 2. SSR FETCH - Ürünler sayfa gönderilmeden önce sunucuda çekilir (SEO, hızlı ilk yükleme).
    const initialData = await fetchProducts(20, 0);

    return (
        <Suspense fallback={
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress />
            </Box>
        }>
            {/* Sunucuda çekilen veri (initialData) etkileşimli ProductsView'a prop olarak geçer. */}
            <ProductsView initialData={initialData} />
        </Suspense>
    );
}
