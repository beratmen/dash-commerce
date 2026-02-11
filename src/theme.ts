'use client';
import { createTheme, alpha } from '@mui/material/styles';

// DASH COMMERCE THEME
// Modern, clean, and professional Teal & Slate palette.

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#0d9488', // Teal 600
      light: '#14b8a6', // Teal 500
      dark: '#0f766e',  // Teal 700
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#0f172a', // Slate 900
      light: '#334155', // Slate 700
      dark: '#020617', // Slate 950
      contrastText: '#ffffff',
    },
    success: {
      main: '#10b981', // Emerald 500
    },
    error: {
      main: '#ef4444', // Red 500
    },
    warning: {
      main: '#f59e0b', // Amber 500
    },
    info: {
      main: '#3b82f6', // Blue 500
    },
    background: {
      default: '#f8fafc', // Slate 50
      paper: '#ffffff',
    },
    text: {
      primary: '#0f172a', // Slate 900
      secondary: '#64748b', // Slate 500
    },
  },
  typography: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif',
    h1: { fontWeight: 900, letterSpacing: '-0.03em', fontSize: '2.5rem', color: '#0f172a' },
    h2: { fontWeight: 800, letterSpacing: '-0.02em', fontSize: '2rem', color: '#0f172a' },
    h3: { fontWeight: 800, letterSpacing: '-0.02em', fontSize: '1.75rem', color: '#0f172a' },
    h4: { fontWeight: 700, letterSpacing: '-0.01em', fontSize: '1.5rem', color: '#0f172a' },
    h5: { fontWeight: 700, fontSize: '1.25rem', color: '#0f172a' },
    h6: { fontWeight: 700, fontSize: '1rem', color: '#0f172a' },
    body1: { fontWeight: 500, fontSize: '1rem', lineHeight: 1.6, color: '#334155' },
    body2: { fontWeight: 500, fontSize: '0.875rem', lineHeight: 1.6, color: '#475569' },
    button: { textTransform: 'none', fontWeight: 700, letterSpacing: '0.5px' },
    caption: { fontWeight: 600, fontSize: '0.75rem', letterSpacing: '0.5px', color: '#64748b' },
  },
  shape: {
    borderRadius: 16, // More rounded, modern look
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#f8fafc',
          scrollBehavior: 'smooth',
        },
        '*::-webkit-scrollbar': {
          width: '8px',
          height: '8px',
        },
        '*::-webkit-scrollbar-track': {
          backgroundColor: 'transparent',
        },
        '*::-webkit-scrollbar-thumb': {
          backgroundColor: '#cbd5e1',
          borderRadius: '4px',
          '&:hover': {
            backgroundColor: '#94a3b8',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          border: '1px solid rgba(226, 232, 240, 0.8)', // Slate 200
          backgroundColor: '#ffffff',
          borderRadius: 16,
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
            borderColor: '#0d9488', // Teal accent on hover
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12, // Slightly less rounded than cards
          padding: '10px 24px',
          fontSize: '0.9rem',
          fontWeight: 700,
          boxShadow: 'none',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-1px)',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          },
          '&:active': {
            transform: 'translateY(0)',
          }
        },
        contained: {
          background: 'linear-gradient(135deg, #0d9488 0%, #0f766e 100%)', // Teal Gradient
          '&:hover': {
            background: 'linear-gradient(135deg, #14b8a6 0%, #115e59 100%)',
            boxShadow: '0 10px 15px -3px rgba(13, 148, 136, 0.3)',
          }
        },
        outlined: {
          borderColor: '#e2e8f0',
          color: '#0f172a',
          '&:hover': {
            borderColor: '#0d9488',
            backgroundColor: 'rgba(13, 148, 136, 0.05)',
            color: '#0d9488',
          }
        }
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            backgroundColor: '#ffffff',
            transition: 'all 0.2s ease',
            '& fieldset': {
              borderColor: '#e2e8f0',
            },
            '&:hover fieldset': {
              borderColor: '#cbd5e1',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#0d9488',
              borderWidth: 2,
            },
            '&.Mui-focused': {
              boxShadow: '0 0 0 4px rgba(13, 148, 136, 0.1)',
            }
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          borderRadius: 8,
          fontSize: '0.75rem',
        },
        filled: {
          backgroundColor: '#f1f5f9', // Slate 100
          color: '#475569', // Slate 600
          '&:hover': {
            backgroundColor: '#e2e8f0',
          }
        },
        colorPrimary: {
          backgroundColor: 'rgba(13, 148, 136, 0.1)',
          color: '#0d9488',
          '&:hover': {
            backgroundColor: 'rgba(13, 148, 136, 0.2)',
          }
        }
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: alpha('#ffffff', 0.9),
          backdropFilter: 'blur(16px)',
          color: '#0f172a',
          boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
          borderBottom: '1px solid #f1f5f9',
        },
      },
    },
    MuiPagination: {
      styleOverrides: {
        root: {
          '& .MuiPaginationItem-root': {
            fontWeight: 600,
            borderRadius: 8,
            '&.Mui-selected': {
              background: '#0f172a', // Slate 900 for active page
              color: '#ffffff',
              '&:hover': {
                background: '#1e293b',
              }
            }
          }
        }
      }
    },
  },
});

export default theme;
