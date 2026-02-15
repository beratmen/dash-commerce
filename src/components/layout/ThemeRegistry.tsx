'use client'; // Bu bileşen, Emotion cache yönettiği için tarayıcı tarafında çalışmalıdır.

import * as React from 'react';
import createCache from '@emotion/cache';
import { useServerInsertedHTML } from 'next/navigation';
import { CacheProvider } from '@emotion/react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from '@/theme';

// ThemeRegistry: MUI teması ve CSS-in-JS (Emotion) yapılandırmasını birleştirir.
export default function ThemeRegistry({ children }: { children: React.ReactNode }) {
    // 1. EMOTION CACHE (stil önbelleği) - sayfa her render olduğunda baştan oluşmasın diye useState içinde.
    const [{ cache, flush }] = React.useState(() => {
        const cache = createCache({ key: 'mui' });
        cache.compat = true;
        const prevInsert = cache.insert;
        let inserted: string[] = [];
        cache.insert = (...args) => {
            const serialized = args[1];
            if (cache.inserted[serialized.name] === undefined) {
                inserted.push(serialized.name);
            }
            return prevInsert(...args);
        };
        const flush = () => {
            const prevInserted = inserted;
            inserted = [];
            return prevInserted;
        };
        return { cache, flush };
    });

    // 2. SUNUCU TARAFI STİL ENJEKSİYONU - FOUC önlemek için stiller head'e yerleştirilir.
    useServerInsertedHTML(() => {
        const names = flush();
        if (names.length === 0) return null;
        let styles = '';
        for (const name of names) {
            styles += cache.inserted[name];
        }
        return (
            <style
                key={cache.key}
                data-emotion={`${cache.key} ${names.join(' ')}`}
                dangerouslySetInnerHTML={{ __html: styles }}
            />
        );
    });

    // 3. Provider Hiyerarşisi
    return (
        <CacheProvider value={cache}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                {children}
            </ThemeProvider>
        </CacheProvider>
    );
}
