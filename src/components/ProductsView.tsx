'use client';

import React, { useEffect } from 'react';
import {
    Container, Card, CardContent, CardMedia, Typography,
    CircularProgress, Box, Pagination, Rating,
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchProductsAsync, setProducts } from '@/store/slices/productSlice';
import { setPage } from '@/store/slices/uiSlice';
import { ProductsViewProps } from '@/types';

export default function ProductsView({ initialData }: ProductsViewProps) {
    const dispatch = useAppDispatch();
    const { items, total, loading, error } = useAppSelector((state) => state.products);
    const { currentPage, itemsPerPage, searchQuery } = useAppSelector((state) => state.ui);

    useEffect(() => {
        // İlk yüklemede initialData kullan, sonrasında sayfa değişikliklerinde API'den çek
        // Not: Arama yapıldıysa initialData'yı yoksaymalıyız çünkü initialData filtrelenmemiş olabilir
        if (initialData && items.length === 0 && !searchQuery) {
            dispatch(setProducts(initialData));
            return; // İlk yüklemede API çağrısı yapma
        }
        
        // Sayfa veya sayfa başı ürün sayısı değişince yeni veri çek
        const skip = (currentPage - 1) * itemsPerPage;
        dispatch(fetchProductsAsync({ limit: itemsPerPage, skip, search: searchQuery }));
    }, [dispatch, currentPage, itemsPerPage, initialData, items.length, searchQuery]);

    const handlePageChange = (_: React.ChangeEvent<unknown>, page: number) => {
        dispatch(setPage(page));
    };

    if (loading && items.length === 0) {
        return (
            <Box display="flex" justifyContent="center" mt={4}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return <Typography color="error" align="center" mt={4}>{error}</Typography>;
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom fontWeight="bold" color="primary">
                Discover Products
            </Typography>
            <Typography variant="subtitle1" gutterBottom color="text.secondary">
                {total} products found
            </Typography>

            <Box 
                sx={{ 
                    display: 'grid',
                    gridTemplateColumns: {
                        xs: 'repeat(1, 1fr)',
                        sm: 'repeat(2, 1fr)',
                        md: 'repeat(3, 1fr)',
                        lg: 'repeat(4, 1fr)'
                    },
                    gap: 3,
                    mt: 2
                }}
            >
                {items.map((product) => (
                    <Box key={String(product.id)} sx={{ height: '100%' }}>
                        <Card sx={{ 
                            height: '420px', 
                            display: 'flex', 
                            flexDirection: 'column',
                            transition: 'transform 0.2s, box-shadow 0.2s',
                            '&:hover': {
                                transform: 'translateY(-4px)',
                                boxShadow: 4
                            }
                        }}>
                            <CardMedia
                                component="img"
                                height="180"
                                image={product.thumbnail}
                                alt={product.title}
                                sx={{ objectFit: 'contain', p: 2, bgcolor: '#f5f5f5', minHeight: '180px', maxHeight: '180px' }}
                            />
                            <CardContent sx={{ flexGrow: 1 }}>
                                <Typography 
                                    gutterBottom 
                                    variant="h6" 
                                    component="div" 
                                    sx={{ 
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        display: '-webkit-box',
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: 'vertical',
                                        minHeight: '64px'
                                    }}
                                >
                                    {product.title}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                    {product.category}
                                </Typography>
                                <Box display="flex" alignItems="center" mb={1}>
                                    <Rating value={product.rating} readOnly size="small" precision={0.5} />
                                    <Typography variant="caption" ml={1}>({product.rating})</Typography>
                                </Box>
                                <Typography variant="h6" color="primary" fontWeight="bold">
                                    ${product.price}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Box>
                ))}
            </Box>

            <Box display="flex" justifyContent="center" mt={4}>
                <Pagination
                    count={Math.ceil(total / itemsPerPage)}
                    page={currentPage}
                    onChange={handlePageChange}
                    color="primary"
                    size="large"
                />
            </Box>
        </Container>
    );
}
