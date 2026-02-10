'use client';
import { createTheme, alpha } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#4338ca', // Indigo 700
      light: '#6366f1',
      dark: '#312e81',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#7c3aed', // Purple 600
    },
    success: {
      main: '#10b981',
    },
    error: {
      main: '#ef4444',
    },
    warning: {
      main: '#f59e0b',
    },
    info: {
      main: '#3b82f6',
    },
    background: {
      default: '#f9fafb', // Gray 50
      paper: '#ffffff',
    },
    text: {
      primary: '#1f2937', // Gray 800
      secondary: '#6b7280', // Gray 500
    },
  },
  typography: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif',
    h1: { fontWeight: 900, letterSpacing: '-0.03em', fontSize: '2.25rem' },
    h2: { fontWeight: 800, letterSpacing: '-0.02em', fontSize: '1.875rem' },
    h3: { fontWeight: 800, letterSpacing: '-0.01em', fontSize: '1.5rem' },
    h4: { fontWeight: 700, letterSpacing: '-0.01em', fontSize: '1.25rem' },
    h5: { fontWeight: 700, fontSize: '1.125rem' },
    h6: { fontWeight: 700, fontSize: '1rem' },
    body1: { fontWeight: 500, fontSize: '1rem', lineHeight: 1.6 },
    body2: { fontWeight: 500, fontSize: '0.875rem', lineHeight: 1.6 },
    button: { textTransform: 'none', fontWeight: 700, letterSpacing: '0.5px' },
    caption: { fontWeight: 600, fontSize: '0.75rem', letterSpacing: '0.5px' },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#f9fafb',
          scrollBehavior: 'smooth',
          scrollPaddingTop: '80px',
        },
        '*::-webkit-scrollbar': {
          width: '8px',
          height: '8px',
        },
        '*::-webkit-scrollbar-track': {
          backgroundColor: 'transparent',
        },
        '*::-webkit-scrollbar-thumb': {
          backgroundColor: '#d1d5db',
          borderRadius: '4px',
          '&:hover': {
            backgroundColor: '#9ca3af',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          border: '1px solid rgba(0, 0, 0, 0.05)',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(8px)',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
            borderColor: 'rgba(67, 56, 202, 0.2)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '10px 28px',
          fontSize: '0.9rem',
          fontWeight: 700,
          boxShadow: 'none',
          transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
          '&:hover': {
            boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
            transform: 'translateY(-2px)',
          },
          '&:active': {
            transform: 'translateY(0)',
          }
        },
        contained: {
          background: 'linear-gradient(135deg, #4338ca 0%, #7c3aed 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #4338ca 0%, #7c3aed 100%)',
            boxShadow: '0 12px 24px rgba(67, 56, 202, 0.3)',
          }
        },
        outlined: {
          borderColor: 'rgba(67, 56, 202, 0.3)',
          color: '#4338ca',
          '&:hover': {
            borderColor: '#4338ca',
            backgroundColor: 'rgba(67, 56, 202, 0.05)',
          }
        }
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 10,
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(4px)',
            transition: 'all 0.3s ease',
            '& fieldset': {
              borderColor: 'rgba(0, 0, 0, 0.08)',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(67, 56, 202, 0.2)',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#4338ca',
              borderWidth: 2,
            },
            '&.Mui-focused': {
              boxShadow: '0 0 0 3px rgba(67, 56, 202, 0.1)',
            }
          },
          '& .MuiOutlinedInput-input': {
            fontSize: '0.95rem',
            fontWeight: 500,
          }
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          borderRadius: 8,
          fontSize: '0.75rem',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          }
        },
        filled: {
          backgroundColor: 'rgba(67, 56, 202, 0.1)',
          color: '#4338ca',
        }
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: alpha('#ffffff', 0.85),
          backdropFilter: 'blur(12px)',
          color: '#1f2937',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
          transition: 'all 0.3s ease',
        },
      },
    },
    MuiPagination: {
      styleOverrides: {
        root: {
          '& .MuiPaginationItem-root': {
            fontWeight: 600,
            transition: 'all 0.3s ease',
            borderRadius: 8,
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            }
          },
          '& .MuiPaginationItem-page.Mui-selected': {
            background: 'linear-gradient(135deg, #4338ca 0%, #7c3aed 100%)',
          }
        }
      }
    },
    MuiCircularProgress: {
      styleOverrides: {
        root: {
          color: '#4338ca',
        }
      }
    },
    MuiRating: {
      styleOverrides: {
        root: {
          color: '#fbbf24',
        }
      }
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
          '&:hover': {
            transform: 'scale(1.1)',
          }
        }
      }
    }
  },
});

export default theme;
