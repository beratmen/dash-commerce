import { fetchProductById } from '@/api/productService';    // Burda ID'ye göre ürün çekilir
import ProductDetailView from '@/components/ProductDetailView'; // Detay sayfası bileşeni
import { Metadata } from 'next';    // SEO metadata

// Next.js 15+ tip tanımı
type Props = {
    params: Promise<{ id: string }>;
    // URL'deki parametreler asenkron alır id string tipinde
};

// SEO için sayfa başlığı ve açıklama
// Burda Metadata Dinamik sayfa başlığı oluştur 
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params;
    const product = await fetchProductById(id); // API'ye istek gönderilir
    return {
        title: `${product.title} | Dash Commerce`, // Dinamik değer ile Title  güncellenir
        description: product.description, // API den gelen ürün açıklaması
    };
}

// Server Component - Sunucuda veri çekilir, Client Component'e prop olarak geçilir.
export default async function ProductDetailPage({ params }: Props) {
    // URL parametrelerini destructuring ile al tip kontrolü yap string olarak
    const { id } = await params;    //Promise'i çöz, sonucu bekle id özelliğini çıkar
    const product = await fetchProductById(id);     // API ye istek gönder  veri gelene kadar bekle
    return <ProductDetailView product={product} />; // Ürün detay bileşenini render et ve bileşenine prop olarak geç
}
