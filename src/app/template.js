'use client';
import styled from '@emotion/styled';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box } from '@mui/material';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { store } from '@/store';
import React, { useEffect, Suspense } from 'react';
import { CLOSE_ALERT, SET_LOGIN_DATA } from '@/store/actions';

import theme from '@/theme/theme';
import { AuthProvider } from '@/context';
import { usePathname } from 'next/navigation';
import Header from '@/Components/Header/Header';

export default function Template({ children, pageProps }) {
    const pathname = usePathname();
    return (
        <Provider store={store}>
            <ThemeProvider theme={theme}>
                <AuthProvider>
                    <CssBaseline />
                    {pathname !== "/" && <Header {...pageProps} />}
                    {children}
                </AuthProvider>
            </ThemeProvider>
        </Provider>
    );
}