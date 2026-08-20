import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Newsreader } from "next/font/google";
import Script from "next/script";
import {
  businessAddress,
  socialLinks,
  siteDescription,
  siteName,
  siteTagline,
  siteUrl,
  whatsapp,
} from "./site";
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

const title = "Nítora | Diagnóstico hotelero en cinco días";
const description =
  "Detecta qué consume horas y dónde puede diluirse el ingreso neto de tu hotel con un diagnóstico de distribución y reportería en cinco días, sin tocar tu PMS.";
const ogTitle = "Detecta qué consume horas y dónde puede diluirse tu ingreso neto";
const ogDescription =
  "Diagnóstico de distribución y reportería hotelera en cinco días, basado en exportaciones existentes y sin integraciones ni cambio de PMS.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: siteName,
  title: {
    default: title,
    template: "%s | Nítora",
  },
  description,
  keywords: [
    "diagnóstico hotelero",
    "distribución hotelera",
    "reportería hotelera",
    "hoteles independientes",
    "PMS hotelero",
    "revenue management",
  ],
  creator: siteName,
  publisher: siteName,
  category: "business",
  formatDetection: { email: false, address: false, telephone: false },
  icons: {
    icon: [{ url: "/favicon-umbral-ni-v1.svg", type: "image/svg+xml" }],
    apple: [{ url: "/apple-touch-icon-umbral-ni-v1.png", sizes: "180x180", type: "image/png" }],
  },
  alternates: { canonical: "/" },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    title: ogTitle,
    description: ogDescription,
    type: "website",
    locale: "es_MX",
    siteName: "Nítora",
    url: "/",
    images: [
      {
        url: "/og-nitora-distribucion-v2.png",
        width: 1200,
        height: 630,
        alt: "Nítora — de datos dispersos a decisiones claras",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: ogTitle,
    description: ogDescription,
    images: ["/og-nitora-distribucion-v2.png"],
  },
  other: {
    "geo.region": "MX-JAL",
    "geo.placename": businessAddress.addressLocality,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#F5F1E9",
  colorScheme: "light",
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: siteName,
      description: siteDescription,
      inLanguage: "es-MX",
    },
    {
      "@type": "ProfessionalService",
      "@id": `${siteUrl}/#business`,
      name: siteName,
      url: siteUrl,
      description: siteDescription,
      slogan: siteTagline,
      telephone: whatsapp.international,
      image: `${siteUrl}/og-nitora-distribucion-v2.png`,
      sameAs: socialLinks.map((social) => social.href),
      address: {
        "@type": "PostalAddress",
        streetAddress: businessAddress.streetAddress,
        postalCode: businessAddress.postalCode,
        addressLocality: businessAddress.addressLocality,
        addressRegion: businessAddress.addressRegion,
        addressCountry: businessAddress.addressCountry,
      },
      areaServed: { "@type": "Country", name: "México" },
      contactPoint: {
        "@type": "ContactPoint",
        telephone: whatsapp.international,
        contactType: "sales",
        availableLanguage: ["es"],
      },
    },
    {
      "@type": "Service",
      "@id": `${siteUrl}/#diagnostico`,
      name: "Diagnóstico de distribución y reportería hotelera",
      description: ogDescription,
      provider: { "@id": `${siteUrl}/#business` },
      areaServed: { "@type": "Country", name: "México" },
      audience: { "@type": "BusinessAudience", audienceType: "Hoteles independientes" },
    },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es-MX">
      <body className={`${geistSans.variable} ${geistMono.variable} ${newsreader.variable}`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }}
        />
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
