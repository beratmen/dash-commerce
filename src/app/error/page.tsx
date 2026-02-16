/**
 * MANUEL HATA SAYFASI (System Error Page)
 * 
 * Bu sayfa, /error rotasında çalışır. Genellikle API Interceptor
 * tarafından yönlendirme yapıldığında (örneğin 500 Server Error)
 * kullanıcıyı karşılayan bilgilendirme sayfasıdır.
 */

'use client';

import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import Link from 'next/link';

export default function ErrorPage() {
  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',    // Yatayda ortala
          justifyContent: 'center', // Dikeyde ortala
          minHeight: '80vh',        // Sayfanın merkezinde durması için
          textAlign: 'center',
          gap: 3
        }}
      >
        {/* Uyarı İkonu: Sistem hatasını temsil eden Turuncu (Amber) renk */}
        <WarningAmberIcon sx={{ fontSize: 80, color: '#f59e0b' }} />
        
        {/* Hata Başlığı */}
        <Typography variant="h4" sx={{ fontWeight: 800, color: '#0f172a' }}>
          System Error
        </Typography>
        
        {/* Kullanıcıya yönelik açıklayıcı metin */}
        <Typography variant="body1" color="text.secondary">
          We are unable to process your request at the moment. Please return to the home page and try again.
        </Typography>
        
        {/* 
            Geri Dönüş Butonu
            Kullanıcıyı güvenli bir şekilde ana sayfaya yönlendirir.
            Link bileşeni sayesinde sayfa yenilenmeden hızlı geçiş yapılır.
        */}
        <Button
          component={Link} // Butonu bir Next.js Link bileşeni gibi çalıştırır
          href="/"
          variant="outlined"
          sx={{ 
            borderColor: '#0d9488', // Dash Commerce Teal rengi
            color: '#0d9488',
            borderRadius: '12px',
            px: 4,
            fontWeight: 700,
            '&:hover': {
              borderColor: '#0f766e',
              backgroundColor: 'rgba(13, 148, 136, 0.05)' // Hafif Teal arka plan efekti
            }
          }}
        >
          Back to Home
        </Button>
      </Box>
    </Container>
  );
}