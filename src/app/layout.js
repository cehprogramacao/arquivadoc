import React from 'react';
import { Poppins } from 'next/font/google';
import withAuth from '@/utils/withAuth';

const inter = Poppins({ subsets: ['latin'], weight: '500' });

export const metadata = {
  title: 'ArquivaDoc | Login',
};

const RootLayout = ({ children }) => {

 

  return (
    <html lang="pt-br">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" type="image/x-icon" href="/image/favicon.ico"></link>
        <script src="https://cdn.asprise.com/scannerjs/scanner.js" type="text/javascript"></script>
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}

export default RootLayout