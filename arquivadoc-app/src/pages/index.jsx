import React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import LoginPage from './login';

export default function Home() {
  const theme = createTheme({
    palette: {
      primary: {
        main: '#1976D2',
      },
    },
    typography: {
      fontWeightBold: 700,
    },
    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 960,
        lg: 1280,
        xl: 1920,
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LoginPage />
    </ThemeProvider>
  );
}
