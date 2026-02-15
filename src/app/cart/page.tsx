'use client';

import { Container, Typography, Box, Button, Paper, IconButton, useTheme, useMediaQuery, } from '@mui/material';
import { Add, Remove, Delete, ArrowBack, ShoppingCart, Payment } from '@mui/icons-material';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { selectCartItems, selectCartTotalPrice, selectCartTotalQuantity, updateQuantity, removeFromCart, } from '@/store/slices/cartSlice';

export default function CartPage() {
    const theme = useTheme();
    const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
    const dispatch = useAppDispatch();
    const items = useAppSelector(selectCartItems);
    const totalPrice = useAppSelector(selectCartTotalPrice);
    const totalQuantity = useAppSelector(selectCartTotalQuantity);

    const update = (productId: number, delta: number) =>
        dispatch(updateQuantity({ productId, quantity: items.find((i) => i.productId === productId)!.quantity + delta }));

    if (items.length === 0) {
        return (
            <Box sx={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', py: 8, px: 2 }}>
                <Container maxWidth="sm">
                    <Button component={Link} href="/products" startIcon={<ArrowBack />} sx={{ mb: 4 }} color="inherit">
                        Back to Products
                    </Button>
                    <Paper elevation={0} sx={{ p: 6, textAlign: 'center', borderRadius: 4, bgcolor: '#f8fafc', border: '1px solid', borderColor: 'divider' }}>
                        <Box sx={{ width: 80, height: 80, borderRadius: '50%', bgcolor: 'rgba(13,148,136,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2 }}>
                            <ShoppingCart sx={{ fontSize: 40, color: 'primary.main' }} />
                        </Box>
                        <Typography variant="h5" fontWeight="700" gutterBottom>Your cart is empty</Typography>
                        <Typography color="text.secondary" sx={{ mb: 3 }}>Discover products and add them here.</Typography>
                        <Button component={Link} href="/products" variant="contained" size="large">Browse Products</Button>
                    </Paper>
                </Container>
            </Box>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: { xs: 3, md: 6 }, pb: 8 }}>
            <Button component={Link} href="/products" startIcon={<ArrowBack />} sx={{ mb: 2 }} color="inherit">Back to Products</Button>
            <Box display="flex" flexWrap="wrap" alignItems="baseline" gap={2} sx={{ mb: 4 }}>
                <Typography variant="h4" fontWeight="800" sx={{ color: '#0f172a' }}>Cart</Typography>
                <Box component="span" sx={{ px: 1.5, py: 0.25, borderRadius: 2, bgcolor: 'primary.main', color: 'white', fontSize: '0.875rem', fontWeight: 700 }}>
                    {totalQuantity} item{totalQuantity !== 1 ? 's' : ''}
                </Box>
            </Box>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 380px' }, gap: 4, alignItems: 'start' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {items.map((item) => (
                        <Paper key={item.productId} elevation={0} sx={{ p: 2, borderRadius: 3, border: '1px solid', borderColor: 'rgba(226,232,240,0.9)', '&:hover': { borderColor: 'rgba(13,148,136,0.25)' } }}>
                            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, alignItems: { xs: 'stretch', sm: 'center' } }}>
                                <Box component="img" src={item.thumbnail} alt={item.title} sx={{ width: { xs: '100%', sm: 120 }, height: { xs: 160, sm: 120 }, objectFit: 'contain', borderRadius: 2, bgcolor: '#f8fafc' }} />
                                <Box sx={{ flex: 1, minWidth: 0 }}>
                                    <Typography variant="subtitle1" fontWeight="700" sx={{ color: '#0f172a', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{item.title}</Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>${item.price} each</Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mt: 2 }}>
                                        <Box sx={{ display: 'inline-flex', alignItems: 'center', borderRadius: 2, border: '1px solid', borderColor: '#e2e8f0', bgcolor: '#f8fafc' }}>
                                            <IconButton size="small" onClick={() => update(item.productId, -1)} aria-label="Decrease" sx={{ color: 'primary.main' }}><Remove fontSize="small" /></IconButton>
                                            <Typography variant="body1" fontWeight="700" sx={{ minWidth: 32, textAlign: 'center' }}>{item.quantity}</Typography>
                                            <IconButton size="small" onClick={() => update(item.productId, 1)} aria-label="Increase" sx={{ color: 'primary.main' }}><Add fontSize="small" /></IconButton>
                                        </Box>
                                        <IconButton color="error" size="small" onClick={() => dispatch(removeFromCart(item.productId))} aria-label="Remove" sx={{ ml: 'auto' }}><Delete fontSize="small" /></IconButton>
                                    </Box>
                                </Box>
                                <Box sx={{ textAlign: { xs: 'left', sm: 'right' } }}>
                                    <Typography variant="body2" color="text.secondary">Subtotal</Typography>
                                    <Typography variant="h6" fontWeight="800" color="primary.main">${(item.price * item.quantity).toFixed(2)}</Typography>
                                </Box>
                            </Box>
                        </Paper>
                    ))}
                </Box>

                <Paper elevation={0} sx={{ borderRadius: 3, overflow: 'hidden', border: '1px solid rgba(13,148,136,0.2)', ...(isDesktop && { position: 'sticky', top: 24 }) }}>
                    <Box sx={{ px: 3, py: 2.5, background: 'linear-gradient(135deg, rgba(13,148,136,0.1) 0%, rgba(15,118,110,0.05) 100%)', borderBottom: '1px solid rgba(13,148,136,0.15)' }}>
                        <Typography variant="overline" sx={{ color: 'primary.main', fontWeight: 700, letterSpacing: 1.2 }}>Order total</Typography>
                        <Typography variant="h3" component="p" sx={{ fontWeight: 800, color: 'primary.main', mt: 0.5 }}>${totalPrice.toFixed(2)}</Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>{totalQuantity} item{totalQuantity !== 1 ? 's' : ''} in cart</Typography>
                    </Box>
                    <Box sx={{ p: 3 }}>
                        <Button component={Link} href="/checkout" variant="contained" size="large" fullWidth startIcon={<Payment />} sx={{ py: 1.75, borderRadius: 2, fontWeight: 'bold', textTransform: 'none' }}>
                            Proceed to Payment
                        </Button>
                    </Box>
                </Paper>
            </Box>
        </Container>
    );
}
