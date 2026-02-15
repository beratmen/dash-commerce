import { fetchProductById } from '@/api/productService';
import ProductDetailView from '@/components/ProductDetailView';
import { Metadata } from 'next';

// Next.js 15+ tip tanımı
type Props = {
    params: Promise<{ id: string }>;
};

// SEO için sayfa başlığı ve açıklama
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params;
    const product = await fetchProductById(id);
    return {
        title: `${product.title} | Dash Commerce`,
        description: product.description,
    };
}

// Server Component - Sunucuda veri çekilir, Client Component'e prop olarak geçilir.
export default async function ProductDetailPage({ params }: Props) {
    const { id } = await params;
    const product = await fetchProductById(id);
    return <ProductDetailView product={product} />;
}
