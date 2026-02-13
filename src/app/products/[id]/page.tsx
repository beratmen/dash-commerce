import { fetchProductById } from '@/api/productService';
import ProductDetailView from '@/components/ProductDetailView';
import { Metadata } from 'next';

// Next.js 15+ tip tanımı için
type Props = {
    params: Promise<{ id: string }>;
};

// SEO için Metadata oluşturma
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params;
    const product = await fetchProductById(id);
    
    return {
        title: `${product.title} | Dash Commerce`,
        description: product.description,
    };
}

// Server Component (SSR)
export default async function ProductDetailPage({ params }: Props) {
    const { id } = await params;
    
    // Sunucuda veriyi çek
    const product = await fetchProductById(id);

    // Client Component'e veriyi prop olarak geç (Hydration için)
    return <ProductDetailView product={product} />;
}
