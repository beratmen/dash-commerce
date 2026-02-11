'use client'; // Bu bileşen, Emotion cache (önbellek) yönettiği için tarayıcı tarafında çalışmalıdır.

import * as React from 'react';
import createCache from '@emotion/cache';
import { useServerInsertedHTML } from 'next/navigation';
import { CacheProvider } from '@emotion/react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from '@/theme';

// ThemeRegistry: MUI teması ve CSS-in-JS (Emotion) yapılandırmasını birleştiren "Kayıt Defteri"
export default function ThemeRegistry({ children }: { children: React.ReactNode }) {

    // 1. EMOTION CACHE (STİL ÖNBELLEĞİ) OLUŞTURMA
    // useState içinde tanımlanır ki sayfa her render olduğunda baştan oluşmasın.
    const [{ cache, flush }] = React.useState(() => {
        const cache = createCache({ key: 'mui' }); // MUI'ye özel bir stil deposu oluştur
        cache.compat = true;
        const prevInsert = cache.insert;
        let inserted: string[] = [];

        // Stiller eklendiğinde isimlerini takip etmemizi sağlayan özel bir dinleyici
        cache.insert = (...args) => {
            const serialized = args[1];
            if (cache.inserted[serialized.name] === undefined) {
                inserted.push(serialized.name);
            }
            return prevInsert(...args);
        };

        // flush: O ana kadar toplanan stil isimlerini paketleyip gönderir ve listeyi sıfırlar.
        const flush = () => {
            const prevInserted = inserted;
            inserted = [];
            return prevInserted;
        };
        return { cache, flush };
    });

    // 2. SUNUCU TARAFI STİL ENJEKSİYONU
    // Next.js'e özel bu hook, sunucuda üretilen CSS'leri HTML'in <head> kısmına yerleştirir.
    // Bu sayede sayfa açılır açılmaz renkler ve düzen düzgün gelir (FOUC hatasını önler).
    useServerInsertedHTML(() => {
        const names = flush();
        if (names.length === 0) {
            return null;
        }
        let styles = '';
        for (const name of names) {
            styles += cache.inserted[name];
        }
        return (
            <style
                key={cache.key}
                data-emotion={`${cache.key} ${names.join(' ')}`}
                dangerouslySetInnerHTML={{
                    __html: styles,
                }}
            />
        );
    });

    // 3. SARALAYICI YAPI (Provider Hiyerarşisi)
    return (
        <CacheProvider value={cache}>
            {/* ThemeProvider: 'theme.ts' dosyasındaki renkleri ve yazı tiplerini tüm projeye yayar */}
            <ThemeProvider theme={theme}>
                {/* CssBaseline: Tarayıcılar arası stil farklarını sıfırlar (Normalize CSS gibi) */}
                <CssBaseline />
                {children}
            </ThemeProvider>
        </CacheProvider>
    );
}