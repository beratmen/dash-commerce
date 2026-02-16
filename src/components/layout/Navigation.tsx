/**
 * NAVIGATION (Üst Navigasyon Çubuğu / Header)
 *
 * Bu bileşen sayfanın üst kısmında görünen navigasyon bar'ıdır.
 *
 * Temel Görevler:
 * - DASH-COMMERCE logo ve branding'i göstermek
 * - Ürün arama input'u sağlamak (Debounce ile optimize edilen)
 * - Sepete (Cart) kısayol linki göstermek
 * - Sepetteki ürün sayısını badge olarak göstermek
 * - Sticky navbar: Sayfa scroll'lanırken da görünür kalması
 *
 * Bileşen Bölümleri:
 * 1. AppBar: Üst bar container'ı
 * 2. Logo Kısımı: DASH-COMMERCE logotype'ı
 * 3. Arama Çubuğu: Ürün arama input'u
 * 4. Sepet İkonu: Sepete gitmek için link ve item sayı badge'ı
 */
'use client';

import { AppBar, Toolbar, Typography, Container, Box, IconButton, Badge } from '@mui/material';  // MUI bar ve layout bileşenleri
import { LocalMall, ShoppingCart } from '@mui/icons-material';  // İkonlar: Dükkan ve sepet
import { styled, alpha } from '@mui/material/styles';  // MUI CSS-in-JS: Styled components oluşturma
import InputBase from '@mui/material/InputBase';  // MUI base input: Custom style'lanabilir input
import SearchIcon from '@mui/icons-material/Search';  // Arama ikonu
import debounce from 'lodash.debounce';  // Debounce utility: API çağrılarını optimize eder
import { useAppDispatch, useAppSelector } from '@/store/hooks';  // Redux hooks
import { setSearchQuery } from '@/store/slices/uiSlice';  // Arama sorgusu aksiyon'u
import { selectCartTotalQuantity } from '@/store/slices/cartSlice';  // Sepet item sayısını al
import { useMemo } from 'react';  // React hook: Debounce fonksiyonunu cache et
import Link from 'next/link';  // Next.js Link: SEO-friendly navigasyon

/**
 * STYLED COMPONENTS (CSS-in-JS ile Custom Styling)
 *
 * MUI styled() fonksiyonu kullanarak custom component'ler yaratıyoruz.
 * Avantaj: TypeScript desteği, theme integration, dinamik styling
 */

/**
 * Search: Arama Bar Container'ı
 *
 * Styling:
 * - Pozisyon: Relative (SearchIconWrapper içinde absolute konumlanması için)
 * - Renk: Koyu alpha(0.05) = %5 siyah (hafif gri)
 * - Hover: Koyu alpha(0.08) = %8 siyah (daha belirgin)
 * - Responsive: Telefonlarda full-width, desktop'ta auto
 */
const Search = styled('div')(({ theme }) => (
    {
        position: 'relative',
        borderRadius: theme.shape.borderRadius,  // MUI theme'dan border-radius al
        backgroundColor: alpha(theme.palette.common.black, 0.05),  // %5 koyu
        '&:hover': { backgroundColor: alpha(theme.palette.common.black, 0.08) },  // Hover: %8 koyu
        margin: 0,
        width: '100%',  // Mobil: tam genişlik
        [theme.breakpoints.up('sm')]: { width: 'auto' },  // Tablet+: otomatik genişlik
    }
));

/**
 * SearchIconWrapper: Arama İkonu Container'ı
 *
 * Styling:
 * - Absolute positioning: Arama input'unun sol tarafında sabit konumlanması için
 * - pointerEvents: 'none' → İkona tıklamak input'u etkinleştirmez
 * - Centered: Flex ile ortala
 */
const SearchIconWrapper = styled('div')(({ theme }) => (
    {
        padding: theme.spacing(0, 2),  // Yatay padding: 16px (0, 16px)
        height: '100%',  // Full height
        position: 'absolute',  // Input üstünde sabit
        pointerEvents: 'none',  // Fare input'a gitmesi için tıklanamaz
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: theme.palette.text.secondary,  // Gri renk
    }
));

