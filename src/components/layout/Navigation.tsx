'use client';

import { AppBar, Toolbar, Typography, Container, Box, IconButton, Badge } from '@mui/material';
import { LocalMall, ShoppingCart } from '@mui/icons-material';
import { styled, alpha } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import debounce from 'lodash.debounce';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setSearchQuery } from '@/store/slices/uiSlice';
import { selectCartTotalQuantity } from '@/store/slices/cartSlice';
import { useMemo } from 'react';
import Link from 'next/link';

const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.black, 0.05),
    '&:hover': { backgroundColor: alpha(theme.palette.common.black, 0.08) },
    margin: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: { width: 'auto' },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: theme.palette.text.secondary,
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1.5, 1, 1.5, 0), // Daha kalın (yüksek)
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        width: '100%',
        fontSize: '1rem', // Yazı boyutu
        [theme.breakpoints.up('md')]: { width: '60ch' }, // Daha uzun (geniş)
    },
}));

export default function Navigation() {
    const dispatch = useAppDispatch();
    const cartQuantity = useAppSelector(selectCartTotalQuantity);

    const handleSearchChange = useMemo(
        () =>
            debounce((event: React.ChangeEvent<HTMLInputElement>) => {
                dispatch(setSearchQuery(event.target.value));
            }, 500),
        [dispatch]
    );

    return (
        <>
            {/* APPBAR: Üst barın ana kapsayıcısı */}
            <AppBar
            position="sticky"
            color="inherit"
            elevation={0}
            sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.8)', // Yarı saydam beyaz
                backdropFilter: 'blur(12px)', // Cam efekti (Buzlu cam)
                borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                transition: 'all 0.3s ease',
            }}
        >
            <Container maxWidth="xl">
                <Toolbar disableGutters sx={{ height: 88, justifyContent: 'space-between' }}>
                    {/* LOGO BÖLÜMÜ */}
                    <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 12 }}>
                        <Box
                            sx={{
                                width: 48,
                                height: 48,
                                background: 'linear-gradient(135deg, #0d9488 0%, #115e59 100%)', // Site Teması (Teal)
                                borderRadius: 3,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                boxShadow: '0 4px 12px rgba(13, 148, 136, 0.3)',
                                '&:hover': { transform: 'rotate(12deg)' }, // Dönme efekti
                            }}
                        >
                            <LocalMall fontSize="medium" />
                        </Box>
                        {/* Logo Metni */}
                        <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                            <Typography
                                variant="h6"
                                sx={{
                                    fontWeight: 800,
                                    letterSpacing: '1px',
                                    color: '#1e293b',
                                    fontFamily: 'monospace', // Yazı şekli değişikliği
                                }}
                            >
                                DASH-COMMERCE
                            </Typography>
                            <Typography
                                variant="caption"
                                sx={{ color: '#64748b', fontWeight: 500, letterSpacing: '0.5px' }}
                            >
                                PREMIUM STORE
                            </Typography>
                        </Box>
                    </Link>

                    <Box sx={{ flexGrow: 1 }} />

                    {/* SEARCH BAR (ORTA) */}
                    <Search>
                        <SearchIconWrapper>
                            <SearchIcon />
                        </SearchIconWrapper>
                        <StyledInputBase
                            placeholder="Search products..."
                            inputProps={{ 'aria-label': 'search' }}
                            onChange={handleSearchChange}
                        />
                    </Search>

                    <Box sx={{ flexGrow: 1 }} />

                    {/* SEPET */}
                    <Link href="/cart" aria-label="Cart" style={{ display: 'flex', alignItems: 'center' }}>
                        <IconButton sx={{ ml: 1, color: 'primary.main' }}>
                            <Badge badgeContent={cartQuantity} color="primary">
                                <ShoppingCart />
                            </Badge>
                        </IconButton>
                    </Link>
                </Toolbar>
            </Container>
        </AppBar>
        </>
    );
}
