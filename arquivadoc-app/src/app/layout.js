"use client"
import React, { useEffect, useState } from 'react';
import Header from '@/Components/Header/Header';
import './globals.css';
import { Poppins } from 'next/font/google';

const inter = Poppins({ subsets: ['latin'], weight: '500' });

export default function RootLayout({ children }) {
  const [hideHeader, setHideHeader] = useState(false);
  const pagesWithoutHeader = ['/', '/login'];

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      setHideHeader(pagesWithoutHeader.includes(path));
    }
  }, []);

  return (
    <html lang="pt-br">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>ArquivaDoc</title>
        <link rel="icon" type="image/x-icon" href="/image/favicon.ico"></link>
      </head>
      <body className={inter.className}>
        {!hideHeader && <Header />}
        {children}
      </body>
    </html>
  );
}
