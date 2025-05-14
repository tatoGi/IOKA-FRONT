// pages/_document.js
import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Preconnect to Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Add Google Fonts with display=swap */}
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;700&display=swap&display=swap"
          rel="stylesheet"
          media="print"
          onLoad="this.media='all'"
        />
        
        {/* Add IcoMoon Free font with display=swap */}
        <link
          href="https://cdn.jsdelivr.net/npm/icomoon-free@1.0.0/fonts/icomoon-free.css"
          rel="stylesheet"
          media="print"
          onLoad="this.media='all'"
        />

        {/* Add font-display: swap to local fonts */}
        <style>{`
          @font-face {
            font-family: 'Montserrat';
            src: url('/fonts/Montserrat-Regular.ttf') format('truetype');
            font-display: swap;
          }
          @font-face {
            font-family: 'Montserrat';
            src: url('/fonts/Montserrat-SemiBold.ttf') format('truetype');
            font-weight: 600;
            font-display: swap;
          }
          @font-face {
            font-family: 'Montserrat';
            src: url('/fonts/Montserrat-VariableFont_wght.ttf') format('truetype-variations');
            font-display: swap;
          }
          @font-face {
            font-family: 'Felix Titling';
            src: url('/fonts/felixtitlingmt.ttf') format('truetype');
            font-display: swap;
          }
        `}</style>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}