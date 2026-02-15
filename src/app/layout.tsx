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
export default function RootLayout({ children }: { children: React.ReactNode }) {
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
