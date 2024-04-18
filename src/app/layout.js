"use client"
import React from 'react';
import Header from '@/Components/Header/Header';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter'
import './globals.css';
import { Poppins } from 'next/font/google';
import { usePathname } from 'next/navigation';
import { Provider } from 'react-redux';
import { store } from '@/store';
import { ThemeProvider } from '@mui/material/styles'
import theme from '@/theme/theme';
import withAuth from '@/utils/withAuth';
import { AuthProvider } from '@/context';

const inter = Poppins({ subsets: ['latin'], weight: '500' });

const RootLayout = ({ children }) => {
  const pathname = usePathname();
  return (
    <html lang="pt-br">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" type="image/x-icon" href="/image/favicon.ico"></link>
        <script src="https://cdn.asprise.com/scannerjs/scanner.js" type="text/javascript"></script>
      </head>
      <body className={inter.className}>
          <ThemeProvider theme={theme}>
            <Provider store={store}>
              <AuthProvider >
                {pathname !== "/login" && <Header />}
                {children}
              </AuthProvider>
            </Provider>
          </ThemeProvider>
      </body>
    </html>
  );
}

export default withAuth(RootLayout)