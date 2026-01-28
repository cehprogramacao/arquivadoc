"use client"
import { Roboto } from 'next/font/google';
import { createTheme } from '@mui/material/styles';
import { red } from '@mui/material/colors';

export const roboto = Roboto({
    weight: ['300', '400', '500', '700'],
    subsets: ['latin'],
    display: 'swap',
    fallback: ['sans-serif'],
});

// Create a theme instance.
const theme = createTheme({
    palette: {
        primary: {
            white: "#fff",
            main: '#247117',
        },
        secondary: {
            main: '#247117',
            white: "#fff"
        },
        cian: {
            main: '#59d9f8',
        },
        error: {
            main: red.A400,
        },
        orange: { main: '#ff9b30' },
        background: {
            header: '#247117',
            primary: '#247117',
            secondary: "#fff",
            yellow: "#FFC117",
            orange: '#ed6c02'
        },
        grey: {
            main: 'rgba( 0, 0, 0, 0.7 )',
        },
        text: {
            primary: '#000', // White text for dark backgrounds
            secondary: '#C7C7C7', // Black text for light backgrounds,
            white: '#fff'

        },
    },
    typography: {
        allVariants: {
            color: '#000', // Set default text color for all variants
        },
        fontFamily: 'Roboto, sans-serif',
        h2: {
            color: 'rgba(18, 25, 38, 1)',
            lineHeight: 1.2,
            fontWeight: 700,
            fontSize: '2rem',
        },
        table: {
            textOverflow: 'ellipsis',
            overflow: 'hidden',
            fontSize: '0.7rem',
        },
        h1: {},
        h3: {
            color: '#FFFFFF',
        },
        h5: {
            color: '#FFFFFF',
        },
        tooltip: {
            color: 'rgba( 0, 0, 0, 0.7 )',
            fontSize: '0.8rem',
            display: 'flex',
            alignItems: 'center',
        },
        subtitle: {
            fontSize: '0.75rem',
            lineHeight: '1rem',
        },
        subtitle1: {
            fontSize: '0.7rem',
            lineHeight: '1rem',
            color: 'rgba( 0, 0, 0, 0.5 )',
        },
        body: {
            fontSize: '0.8rem',
            color: 'rgba( 0, 0, 0, 0.7 )',
        },
        body1: {
            fontSize: '0.8rem',
            color: 'rgba( 0, 0, 0, 0.7 )',
        },
        h7: {
            fontSize: '1.2rem',
            fontWeight: '500',
            color: 'rgba(18, 25, 38, 0.9)',
        },
        link: {
            fontSize: '0.8rem',
            color: '#0000ee',
            textDecorationLine: 'inherit',
        },
        color: '#000',
        fontFamily: 'Roboto, sans-serif',
    },
});
// theme.components = componentStyleOverrides();

export default theme;
