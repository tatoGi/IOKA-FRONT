// pages/_document.js
import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Preload critical fonts */}
        <link
          rel="preload"
          href="/fonts/Montserrat-VariableFont_wght.ttf"
          as="font"
          type="font/ttf"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/felixtitlingmt.ttf"
          as="font"
          type="font/ttf"
          crossOrigin="anonymous"
        />

        {/* Add font-face declarations with font-display: swap */}
        <style jsx global>{`
          @font-face {
            font-family: 'Montserrat';
            src: url('/fonts/Montserrat-VariableFont_wght.ttf') format('truetype-variations');
            font-weight: 100 900;
            font-style: normal;
            font-display: swap;
            ascent-override: 90%;
            descent-override: 20%;
            line-gap-override: normal;
          }

          @font-face {
            font-family: 'Felix Titling';
            src: url('/fonts/felixtitlingmt.ttf') format('truetype');
            font-weight: normal;
            font-style: normal;
            font-display: swap;
            ascent-override: 90%;
            descent-override: 20%;
            line-gap-override: normal;
          }

          /* Add font metric overrides to prevent layout shift */
          :root {
            --font-montserrat-ascent: 90%;
            --font-montserrat-descent: 20%;
            --font-montserrat-line-gap: normal;
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