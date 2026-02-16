'use client'; // Client-side state (Redux) erişimi için gereklidir.

import { Container, Typography, Box, Button, Paper, Divider } from '@mui/material';
import { ArrowBack, Payment } from '@mui/icons-material';
import Link from 'next/link';
import { useAppSelector } from '@/store/hooks'; // Redux'tan veri çekmek için kullanılan hook
import { selectCartItems, selectCartTotalPrice, selectCartTotalQuantity } from '@/store/slices/cartSlice';

/**
 * CheckoutPage Component
 * Kullanıcının sipariş özetini gördüğü ve (demo olarak) ödeme yaptığı sayfa.
 */
export default function CheckoutPage() {
    // Redux store'dan sepet verilerini çekiyoruz
    const items = useAppSelector(selectCartItems); // Sepetteki ürünler
    const totalPrice = useAppSelector(selectCartTotalPrice); // Genel toplam
    const totalQuantity = useAppSelector(selectCartTotalQuantity); // Toplam ürün sayısı

    // SEPET BOŞSA: Ödeme yapılamayacağı için kullanıcıyı sepet sayfasına veya ürünlere yönlendir
    if (items.length === 0) {
        return (
            <Container maxWidth="md" sx={{ py: 6 }}>
                <Button component={Link} href="/cart" startIcon={<ArrowBack />} sx={{ mb: 4 }} color="inherit">Back to Cart</Button>
                <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 3, bgcolor: '#f8fafc' }}>
                    <Typography variant="h6" gutterBottom>Your cart is empty</Typography>
                    <Typography color="text.secondary" sx={{ mb: 3 }}>You must add products before checking out.</Typography>
                    <Button component={Link} href="/products" variant="contained">Browse Products</Button>
                </Paper>
            </Container>
        );
    }

    // SEPET DOLUYSA: Sipariş özetini ve demo ödeme alanını göster
    return (
        <Container maxWidth="md" sx={{ py: 6 }}>
            {/* Geri Dönüş Linki */}
            <Button component={Link} href="/cart" startIcon={<ArrowBack />} sx={{ mb: 4 }} color="inherit">Back to Cart</Button>
            
            {/* Sayfa Başlığı */}
            <Typography variant="h4" fontWeight="bold" color="primary" gutterBottom>Checkout</Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>Complete your order</Typography>

            {/* SİPARİŞ ÖZETİ PANELI */}
            <Paper sx={{ p: 4, borderRadius: 3, mb: 3 }}>
                <Typography variant="h6" fontWeight="700" gutterBottom>Order Summary</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>{totalQuantity} Products</Typography>
                
                {/* Ürünleri Listele: Her satırda ürün adı, miktar ve o ürünün toplam fiyatı */}
                {items.map((item) => (
                    <Box key={item.productId} display="flex" justifyContent="space-between" alignItems="center" py={1}>
                        <Typography variant="body2">{item.title} × {item.quantity}</Typography>
                        <Typography variant="body2" fontWeight="600">${(item.price * item.quantity).toFixed(2)}</Typography>
                    </Box>
                ))}
                
                <Divider sx={{ my: 2 }} />
                
                {/* GENEL TOPLAM */}
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6" fontWeight="700">Total Amount</Typography>
                    <Typography variant="h5" color="primary" fontWeight="bold">${totalPrice.toFixed(2)}</Typography>
                </Box>
            </Paper>

            {/* ÖDEME YÖNTEMİ (DEMO) */}
            <Paper sx={{ p: 3, borderRadius: 3, bgcolor: '#f8fafc' }}>
                <Typography variant="subtitle1" fontWeight="600" gutterBottom>Payment Method</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    This is a demo application. In real projects, systems like Stripe, PayPal, or iyzico would be integrated here.
                </Typography>
                
                {/* Ödeme Butonu (Demo amaçlı disabled bırakılmıştır) */}
                <Button variant="contained" size="large" fullWidth startIcon={<Payment />} sx={{ py: 1.5, borderRadius: 2, fontWeight: 'bold', textTransform: 'none' }} disabled>
                    Pay ${totalPrice.toFixed(2)} (Demo)
                </Button>
            </Paper>
        </Container>
    );
}
