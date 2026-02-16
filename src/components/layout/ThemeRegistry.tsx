/**
 * THEME REGISTRY (Tema ve Stil Sistemi)
 *
 * Bu bileşen Material-UI (MUI) teması ve CSS-in-JS (Emotion) yapılandırmasını
 * uygulamaya entegre eder.
 *
 * Temel Görevler:
 * - MUI theme'ini uygulamaya uygula (renkler, düğme stilleri vs.)
 * - Emotion cache'i (stil cache) yapılandır
 * - Server-side rendering (SSR) için stiller HTML head'ine inject et
 * - FOUC (Flash of Unstyled Content - Stilsiz içerik gözlemleme) problemini çöz
 *
 * Neden "use client" lazım?
 * - Emotion cache'i tarayıcıda yönetilir
 * - useServerInsertedHTML hook'u client hook'udur
 * - CSS-in-JS rendering tarayıcıda gerçekleşir
 *
 * FOUC Problemi:
 * - Sayfa yüklenirken stil dosyaları henüz yüklenmemiş olabilir
 * - Sonuç: Kullanıcı kısa bir süre stilsiz HTML görebilir (kötü UX)
 * - Çözüm: Stiller head'te önceden yerleştirilir HTML'e
 */
'use client';  // Bu bileşen tarayıcıda (client-side) çalışmalıdır

import * as React from 'react';
import createCache from '@emotion/cache';  // Emotion CSS cache: Stiller belleğe kachedır
import { useServerInsertedHTML } from 'next/navigation';  // Next.js hook: Server render'da HTML head'e stil ekleme
import { CacheProvider } from '@emotion/react';  // Emotion provider: Cache'i uygulamaya sağla
import { ThemeProvider } from '@mui/material/styles';  // MUI theme provider: MUI bileşenlerine tema uygula
import CssBaseline from '@mui/material/CssBaseline';  // MUI normalize CSS: Tüm browserler'de tutarlı stil
import theme from '@/theme';  // Önceden tanımlanmış MUI tema (renkler, bezier vb.)

/**
 * ThemeRegistry Bileşeni
 *
 * Bu bileşen uygulamayı tema sistemi ile sarmalayarak:
 * - Tüm MUI bileşenleri tanımlanmış renkler ve stilleri kullanır
 * - Stiller otomatik olarak optimize edilir ve cache'lenir
 * - Server-side rendering'de stiller HTML'e dışarıdan enjekte edilir
 */