/**
 * StyledInputBase: Custom Stili Input Field
 *
 * Styling:
 * - Padding: Dikey 12px (1.5 * 8px), yatay 0, sol taraf (SearchIcon için)
 * - Width: Mobil 100%, desktop 60 karakter (60ch)
 * - Transition: Font boyutu ve genişlik smooth animate oluyor
 */
const StyledInputBase = styled(InputBase)(({ theme }) => (
    {
        color: 'inherit',  // Ana yazı rengini kullan
        '& .MuiInputBase-input': {  // Input field itself
            padding: theme.spacing(1.5, 1, 1.5, 0),  // Dikey 12px, yatay 8px-0px
            paddingLeft: `calc(1em + ${theme.spacing(4)})`,  // SearchIcon alanı: 1em + 32px
            transition: theme.transitions.create('width'),  // Width smooth oluyor
            width: '100%',  // Başta tam genişlik
            fontSize: '1rem',  // Yazı boyutu
            [theme.breakpoints.up('md')]: { width: '60ch' },  // 900px+: 60 karakter
        },
    }
));

/**
 * Navigation Bileşeni
 *
 * Render Sırası:
 * 1. AppBar: Üst bar container'ı, sticky position
 * 2. Container + Toolbar: İçerik wrapper'ları
 * 3. Logo bölümü: DASH-COMMERCE logotype
 * 4. Spacer: Ortada boş alan
 * 5. Arama çubuğu: Search input + icon
 * 6. Spacer 2: Ortada boş alan
 * 7. Sepet ikonu: Cart link + badge
 */
