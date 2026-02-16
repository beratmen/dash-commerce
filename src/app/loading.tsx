/**
 * LOADING BİLEŞENİ
 * 
 * Bu dosya Next.js'in özel "loading.tsx" yapısını kullanır.
 * Uygulama içerisinde asenkron (async) bir veri çekilirken (örneğin ürünler listelenirken),
 * Next.js bu dosyayı otomatik olarak algılar ve veri hazır olana kadar ekranda gösterir.
 */

'use client'; // Animasyonlar ve MUI keyframes motoru tarayıcı tarafında çalıştığı için gereklidir.

import React from 'react';
import { Box, CircularProgress, Typography, keyframes } from '@mui/material';

/**
 * 1. ANIMASYON TANIMLAMA (Pulse Efekti)
 * MUI'nin keyframes fonksiyonu ile CSS animasyonu oluşturuyoruz.
 */
const pulse = keyframes`
  0% { opacity: 0.6; }
  50% { opacity: 1; }
  100% { opacity: 0.6; }
`;

export default function Loading() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column', // İçerikleri alt alta diz
        alignItems: 'center',    // Yatayda ortala
        justifyContent: 'center', // Dikeyde ortala
        minHeight: '80vh',        // Ekranın %80'ini kaplayarak içeriği dikeyde de ortalar.
        gap: 2,                  // Elemanlar arası boşluk (16px)
        backgroundColor: '#f8fafc' // Dash Commerce'in Slate 50 tema rengiyle uyumlu arka plan.
      }}
    >
      {/* 
          2. YÜKLEME İKONU (CircularProgress)
          size: 60 -> İkonun boyutu.
          thickness: 4 -> Çizgi kalınlığı.
          sx: { color: '#0d9488' } -> Dash Commerce ana Teal rengi.
      */}
      <CircularProgress 
        size={60} 
        thickness={4} 
        sx={{ color: '#0d9488' }} 
      />
      
      {/* 
          3. BİLGİLENDİRME METNİ (Typography)
          color: '#64748b' -> Okunabilirliği yüksek Slate gri tonu.
          animation: Yukarıda tanımladığımız 'pulse' animasyonunu 1.5 saniyelik döngüye sokar.
      */}
      <Typography 
        variant="h6" 
        sx={{ 
          color: '#64748b', 
          fontWeight: 600,
          letterSpacing: '1px',
          animation: `${pulse} 1.5s infinite ease-in-out`
        }}
      >
        Loading Dash Commerce...
      </Typography>
    </Box>
  );
}