import type { Metadata } from "next";
import { Geist, Geist_Mono, Newsreader } from "next/font/google";
import Script from "next/script";
import { siteUrl } from "./site";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const newsreader = Newsreader({ variable: "--font-editorial", subsets: ["latin"] });

/**
 * Medición. Sin `NEXT_PUBLIC_GA_ID` configurada en Vercel no se carga nada:
 * la página queda sin etiquetas y sin cookies de analítica.
 * Mientras esté vacía, el aviso de privacidad no debe declarar Google Analytics.
 */
const gaId = process.env.NEXT_PUBLIC_GA_ID;

const title = "Nítora | 3 decisiones en 5 días para hoteles independientes";
const description =
  "Margen Uno convierte exportaciones de reservas y canales en tres acciones priorizadas para proteger margen y liberar horas, sin tocar tu PMS.";
const ogTitle = "Tres decisiones para proteger margen y liberar horas";
const ogDescription =
  "Margen Uno de Nítora: diagnóstico para hoteles independientes en cinco días, sin integraciones ni migrar tu PMS.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  icons: { icon: "/favicon.svg", apple: "/apple-touch-icon.png" },
  alternates: { canonical: "/" },
  openGraph: {
    title: ogTitle,
    description: ogDescription,
    type: "website",
    locale: "es_MX",
    siteName: "Nítora",
    url: "/",
    images: [
      {
        url: "/og-nitora-v2.png",
        width: 1200,
        height: 630,
        alt: "Nítora — tres decisiones en cinco días para hoteles independientes",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: ogTitle,
    description: ogDescription,
    images: ["/og-nitora-v2.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body className={`${geistSans.variable} ${geistMono.variable} ${newsreader.variable}`}>
        {children}
        {gaId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script id="ga4" strategy="afterInteractive">
              {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${gaId}');`}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}
