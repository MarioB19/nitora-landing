/**
 * Isotipo Nítora — pórtico macizo con la N calada y el zócalo cobre.
 *
 * Una sola figura resuelta con fill-rule evenodd: no usa máscaras ni IDs,
 * así que puede repetirse en la misma página sin colisiones.
 * La masa hereda `currentColor`; el zócalo es siempre cobre.
 * Fuente de verdad del trazo: `Marca/logo/svg/nitora-isotipo.svg`.
 */

const MASS = "M8 53 L8 30 A24 24 0 0 1 56 30 L56 53 Z";
const N = "M19 45 V18 H24.5 L39.5 37.76 V18 H45 V45 H39.5 L24.5 25.24 V45 Z";

export function Isotipo({ className = "brand-mark" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="5 6 54 52"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <path fillRule="evenodd" d={`${MASS} ${N}`} fill="currentColor" />
      <rect x="5" y="53" width="54" height="5" fill="#C65F34" />
    </svg>
  );
}
