/** Fuente única para metadata, datos estructurados y contacto visible. */
export const siteUrl = "https://nitora.online";

export const siteName = "Nítora";
export const siteTagline = "De datos dispersos a decisiones claras.";
export const siteDescription =
  "Diagnóstico de distribución y reportería para hoteles independientes, basado en exportaciones existentes y sin cambiar el PMS.";

export const whatsapp = {
  digits: "523329247910",
  international: "+523329247910",
  display: "+52 33 2924 7910",
  label: "WhatsApp de Nítora",
};

export const whatsappUrl = `https://wa.me/${whatsapp.digits}?text=${encodeURIComponent(
  "Hola, quiero conocer el diagnóstico de distribución y reportería hotelera de Nítora.",
)}`;

export const businessAddress = {
  streetAddress: "Av. de las Américas 1254, piso 10, Country Club",
  postalCode: "44610",
  addressLocality: "Guadalajara",
  addressRegion: "Jalisco",
  addressCountry: "MX",
  display: "Av. de las Américas 1254, piso 10, Country Club, 44610 Guadalajara, Jalisco",
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=Av.%20de%20las%20Am%C3%A9ricas%201254%2C%20piso%2010%2C%20Country%20Club%2C%2044610%20Guadalajara%2C%20Jalisco",
};

export const socialLinks = [
  {
    label: "LinkedIn",
    handle: "Nítora",
    href: "https://www.linkedin.com/company/nitora/",
  },
  {
    label: "Instagram",
    handle: "@nitora.mx",
    href: "https://www.instagram.com/nitora.mx/",
  },
] as const;

export const privacyEmail = "privacidad@nitora.online";
