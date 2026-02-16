import type { Metadata } from 'next';   // SEO için başlık ve açıklama
import StoreProvider from '@/components/layout/StoreProvider'; // Redux
import ThemeRegistry from '@/components/layout/ThemeRegistry';  // Stil ve temalar
import Navigation from '@/components/layout/Navigation';    // Üst menü

// 1. SEO VE META VERİLERİ
// Tarayıcı sekmesinde görünen başlık ve site açıklaması buradan yönetilir.
export const metadata: Metadata = {
    title: 'Dash Commerce',
    description: 'Prostore converted to Dash Commerce',
};

// 2. ANA LAYOUT BİLEŞENİ
// Bu fonksiyon, projedeki her sayfanın (home, profile, sepet vb.) ortak çatısıdır.
// Tüm sayfaların içeriği buraya gelir
export default function RootLayout({ children }: { children: React.ReactNode }) {
    // React.ReactNode ile Tip Tanımı Yapıldı React'te render edebileceğin her şey
    return (
        <html lang="en">
            <body>
                {/* 3. STORE PROVIDER (Redux) */}
                <StoreProvider>
                    {/* 4. THEME REGISTRY (MUI & CSS) */}
                    <ThemeRegistry>
                        {/* 5. NAVIGATION (Üst Menü) */}
                        <Navigation />
                        {/* 6. SAYFA İÇERİĞİ */}
                        {children}
                    </ThemeRegistry>
                </StoreProvider>
            </body>
        </html>
    );
}
