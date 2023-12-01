"use client"
import Header from '@/Components/Header/Header';
import './globals.css';
import { Poppins } from 'next/font/google';
import { useEffect, useState } from 'react';

const inter = Poppins({ subsets: ['latin'], weight: '500' });

export default function RootLayout({ children }) {
  const [hideHeader, setHideHeader] = useState(false);

  // Defina uma array de caminhos de página onde você deseja ocultar o cabeçalho
  const pagesWithoutHeader = ['/', '/login']; // Inclua tanto a raiz quanto a página de login

  useEffect(() => {
    // Verifique se a página está no lado do cliente antes de usar o router
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      // Verifique se a página atual está na array
      setHideHeader(pagesWithoutHeader.includes(path));
    }
  }, []);

  return (
    <html lang="pt-br">
      <body className={inter.className}>
        {!hideHeader && <Header />}
        {children}
      </body>
    </html>
  );
}
