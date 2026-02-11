'use client';
import { AppBar, Toolbar, Typography, Container, Box } from '@mui/material';
import { ShoppingBag } from '@mui/icons-material';
import Link from 'next/link';

export default function Navigation() {

    return (
        <>
            {/* APPBAR: Üst barın ana kapsayıcısı */}
            <AppBar
                position="sticky"
                color="inherit"
                elevation={0}
                sx={{
                    backgroundColor: 'rgba(255, 255, 255, 0.8)', // Yarı saydam beyaz
                    backdropFilter: 'blur(12px)',               // Cam efekti (Buzlu cam)
                    borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                    transition: 'all 0.3s ease'
                }}
            >
                <Container maxWidth="xl">
                    <Toolbar disableGutters sx={{ height: 70, justifyContent: 'space-between' }}>

                        {/* LOGO BÖLÜMÜ */}
                        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 12 }}>
                            {/* Kare Logo Kutusu */}
                            <Box
                                sx={{
                                    width: 48, height: 48,
                                    background: 'linear-gradient(135deg, #0d9488 0%, #115e59 100%)', // Teal gradyan
                                    borderRadius: 2.5,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: 'white',
                                    boxShadow: '0 4px 12px rgba(13, 148, 136, 0.3)',
                                    '&:hover': { transform: 'translateY(-2px)' } // Üzerine gelince yukarı zıplama
                                }}
                            >
                                <ShoppingBag fontSize="medium" />
                            </Box>
                            {/* Logo Metni */}
                            <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                                <Typography variant="h6" sx={{ fontWeight: 900, letterSpacing: '-0.5px', color: '#0f172a' }}>
                                    DASH-COMMERCE
                                </Typography>
                                <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>
                                    Premium Dashboard
                                </Typography>
                            </Box>
                        </Link>

                        <Box flex={1} />

                    </Toolbar>
                </Container>
            </AppBar>
        </>
    );
}