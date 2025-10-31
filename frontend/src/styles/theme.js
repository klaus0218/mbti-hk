import styled, { createGlobalStyle } from 'styled-components';

// Color palette inspired by modern MBTI designs
export const theme = {
  colors: {
    primary: '#60a5fa', // Light blue
    primaryLight: '#93c5fd',
    primaryDark: '#3b82f6',
    secondary: '#f0abfc', // Soft pink
    secondaryLight: '#f5d0fe',
    secondaryDark: '#e879f9',
    accent: '#67e8f9', // Soft cyan
    accentLight: '#a5f3fc',
    accentDark: '#22d3ee',
    
    // Neutrals (keeping these the same for good contrast)
    white: '#ffffff',
    gray50: '#f9fafb',
    gray100: '#f3f4f6',
    gray200: '#e5e7eb',
    gray300: '#d1d5db',
    gray400: '#9ca3af',
    gray500: '#6b7280',
    gray600: '#4b5563',
    gray700: '#374151',
    gray800: '#1f2937',
    gray900: '#111827',
    black: '#000000',
    
    // Status colors (slightly softened)
    success: '#34d399', // Softer green
    warning: '#fbbf24', // Softer amber
    error: '#f87171', // Softer red
    info: '#60a5fa', // Matching primary
    
    // Background gradients
    gradientPrimary: 'linear-gradient(135deg, #60a5fa 0%, #f0abfc 100%)',
    gradientSecondary: 'linear-gradient(135deg, #67e8f9 0%, #60a5fa 100%)',
    gradientLight: 'linear-gradient(135deg, #f9fafb 0%, #e5e7eb 100%)',
  },
  
  typography: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    headingFamily: '"Inter", sans-serif',
    
    // Font weights
    light: 300,
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
    
    // Font sizes
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem', // 36px
    '5xl': '3rem',    // 48px
    '6xl': '3.75rem', // 60px
  },
  
  spacing: {
    xs: '0.25rem',   // 4px
    sm: '0.5rem',    // 8px
    md: '1rem',      // 16px
    lg: '1.5rem',    // 24px
    xl: '2rem',      // 32px
    '2xl': '3rem',   // 48px
    '3xl': '4rem',   // 64px
    '4xl': '5rem',   // 80px
    '5xl': '6rem',   // 96px
  },
  
  borderRadius: {
    none: '0',
    sm: '0.125rem',  // 2px
    md: '0.375rem',  // 6px
    lg: '0.5rem',    // 8px
    xl: '0.75rem',   // 12px
    '2xl': '1rem',   // 16px
    full: '9999px',
  },
  
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
  },
  
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
  
  zIndex: {
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    backdrop: 1040,
    modal: 1050,
    popover: 1060,
    tooltip: 1070,
  },
  
  transitions: {
    default: 'all 0.2s ease-in-out',
    fast: 'all 0.1s ease-in-out',
    slow: 'all 0.3s ease-in-out',
  },
};

