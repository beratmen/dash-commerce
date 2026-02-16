/**
 * PRODUCT DETAIL VIEW (Ürün Detay Sayfası)
 *
 * Bu komponetn /products/[id] sayfasında tek ürünün detaylarını gösterir.
 * - Büyük ürün görseli (sol)
 * - Ürün bilgileri: başlık, fiyat, rating, stok, açıklama (sağ)
 * - Sepete ekle butonu
 * - Geri dön butonu
 */

'use client';  // Client-side rendering (router, Redux var)

import React from 'react';
import {
    Container, Typography, Box, Rating, Button, Chip, Divider, Paper
} from '@mui/material';  // Material-UI UI komponutları
import { ShoppingCart, ArrowBack } from '@mui/icons-material';  // İkonlar
import { useRouter } from 'next/navigation';  // Yönlendirme hook'u
import { useAppDispatch } from '@/store/hooks';  // Redux dispatch
import { addToCart } from '@/store/slices/cartSlice';  // Sepete ekleme aksiyon'u
import { Product } from '@/types';  // Ürün tip tanımı

interface ProductDetailViewProps {
    // Bu komponet tek bir ürün alır (prop'dan)
    product: Product;
}

export default function ProductDetailView({ product }: ProductDetailViewProps) {
    const dispatch = useAppDispatch();  // Redux dispatch
    const router = useRouter();  // Sayfa yönlendirmesi

    return (
        <Container maxWidth="lg" sx={{ py: 6 }}>
            {/* ═══════════════════════════════════════════════════════════
                GERİ DÖN BUTONU
                ═══════════════════════════════════════════════════════════ */}
            <Button
                startIcon={<ArrowBack />}  // Geri ok ikonu
                onClick={() => router.back()}  // Önceki sayfaya dön
                sx={{ mb: 4 }}
                color="inherit"
            >
                Back to Products
            </Button>

            {/* ═══════════════════════════════════════════════════════════
                RESPONSIVE LAYOUT: FLEX
                xs: Column (mobil - bir altına), md: Row (masa ustü - yan yana)
                ═══════════════════════════════════════════════════════════ */}
            <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={6}>

                {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                   SOL TARAF: ÜRÜN RESMİ
                   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
                <Box flex={1}>
                    <Paper
                        elevation={0}  // Gölge yok
                        sx={{
                            p: 4,  // İç boşluk
                            borderRadius: 4,  // Köşe yuvarlığı
                            bgcolor: '#f8fafc',  // Açık gri arka plan
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            minHeight: '400px',  // Minimum yükseklik
                            position: 'relative',
                            overflow: 'hidden',
                        }}
                    >
                        <Box sx={{ position: 'relative', width: '100%', height: '400px' }}>
                            {/* Ürün resmi - API'den gelen thumbnail */}
                            <img
                                src={product.thumbnail}
                                alt={product.title}
                                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                            />
                        </Box>
                    </Paper>
                </Box>

                {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                   SAĞ TARAF: ÜRÜN BİLGİLERİ
                   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
                <Box flex={1}>
                    <Box>
                        {/* 1. MARKA VE KATEGORİ (Chip - etiket) */}
                        <Box display="flex" gap={1} mb={2}>
                            {/* Marka chip'i (renklı arka plan) */}
                            <Chip label={product.brand} color="primary" variant="outlined" size="small" />
                            {/* Kategori chip'i (gri arka plan) */}
                            <Chip label={product.category} color="default" size="small" />
                        </Box>

                        {/* 2. BAŞLIK */}
                        <Typography variant="h3" component="h1" fontWeight="800" gutterBottom sx={{ color: '#1e293b' }}>
                            {product.title}
                        </Typography>

                        {/* 3. PUANLAMA VE YORUM SAYISI */}
                        <Box display="flex" alignItems="center" gap={1} mb={3}>
                            {/* Rating yıldız gösterimi (0-5 arası) */}
                            <Rating value={product.rating} precision={0.1} readOnly />
                            {/* Puan metni */}
                            <Typography variant="body1" color="text.secondary">
                                ({product.rating} / 5) &bull; 120 reviews
                            </Typography>
                        </Box>

                        {/* 4. FİYAT */}
                        <Typography variant="h3" color="primary" fontWeight="bold" gutterBottom>
                            ${product.price}
                        </Typography>

                        {/* 5. İNDİRİM YÜZDESİ (Yeşil metin) */}
                        <Typography variant="body2" color="success.main" mb={4} fontWeight="500">
                            {product.discountPercentage}% Discount Available
                        </Typography>

                        {/* 6. AÇIKLAMA METNİ */}
                        <Typography variant="body1" paragraph color="text.secondary" sx={{ lineHeight: 1.8, mb: 4 }}>
                            {product.description}
                        </Typography>

                        {/* Ayırıcı çizgi */}
                        <Divider sx={{ my: 4 }} />

                        {/* 7. STOK DURUMU
                            Yeşil (In Stock) veya Kırmızı (Out of Stock) */}
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
                            <Typography variant="subtitle1" fontWeight="600">
                                Stock Status:
                            </Typography>
                            <Typography
                                variant="subtitle1"
                                color={product.stock > 0 ? 'success.main' : 'error.main'}
                                fontWeight="bold"
                            >
                                {product.stock > 0 ? 'In Stock' : 'Out of Stock'} ({product.stock} left)
                            </Typography>
                        </Box>

                        {/* 8. SEPETE EKLE BUTONU
                            Stok 0 ise disabled (özel yapılamaz) */}
                        <Button
                            variant="contained"  // Dolgu renkli buton
                            size="large"
                            fullWidth  // Tam genişlik
                            startIcon={<ShoppingCart />}  // Sepet ikonu
                            disabled={product.stock <= 0}  // Stok yoksa tıklanamaz
                            onClick={() =>
                                // Redux'a sepete ekleme aksiyon'u gönder
                                dispatch(
                                    addToCart({
                                        productId: product.id,
                                        quantity: 1,  // 1 tane ekle
                                        title: product.title,
                                        price: product.price,
                                        thumbnail: product.thumbnail,
                                    })
                                )
                            }
                            sx={{
                                py: 2,  // Dikey boşluk (yükseklik)
                                borderRadius: 3,  // Köşe yuvarlığı
                                fontWeight: 'bold',
                                textTransform: 'none',  // Büyük harf yok
                                fontSize: '1.1rem',
                                boxShadow: '0 8px 20px rgba(37, 99, 235, 0.25)'  // Mavi gölge
                            }}
                        >
                            Add to Cart
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Container>
    );
}
