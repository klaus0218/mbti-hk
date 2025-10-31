import { createTheme } from '@mui/material/styles';

const muiTheme = createTheme({
  palette: {
    primary: {
      main: '#60a5fa', // Light blue
      light: '#93c5fd',
      dark: '#3b82f6',
    },
    secondary: {
      main: '#f0abfc', // Soft pink
      light: '#f5d0fe',
      dark: '#e879f9',
    },
    error: {
      main: '#f87171', // Softer red
    },
    warning: {
      main: '#fbbf24', // Softer amber
    },
    info: {
      main: '#60a5fa', // Matching primary
    },
    success: {
      main: '#34d399', // Softer green
    },
  },
  typography: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    h1: {
      fontSize: '3rem',
      fontWeight: 700,
    },
    h2: {
      fontSize: '2.25rem',
      fontWeight: 600,
    },
    h3: {
      fontSize: '1.875rem',
      fontWeight: 600,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        },
      },
    },
  },
});

export default muiTheme; 