export const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  html {
    font-size: 16px;
    scroll-behavior: smooth;
    height: 100%;
    width: 100%;
    -webkit-overflow-scrolling: touch;
    overflow-x: hidden !important;
    margin: 0;
    padding: 0;
  }
  
  body {
    font-family: ${({ theme }) => theme.typography.fontFamily};
    font-weight: ${({ theme }) => theme.typography.regular};
    line-height: 1.6;
    color: ${({ theme }) => theme.colors.gray900};
    background-color: ${({ theme }) => theme.colors.white};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    /* Fix mobile scrolling and prevent horizontal overflow */
    -webkit-overflow-scrolling: touch;
    overflow-x: hidden !important;
    overflow-y: scroll !important;
    width: 100vw;
    max-width: 100%;
    /* Removed position: relative to fix fixed positioning */
    min-height: 100vh;
    min-height: -webkit-fill-available;
    margin: 0;
    padding: 0;
  }
  
  h1, h2, h3, h4, h5, h6 {
    font-family: ${({ theme }) => theme.typography.headingFamily};
    font-weight: ${({ theme }) => theme.typography.semibold};
    line-height: 1.2;
    margin-bottom: ${({ theme }) => theme.spacing.md};
  }
  
  h1 {
    font-size: ${({ theme }) => theme.typography['4xl']};
    font-weight: ${({ theme }) => theme.typography.bold};
    
    @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
      font-size: ${({ theme }) => theme.typography['3xl']};
    }
  }
  
  h2 {
    font-size: ${({ theme }) => theme.typography['3xl']};
    
    @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
      font-size: ${({ theme }) => theme.typography['2xl']};
    }
  }
  
  h3 {
    font-size: ${({ theme }) => theme.typography['2xl']};
    
    @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
      font-size: ${({ theme }) => theme.typography.xl};
    }
  }
  
  h4 {
    font-size: ${({ theme }) => theme.typography.xl};
  }
  
  h5 {
    font-size: ${({ theme }) => theme.typography.lg};
  }
  
  h6 {
    font-size: ${({ theme }) => theme.typography.base};
    font-weight: ${({ theme }) => theme.typography.medium};
  }
  
  p {
    margin-bottom: ${({ theme }) => theme.spacing.md};
  }
  
  a {
    color: ${({ theme }) => theme.colors.primary};
    text-decoration: none;
    transition: ${({ theme }) => theme.transitions.default};
    
    &:hover {
      color: ${({ theme }) => theme.colors.primaryDark};
    }
  }
  
  button {
    cursor: pointer;
    border: none;
    outline: none;
    transition: ${({ theme }) => theme.transitions.default};
    
    &:disabled {
      cursor: not-allowed;
      opacity: 0.6;
    }
  }
  
  input, textarea, select {
    border: 1px solid ${({ theme }) => theme.colors.gray300};
    border-radius: ${({ theme }) => theme.borderRadius.md};
    padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
    font-family: inherit;
    font-size: ${({ theme }) => theme.typography.base};
    transition: ${({ theme }) => theme.transitions.default};
    
    &:focus {
      outline: none;
      border-color: ${({ theme }) => theme.colors.primary};
      box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary}20;
    }
  }
  
  img {
    max-width: 100%;
    height: auto;
  }
  
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }
  
  /* Root element fixes */
  #root {
    min-height: 100vh;
    min-height: -webkit-fill-available;
    overflow-x: hidden !important;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    width: 100vw;
    max-width: 100%;
    position: relative;
  }
  
  /* Fix for iOS Safari address bar */
  @supports (-webkit-touch-callout: none) {
    body {
      min-height: -webkit-fill-available;
    }
  }
  
  /* Enable mouse wheel scrolling globally */
  * {
    overscroll-behavior: auto;
  }
  
  /* Force scrolling behavior */
  html, body, #root {
    overflow-x: hidden !important;
    overflow-y: auto !important;
    overscroll-behavior: contain;
    scroll-behavior: smooth;
    max-width: 100vw;
  }
  
  /* Additional mobile scroll fixes */
  @media (max-width: 768px) {
    * {
      box-sizing: border-box;
    }
    
    html, body {
      width: 100vw !important;
      max-width: 100vw !important;
      overflow-x: hidden !important;
      /* Removed position: relative to fix fixed positioning on mobile */
    }
    
    body {
      /* Removed transform to fix fixed positioning on mobile */
      /* Enable momentum scrolling */
      -webkit-overflow-scrolling: touch;
      /* Ensure scrolling works */
      overflow-y: scroll !important;
      overflow-x: hidden !important;
      /* Fix viewport issues */
      width: 100vw;
      max-width: 100%;
      /* Enable touch scrolling */
      touch-action: pan-y;
      /* Prevent zoom on double tap */
      touch-action: manipulation;
    }
    
    #root {
      width: 100vw !important;
      max-width: 100vw !important;
      overflow-x: hidden !important;
      overflow-y: auto !important;
      -webkit-overflow-scrolling: touch;
      touch-action: pan-y;
    }
    
    /* Disable tap highlight */
    * {
      -webkit-tap-highlight-color: transparent;
      -webkit-touch-callout: none;
      -webkit-user-select: none;
      -khtml-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
    }
    
    /* Re-enable text selection for content */
    p, span, div:not([role="button"]), input, textarea {
      -webkit-user-select: text;
      -khtml-user-select: text;
      -moz-user-select: text;
      -ms-user-select: text;
      user-select: text;
    }
  }
  
  /* Force scrolling on responsive/mobile view in desktop browsers */
  @media (hover: none) and (pointer: coarse) {
    body, #root {
      overflow-y: scroll !important;
      -webkit-overflow-scrolling: touch;
    }
  }

  /* Custom scrollbar */
  ::-webkit-scrollbar {
    width: 8px;
  }
  
  ::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.gray100};
  }
  
  ::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.gray400};
    border-radius: ${({ theme }) => theme.borderRadius.full};
    
    &:hover {
      background: ${({ theme }) => theme.colors.gray500};
    }
  }