export default function ThemeRegistry({ children }: { children: React.ReactNode }) {
    /**
     * Emotion Cache Oluşturma ve State Yönetimi
     *
     * useState her bileşen render'ında ayarlanır, bu sayede:
     * - Cache sayfa refresh'inde yeniden oluşturulmaz
     * - cache.insert özelleştirilmiş fonksiyon ile stiller track edilir
     *
     * Emotion Cache Nedir?
     * - Stil dosyalarının hafızada (in-memory) saklandığı bir sistem
     * - CSS rules hızlıca DOM'a eklenmesi için kullanılır
     * - Hızlı rendering için gereklidir
     */
    const [{ cache, flush }] = React.useState(() => {
        // STEP 1: Cache objesi oluştur
        // key: 'mui' → Emotion cache'i identifier'ı (debug ve tracking için)
        const cache = createCache({ key: 'mui' });

        // STEP 2: cache.compat = true → Eski browsers ile uyumluluk
        cache.compat = true;

        // STEP 3: Cache'in insert fonksiyonunu özelleştir (tracking için)
        // prevInsert: Orijinal insert fonksiyonu (style eklemek için)
        const prevInsert = cache.insert;

        // inserted: Hangi stiller enjekte edildi? Listesini tut
        // useServerInsertedHTML'de hangi stilleri HTML'e ekleyecek bilmek için gerekli
        let inserted: string[] = [];

        // Özelleştirilmiş insert fonksiyonu
        cache.insert = (...args) => {
            // args[1] = serialized CSS rule obje
            const serialized = args[1];

            // OPTIMIZATION: Aynı stil iki kez enjekte edilmez
            // cache.inserted[name] === undefined: Stil daha önce insert edilmedi mi?
            if (cache.inserted[serialized.name] === undefined) {
                // Yeni stil: inserted listesine ekle (sonra HTML'e enjekte etmek için)
                inserted.push(serialized.name);
            }

            // Orijinal insert fonksiyonunu çalıştır (stili DOM'a ekle)
            return prevInsert(...args);
        };

        // flush fonksiyonu: inserted listesini al ve reset et
        // Bu fonksiyon useServerInsertedHTML'de çağrılır
        const flush = () => {
            const prevInserted = inserted;
            inserted = [];  // Sonraki render için reset et
            return prevInserted;  // Enjekte edilecek stilleri döner
        };

        return { cache, flush };
    });

    /**
     * useServerInsertedHTML: Stiller HTML Head'ine Enjekte Edilir
     *
     * Nedir?
     * - Next.js hook: Server-side rendering sonrası, HTML'i tarayıcıya göndermeden önce
     *   <head> tag'ına ek HTML kodu eklemek için kullanılır
     *
     * Amaç:
     * - Stiller sayfa render olurken zaten varmış gibi gözükür
     * - FOUC (Flash of Unstyled Content) problemi çözülür
     * - Sayfa açılırken kullanıcı stilsiz HTML görmez
     *
     * Şu Adımlar İzlenir:
     * 1. flush() çağrı: Son render'da hangi stiller eklendi? Listesini al
     * 2. styles string oluştur: Bütün stiller birleştirilir
     * 3. <style> tag'ı oluştur: Emotion metadata ile işaretlenir
     * 4. dangerouslySetInnerHTML: Stiller HTML'e enjekte edilir
     */
    useServerInsertedHTML(() => {
        // STEP 1: Enjekte edilecek stiller listesini al
        // flush() fonksiyonu: inserted listesini döner ve reset eder
        const names = flush();

        // STEP 2: Eğer hiçbir stil yoksa, null döner (style tag eklenmez)
        if (names.length === 0) return null;

        // STEP 3: Stiller string'e birleştir
        // Her stil rule'u cache.inserted[name]'den alınır
        let styles = '';
        for (const name of names) {
            // cache.inserted[name]: CSS string'i (örneğin: ".css-12345 { color: blue; }")
            styles += cache.inserted[name];
        }

        // STEP 4: <style> tag'ı oluştur
        // data-emotion attribute: Emotion tarafından kontrol edildiğini gösterir
        return (
            <style
                key={cache.key}  // React key: Cache identifierini kullan
                data-emotion={`${cache.key} ${names.join(' ')}`}  // Emotion metadata
                dangerouslySetInnerHTML={{ __html: styles }}  // Stiller HTML'e enjekte edilir
            />
        );
    });

    /**
     * PROVIDER HİYERARŞİSİ (Render Chain)
     *
     * CacheProvider (Emotion)
     *   └─> ThemeProvider (MUI)
     *       └─> CssBaseline (MUI normalize CSS)
     *           └─> {children} (Uygulamanın geri kalanı)
     *
     * Her Provider bir katman ekler, tüm alt bileşenlere erişim sağlar:
     * - CacheProvider: Emotion cache'i sağlar (CSS optimization)
     * - ThemeProvider: MUI tema'sı sağlar (renkler, bekçiler, typography)
     * - CssBaseline: Tarayıcı default stilleri normalize eder
     */
    return (
        // 1. EMOTION CACHE PROVIDER
        // Tüm stiller cache'e eklenir, optimize edilir
        <CacheProvider value={cache}>
            {/* 2. MUI THEME PROVIDER */}
            {/* theme: /src/theme.ts'den import edilen tema config */}
            {/* Tüm MUI bileşenleri bu tema'yı kullanır */}
            <ThemeProvider theme={theme}>
                {/* 3. CSS BASELINE (MUI Normalize) */}
                {/* CssBaseline: Tüm browserler'de tutarlı base stiller */}
                {/* Örek: margin ve padding reset, font-family standartlaştırma */}
                <CssBaseline />

                {/* 4. UYGULAMANIN GERİ KALAN BÖLÜMÜ */}
                {/* layout.tsx'den gelen tüm sayfa bileşenleri buraya gelir */}
                {children}
            </ThemeProvider>
        </CacheProvider>
    );
}

