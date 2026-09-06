/* eslint-disable @next/next/no-page-custom-font */
import Script from "next/script";

import "../index.scss";
import { I18nProvider } from "@/shared/i18n/i18n-context";
import { detectLanguage } from "@/shared/i18n/server";
import Providers from "./providers";

/* Metadata API en lugar del antiguo head.js, que era una convencion de Next
   13.0 retirada en la 13.2. Al convivir ambos mecanismos el documento salia
   con dos <title> y dos <link rel="icon">.

   El favicon no se declara aqui: Next genera la etiqueta automaticamente a
   partir de app/favicon.ico. */
export const metadata = {
  title: {
    default: "Marketplace Medicamentos",
    // Las paginas solo declaran su nombre: "Registrarse" -> "Registrarse | Suminia"
    template: "%s | Suminia",
  },
  description:
    "Marketplace B2B de medicamentos e insumos medicos para clinicas, hospitales, distribuidores y proveedores.",
  manifest: "/manifest.json",
  icons: {
    apple: "/2.png",
  },
};

export const viewport = {
  themeColor: "#fff",
};

export default async function RootLayout({ children }) {
  const lng = await detectLanguage();

  return (
    <I18nProvider language={lng}>
      <html lang={lng}>
        <head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
          <link href="https://fonts.googleapis.com/css2?family=Rubik:ital,wght@0,300..900;1,300..900&display=swap" rel="stylesheet" />
          <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
        </head>
        <body suppressHydrationWarning>
          <Providers>{children}</Providers>
          <Script src="https://www.paypal.com/sdk/js?client-id=test" strategy="lazyOnload" />
        </body>
      </html>
    </I18nProvider>
  );
}
