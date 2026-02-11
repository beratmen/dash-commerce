import type { Metadata } from 'next';
import StoreProvider from '@/components/layout/StoreProvider';
import ThemeRegistry from '@/components/layout/ThemeRegistry';
import Navigation from '@/components/layout/Navigation';

// 1. SEO VE META VERİLERİ
// Tarayıcı sekmesinde görünen başlık ve site açıklaması buradan yönetilir.
export const metadata: Metadata = {
    title: 'Dash Commerce',
    description: 'Prostore converted to Dash Commerce',
};

// 2. ANA LAYOUT BİLEŞENİ
// Bu fonksiyon, projedeki her sayfanın (home, profile, sepet vb.) ortak çatısıdır.
export default function RootLayout({
    children,
}: {
    children: React.ReactNode; // Sayfa içerikleri buraya "children" olarak gelir.
}) {
    return (
        <html lang="en">
            <body>
                {/* 3. STORE PROVIDER (Redux)
            En dışta yer alır çünkü hem temanın hem de sayfanın 
            Redux verilerine (örneğin karanlık mod tercihi veya kullanıcı bilgisi) 
            ihtiyacı olabilir. */}
                <StoreProvider>

                    {/* 4. THEME REGISTRY (MUI & CSS)
              MUI temalarını ve sunucu taraflı stil (SSR) desteğini sağlar.
              Tasarımsal her şey bu katmanın içindedir. */}
                    <ThemeRegistry>

                        {/* 5. NAVIGATION (Üst Menü)
                Her sayfada en üstte sabit olarak görünen navigasyon çubuğu. */}
                        <Navigation />

                        {/* 6. SAYFA İÇERİĞİ
                Hangi sayfadaysanız o sayfanın özel kodları buraya yerleşir. */}
                        {children}

                    </ThemeRegistry>
                </StoreProvider>
            </body>
        </html>
    );
}