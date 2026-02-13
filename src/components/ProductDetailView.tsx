'use client';

import React, { useEffect } from 'react';
import {
    Container, Typography, Box, Rating, Button, Chip, Divider, Paper
} from '@mui/material';
import { ShoppingCart, ArrowBack } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/store/hooks';
import { setSelectedProduct } from '@/store/slices/productSlice';
import { Product } from '@/types';

interface ProductDetailViewProps {
    product: Product;
}

export default function ProductDetailView({ product }: ProductDetailViewProps) {
    const dispatch = useAppDispatch();
    const router = useRouter();

    // SSR'dan gelen veriyi Redux'a yükle (Hydration)
    useEffect(() => {
        if (product) {
            dispatch(setSelectedProduct(product));
        }
    }, [dispatch, product]);

    return (
        <Container maxWidth="lg" sx={{ py: 6 }}>
            {/* Geri Dön Butonu */}
            <Button 
                startIcon={<ArrowBack />} 
                onClick={() => router.back()} 
                sx={{ mb: 4 }}
                color="inherit"
            >
                Back to Products
            </Button>

            {/* Responsive Flex Layout */}
            <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={6}>
                
                {/* SOL: Ürün Görseli */}
                <Box flex={1}>
                    <Paper 
                        elevation={0} 
                        sx={{ 
                            p: 4, 
                            borderRadius: 4, 
                            bgcolor: '#f8fafc',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            minHeight: '400px',
                            position: 'relative',
                            overflow: 'hidden'
                        }}
                    >
                        {/* Next.js Image optimization */}
                        <Box sx={{ position: 'relative', width: '100%', height: '400px' }}>
                             <img 
                                src={product.thumbnail} 
                                alt={product.title}
                                style={{ 
                                    width: '100%', 
                                    height: '100%', 
                                    objectFit: 'contain' 
                                }} 
                            />
                        </Box>
                    </Paper>
                </Box>

                {/* SAĞ: Ürün Bilgileri */}
                <Box flex={1}>
                    <Box>
                        {/* Marka & Kategori */}
                        <Box display="flex" gap={1} mb={2}>
                            <Chip label={product.brand} color="primary" variant="outlined" size="small" />
                            <Chip label={product.category} color="default" size="small" />
                        </Box>

                        {/* Başlık */}
                        <Typography variant="h3" component="h1" fontWeight="800" gutterBottom sx={{ color: '#1e293b' }}>
                            {product.title}
                        </Typography>

                        {/* Puanlama */}
                        <Box display="flex" alignItems="center" gap={1} mb={3}>
                            <Rating value={product.rating} precision={0.1} readOnly />
                            <Typography variant="body1" color="text.secondary">
                                ({product.rating} / 5) &bull; 120 reviews
                            </Typography>
                        </Box>

                        {/* Fiyat */}
                        <Typography variant="h3" color="primary" fontWeight="bold" gutterBottom>
                            ${product.price}
                        </Typography>
                        <Typography variant="body2" color="success.main" mb={4} fontWeight="500">
                            {product.discountPercentage}% Discount Available
                        </Typography>

                        {/* Açıklama */}
                        <Typography variant="body1" paragraph color="text.secondary" sx={{ lineHeight: 1.8, mb: 4 }}>
                            {product.description}
                        </Typography>

                        <Divider sx={{ my: 4 }} />

                        {/* Stok Durumu */}
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
                            <Typography variant="subtitle1" fontWeight="600">
                                Stock Status:
                            </Typography>
                            <Typography variant="subtitle1" color={product.stock > 0 ? 'success.main' : 'error.main'} fontWeight="bold">
                                {product.stock > 0 ? 'In Stock' : 'Out of Stock'} ({product.stock} left)
                            </Typography>
                        </Box>

                        {/* Sepete Ekle Butonu */}
                        <Button 
                            variant="contained" 
                            size="large" 
                            fullWidth 
                            startIcon={<ShoppingCart />}
                            sx={{ 
                                py: 2, 
                                borderRadius: 3, 
                                fontWeight: 'bold',
                                textTransform: 'none',
                                fontSize: '1.1rem',
                                boxShadow: '0 8px 20px rgba(37, 99, 235, 0.25)' 
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
