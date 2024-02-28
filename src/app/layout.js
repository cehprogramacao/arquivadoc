"use client"
import React from 'react';
import Header from '@/Components/Header/Header';
import './globals.css';
import { Poppins } from 'next/font/google';
import { usePathname } from 'next/navigation';
import { Provider } from 'react-redux';
import { store } from '@/store'; 

const inter = Poppins({ subsets: ['latin'], weight: '500' });

export default function RootLayout({ children }) {
  const pathname = usePathname();
  console.log(pathname);
  return (
    <html lang="pt-br">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>ArquivaDoc</title>
        <link rel="icon" type="image/x-icon" href="/image/favicon.ico"></link>
      </head>
      <body className={inter.className}>
        <Provider store={store}>
          {pathname !== "/login" && <Header />}
          {children}
        </Provider>
      </body>
    </html>
  );
}