`;

// Common styled components
export const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.spacing.md};
  width: 100%;
  box-sizing: border-box;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: 0 ${({ theme }) => theme.spacing.sm};
    max-width: 100vw;
    overflow-x: hidden;
  }
`;

export const Section = styled.section`
  padding: ${({ theme }) => theme.spacing['4xl']} 0;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: ${({ theme }) => theme.spacing['3xl']} 0;
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: ${({ theme }) => theme.spacing['2xl']} 0;
  }
`;

export const Card = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  padding: ${({ theme }) => theme.spacing.xl};
  transition: ${({ theme }) => theme.transitions.default};
  
  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.xl};
    transform: translateY(-2px);
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: ${({ theme }) => theme.spacing.lg};
  }
`;

export const Button = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.xl};
  font-size: ${({ theme }) => theme.typography.base};
  font-weight: ${({ theme }) => theme.typography.medium};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  transition: ${({ theme }) => theme.transitions.default};
  min-height: 44px; /* Accessibility: minimum touch target */
  
  ${({ variant = 'primary', theme }) => {
    switch (variant) {
      case 'primary':
        return `
          background: ${theme.colors.gradientPrimary};
          color: ${theme.colors.white};
          box-shadow: ${theme.shadows.md};
          
          &:hover:not(:disabled) {
            transform: translateY(-1px);
            box-shadow: ${theme.shadows.lg};
          }
          
          &:active {
            transform: translateY(0);
          }
        `;
      case 'secondary':
        return `
          background: ${theme.colors.white};
          color: ${theme.colors.primary};
          border: 2px solid ${theme.colors.primary};
          
          &:hover:not(:disabled) {
            background: ${theme.colors.primary};
            color: ${theme.colors.white};
          }
        `;
      case 'outline':
        return `
          background: transparent;
          color: ${theme.colors.gray700};
          border: 1px solid ${theme.colors.gray300};
          
          &:hover:not(:disabled) {
            background: ${theme.colors.gray50};
            border-color: ${theme.colors.gray400};
          }
        `;
      case 'ghost':
        return `
          background: transparent;
          color: ${theme.colors.gray700};
          
          &:hover:not(:disabled) {
            background: ${theme.colors.gray100};
          }
        `;
      default:
        return '';
    }
  }}
  
  ${({ size = 'md', theme }) => {
    switch (size) {
      case 'sm':
        return `
          padding: ${theme.spacing.sm} ${theme.spacing.md};
          font-size: ${theme.typography.sm};
        `;
      case 'lg':
        return `
          padding: ${theme.spacing.lg} ${theme.spacing['2xl']};
          font-size: ${theme.typography.lg};
        `;
      default:
        return '';
    }
  }}
  
  ${({ fullWidth }) => fullWidth && `
    width: 100%;
  `}
`; 
