import type { Metadata } from "next";
import { Geist, Geist_Mono, Newsreader } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const newsreader = Newsreader({ variable: "--font-editorial", subsets: ["latin"] });

/**
 * URL pública del sitio. Sirve para que Next resuelva a URLs absolutas las rutas
 * relativas de metadata — la imagen de Open Graph y el canonical.
 * Es un dominio fijo, así que va aquí y no en una variable de entorno.
 */
const siteUrl = "https://nitora.online";

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
  icons: { icon: "/favicon.svg" },
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
      </body>
    </html>
  );
}
