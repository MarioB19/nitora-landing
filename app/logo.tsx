/**
 * Isotipo Nítora — Umbral Ní v1.
 *
 * La N domina la primera lectura; el asta corta y el acento revelan la í.
 * No usa máscaras ni IDs, así que puede repetirse sin colisiones.
 * Fuente de verdad: `Marca/logo/umbral-ni-v1-2026-08-20/`.
 */

const MONOGRAM = "M8 7H20V57H8ZM16 7H28L50 57H38ZM44 22H56V57H44Z";
const ACCENT = "M42 18L49.5 7H58L50.5 18Z";

type IsotipoVariant = "color" | "mono" | "negative" | "mono-negative";

export function Isotipo({
  className = "brand-mark",
  variant = "color",
}: {
  className?: string;
  variant?: IsotipoVariant;
}) {
  const negative = variant === "negative" || variant === "mono-negative";
  const monochrome = variant === "mono" || variant === "mono-negative";

  return (
    <svg
      className={className}
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
      shapeRendering="geometricPrecision"
    >
      <path d={MONOGRAM} fill={negative ? "#F5F1E9" : "currentColor"} />
      <path d={ACCENT} fill={monochrome ? (negative ? "#F5F1E9" : "currentColor") : "#C65F34"} />
    </svg>
  );
}

/**
 * Wordmark sin isotipo. En navegación evita repetir la N del monograma junto
 * a la N inicial de Nítora y mantiene una sola lectura de marca.
 */
export function LogoWordmark({ className = "brand-wordmark" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 136 36"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <image
        href="/brand/nitora-umbral-ni-wordmark-color.svg"
        width="136"
        height="36"
      />
    </svg>
  );
}
