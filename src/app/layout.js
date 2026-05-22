/* eslint-disable @next/next/no-page-custom-font */
import "../index.scss";
import Head from "./head";
import { I18nProvider } from "./i18n/i18n-context";
import { detectLanguage } from "./i18n/server";

export default async function RootLayout({ children }) {
  const lng = await detectLanguage();

  return (
    <I18nProvider language={lng}>
      <html lang="en">
        <head>
          <Head/>
          <link rel="manifest" href="/manifest.json" />
          <link rel="apple-touch-icon" href="/2.png"></link>
          <meta name="theme-color" content="#fff" />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
          <link href="https://fonts.googleapis.com/css2?family=Rubik:ital,wght@0,300..900;1,300..900&display=swap" rel="stylesheet" />
          <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
          <script defer src="https://www.paypal.com/sdk/js?client-id=test"></script>
        </head>
        <body>{children}</body>
      </html>
    </I18nProvider>
  );
}
