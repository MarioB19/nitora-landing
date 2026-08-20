import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Nítora — Inteligencia hotelera",
    short_name: "Nítora",
    description:
      "Diagnóstico de distribución y reportería para hoteles independientes, sin cambiar el PMS.",
    start_url: "/",
    display: "standalone",
    background_color: "#F5F1E9",
    theme_color: "#10282D",
    lang: "es-MX",
    icons: [
      {
        src: "/apple-touch-icon-umbral-ni-v1.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}