export default function Navigation() {
    // Redux Hooks
    const dispatch = useAppDispatch();  // Aksiyon'ları Redux'a gönder
    const cartQuantity = useAppSelector(selectCartTotalQuantity);  // Sepetteki item sayısı

    /**
     * handleSearchChange: Arama Input'unda Metin Değiştiğinde
     *
     * Flow:
     * 1. Input'da yazı yazılır
     * 2. onChange tetiklenir
     * 3. Debounce: 500ms bekle (kullanıcı yazma bitirsin diye)
     * 4. 500ms sonra: setSearchQuery aksiyon'u Redux'a gönder
     * 5. Redux: UI state'e searchQuery kaydedilir
     * 6. ProductsView: useEffect tetiklenir → API çağrısı yapılır
     *
     * Neden debounce?
     * - Her yazı işleminde API çağrısı yapmak = Server ve bandwidth israfı
     * - Debounce: Sadece kullanıcı yazma bitirdikten 500ms sonra arama yap
     *
     * useMemo:
     * - Debounce fonksiyonunu bileşen render'larında yeniden oluşturma
     * - Aynı debounced fonksiyonu kullan (optimization)
     */
    const handleSearchChange = useMemo(
        () =>
            debounce((event: React.ChangeEvent<HTMLInputElement>) => {
                // dispatch: setSearchQuery aksiyon'unu Redux'a gönder
                // Input value'su: event.target.value
                dispatch(setSearchQuery(event.target.value));
            }, 500),  // 500ms debounce delay
        [dispatch]
    );

    return (
        <>
            {/* ═══════════════════════════════════════════════════════════
               APPBAR: Üst Navigasyon Bar Container'ı
               ═══════════════════════════════════════════════════════════

               Props:
               - position="sticky" → Sayfa scroll'lanırken üstte kalır
               - color="inherit" → Arka plan sayfanın rengini kullan
               - elevation={0} → Gölge yok
               - sx={{ ... }} → Custom styling
            */}
            <AppBar
                position="sticky"
                color="inherit"
                elevation={0}
                sx={{
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',  // %80 opak beyaz (yarı saydam)
                    backdropFilter: 'blur(12px)',  // Glassmorphism effect: Bulanık cam efekti
                    borderBottom: '1px solid rgba(0, 0, 0, 0.06)',  // Hafif alt çizgi (gölge efekti)
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',  // Yumuşak gölge
                    transition: 'all 0.3s ease',  // Tüm özellikler smooth animate oluyor
                }}
            >
                <Container maxWidth="xl">  {/* Max width: XL (1920px) */}
                    <Toolbar disableGutters sx={{ height: 88, justifyContent: 'space-between' }}>
                        {/* ─────────────────────────────────────────────────────────
                           LOGO BÖLÜMÜ (Sol)
                           ───────────────────────────────────────────────────────── */}
                        {/* Link: Anasayfaya (/)'ye git */}
                        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 12 }}>
                            {/* Logo Box: Teal renkli dikdörtgen arka planında icon */}
                            <Box
                                sx={{
                                    width: 48,  // 48px kare
                                    height: 48,
                                    // Gradient: Teal-2-Teal-1 (soldan sağa)
                                    background: 'linear-gradient(135deg, #0d9488 0%, #115e59 100%)',
                                    borderRadius: 3,  // Yuvarlatılmış köşeler
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'white',
                                    boxShadow: '0 4px 12px rgba(13, 148, 136, 0.3)',  // Teal gölge
                                    '&:hover': { transform: 'rotate(12deg)' },  // Dönme efekti on hover
                                }}
                            >
                                {/* LocalMall: Mağaza/Bag ikonu */}
                                <LocalMall fontSize="medium" />
                            </Box>

                            {/* Logo Metni: "DASH-COMMERCE" ve "PREMIUM STORE" */}
                            {/* display: { xs: 'none', sm: 'block' } → Mobilde gizle, tablet'ten göster */}
                            <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                                {/* DASH-COMMERCE (Başlık) */}
                                <Typography
                                    variant="h6"  // h6 heading
                                    sx={{
                                        fontWeight: 800,  // Çok bold
                                        letterSpacing: '1px',  // Karakterler arası boşluk
                                        color: '#1e293b',  // Koyu gri-mavi
                                        fontFamily: 'monospace',  // Yazı şekli: Monospace (teknik)
                                    }}
                                >
                                    DASH-COMMERCE
                                </Typography>

                                {/* PREMIUM STORE (Alt başlık) */}
                                <Typography
                                    variant="caption"  // Çok küçük yazı
                                    sx={{ color: '#64748b', fontWeight: 500, letterSpacing: '0.5px' }}
                                >
                                    PREMIUM STORE
                                </Typography>
                            </Box>
                        </Link>

                        {/* ─────────────────────────────────────────────────────────
                           SPACER (ORTA BOŞ ALAN)
                           ─────────────────────────────────────────────────────────
                           flexGrow: 1 → Boş alanı genişlet (sağdaki elemanları sağa iterek)
                        */}
                        <Box sx={{ flexGrow: 1 }} />

                        {/* ─────────────────────────────────────────────────────────
                           ARAMA ÇUBUĞU (ORTA)
                           ─────────────────────────────────────────────────────────

                           Flow:
                           1. <Search>: Kapsayıcı (arkaplan, border-radius)
                           2. <SearchIconWrapper>: Sol tarafta arama ikonu
                           3. <StyledInputBase>: Input field
                           4. onChange: handleSearchChange tetiklenir (debounce 500ms)
                        */}
                        <Search>
                            {/* Arama İkonu (Sol Taraf) */}
                            <SearchIconWrapper>
                                <SearchIcon />
                            </SearchIconWrapper>

                            {/* Arama Input Field */}
                            <StyledInputBase
                                placeholder="Search products..."  // Placeholder text
                                inputProps={{ 'aria-label': 'search' }}  // Erişilebilirlik
                                onChange={handleSearchChange}  // Metin değişince debounce handleSearchChange çalış
                            />
                        </Search>

                        {/* ─────────────────────────────────────────────────────────
                           SPACER 2 (ORTA BOŞ ALAN)
                           ───────────────────────────────────────────────────────── */}
                        <Box sx={{ flexGrow: 1 }} />

                        {/* ─────────────────────────────────────────────────────────
                           SEPET İKONU (SAĞ)
                           ─────────────────────────────────────────────────────────

                           Props:
                           - Link href="/cart": Sepet sayfasına git
                           - Badge: Sepetteki item sayısını göster
                           - color="primary": Mavi renk
                        */}
                        <Link href="/cart" aria-label="Cart" style={{ display: 'flex', alignItems: 'center' }}>
                            <IconButton sx={{ ml: 1, color: 'primary.main' }}>
                                {/* Badge: Kırmızı nokta sayı ile sepet ikonosu üstünde */}
                                <Badge badgeContent={cartQuantity} color="primary">
                                    <ShoppingCart />
                                </Badge>
                            </IconButton>
                        </Link>
                    </Toolbar>
                </Container>
            </AppBar>
        </>
    );
}

