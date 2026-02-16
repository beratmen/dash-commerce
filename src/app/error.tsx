/**
 * GLOBAL ERROR BOUNDARY (Hata Sınırı)
 * 
 * Bu dosya, uygulama çalışma zamanında (runtime) bir hata verdiğinde
 * Next.js tarafından otomatik olarak render edilir. 
 * Kullanıcıya beyaz ekran göstermek yerine şık bir hata sayfası sunar.
 */

'use client'; // Hata sınırları her zaman Client Component olmalıdır.

import React from "react";
import { Box, Typography, Button, Container } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

/**
 * Error Bileşeni Props:
 * - error: Meydana gelen hata objesi (loglama için kullanılabilir).
 * - reset: Kullanıcı tıkladığında sayfayı/bölümü tekrar render etmeye çalışan fonksiyon.
 */
export default function Error({
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void;
}) {
    return (
        <Container maxWidth="sm">
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',    // Yatayda ortala
                    justifyContent: 'center', // Dikeyde ortala
                    minHeight: '80vh',        // Sayfayı dikeyde kapla
                    textAlign: 'center',
                    gap: 3                    // Elemanlar arası boşluk
                }}
            >
                {/* Hata İkonu: Dikkat çekmesi için kırmızı (Red 500) tonunda */}
                <ErrorOutlineIcon sx={{ fontSize: 80, color: '#ef4444' }} />
                
                {/* Ana Başlık */}
                <Typography variant="h4" sx={{ fontWeight: 800, color: '#0f172a' }}>
                    Something went wrong!
                </Typography>
                
                {/* Açıklama Metni */}
                <Typography variant="body1" color="text.secondary">
                    The application encountered an unexpected error. Please try again.
                </Typography>
                
                {/* 
                    "Try Again" Butonu
                    reset() fonksiyonunu tetikleyerek hatayı gidermeye ve 
                    sayfayı yeniden yüklemeye çalışır.
                */}
                <Button
                    variant="contained"
                    size="large"
                    onClick={() => reset()} // Hatayı sıfırlayıp yeniden denemeyi sağlar
                    sx={{
                        background: 'linear-gradient(135deg, #0d9488 0%, #0f766e 100%)', // Teal gradyan
                        px: 4,
                        borderRadius: '12px',
                        textTransform: 'none', // Buton yazısını olduğu gibi bırak (hepsi büyük harf yapma)
                        fontWeight: 700
                    }}
                >
                    Try Again
                </Button>
            </Box>
        </Container>
    );
}