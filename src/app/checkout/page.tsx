'use client';

import { Container, Typography, Box, Button, Paper, Divider } from '@mui/material';
import { ArrowBack, Payment } from '@mui/icons-material';
import Link from 'next/link';
import { useAppSelector } from '@/store/hooks';
import { selectCartItems, selectCartTotalPrice, selectCartTotalQuantity } from '@/store/slices/cartSlice';

export default function CheckoutPage() {
    const items = useAppSelector(selectCartItems);
    const totalPrice = useAppSelector(selectCartTotalPrice);
    const totalQuantity = useAppSelector(selectCartTotalQuantity);

    if (items.length === 0) {
        return (
            <Container maxWidth="md" sx={{ py: 6 }}>
                <Button component={Link} href="/cart" startIcon={<ArrowBack />} sx={{ mb: 4 }} color="inherit">Back to Cart</Button>
                <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 3, bgcolor: '#f8fafc' }}>
                    <Typography variant="h6" gutterBottom>Your cart is empty</Typography>
                    <Typography color="text.secondary" sx={{ mb: 3 }}>Add products to your cart before checkout.</Typography>
                    <Button component={Link} href="/products" variant="contained">Browse Products</Button>
                </Paper>
            </Container>
        );
    }

    return (
        <Container maxWidth="md" sx={{ py: 6 }}>
            <Button component={Link} href="/cart" startIcon={<ArrowBack />} sx={{ mb: 4 }} color="inherit">Back to Cart</Button>
            <Typography variant="h4" fontWeight="bold" color="primary" gutterBottom>Payment</Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>Complete your order</Typography>

            <Paper sx={{ p: 4, borderRadius: 3, mb: 3 }}>
                <Typography variant="h6" fontWeight="700" gutterBottom>Order summary</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>{totalQuantity} item{totalQuantity !== 1 ? 's' : ''}</Typography>
                {items.map((item) => (
                    <Box key={item.productId} display="flex" justifyContent="space-between" alignItems="center" py={1}>
                        <Typography variant="body2">{item.title} × {item.quantity}</Typography>
                        <Typography variant="body2" fontWeight="600">${(item.price * item.quantity).toFixed(2)}</Typography>
                    </Box>
                ))}
                <Divider sx={{ my: 2 }} />
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6" fontWeight="700">Total</Typography>
                    <Typography variant="h5" color="primary" fontWeight="bold">${totalPrice.toFixed(2)}</Typography>
                </Box>
            </Paper>

            <Paper sx={{ p: 3, borderRadius: 3, bgcolor: '#f8fafc' }}>
                <Typography variant="subtitle1" fontWeight="600" gutterBottom>Payment method</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>This is a demo. Integrate your preferred payment provider (Stripe, PayPal, etc.) here.</Typography>
                <Button variant="contained" size="large" fullWidth startIcon={<Payment />} sx={{ py: 1.5, borderRadius: 2, fontWeight: 'bold', textTransform: 'none' }} disabled>
                    Pay ${totalPrice.toFixed(2)} (Demo)
                </Button>
            </Paper>
        </Container>
    );
}
