'use client';

import React, { useEffect } from 'react';
import {
    Container, Grid, Card, CardContent, CardMedia, Typography,
    CircularProgress, Box, Pagination, Rating,
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchProductsAsync, setProducts } from '@/store/slices/productSlice';
import { setPage } from '@/store/slices/uiSlice';
import { ProductsViewProps } from '@/types';

export default function ProductsView({ initialData }: ProductsViewProps) {
    const dispatch = useAppDispatch();
    const { items, total, loading, error } = useAppSelector((state) => state.products);
    const { currentPage, itemsPerPage } = useAppSelector((state) => state.ui);

    useEffect(() => {
        // Sayfa ilk açıldığında veri yoksa initialData'yı kullan
        if (initialData && items.length === 0) {
            dispatch(setProducts(initialData));
        }
    }, [dispatch, initialData, items.length]);

    useEffect(() => {
        // Sayfa veya sayfa başı ürün sayısı değişince yeni veri çek
        const skip = (currentPage - 1) * itemsPerPage;
        dispatch(fetchProductsAsync({ limit: itemsPerPage, skip }));
    }, [dispatch, currentPage, itemsPerPage]);

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

            <Grid container spacing={3} mt={2}>
                {items.map((product) => (
                    <Grid item key={product.id} xs={12} sm={6} md={4} lg={3}>
                        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                            <CardMedia
                                component="img"
                                height="200"
                                image={product.thumbnail}
                                alt={product.title}
                                sx={{ objectFit: 'contain', p: 2, bgcolor: '#f5f5f5' }}
                            />
                            <CardContent sx={{ flexGrow: 1 }}>
                                <Typography gutterBottom variant="h6" component="div" noWrap>
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
                    </Grid>
                ))}
            </Grid>

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
