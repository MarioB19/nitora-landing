import { LogoWordmark } from "../logo";
import {
  businessAddress,
  privacyEmail,
  socialLinks,
  siteTagline,
  whatsapp,
  whatsappUrl,
} from "../site";

export function SiteFooter({ onHome = false }: { onHome?: boolean }) {
  const sectionHref = (id: string) => `${onHome ? "" : "/"}#${id}`;

  return (
    <footer className="site-footer">
      <div className="shell">
        <div className="footer-brand">
          <a href={onHome ? "#inicio" : "/"} aria-label="Nítora, inicio">
            <LogoWordmark />
          </a>
          <p>{siteTagline}</p>
        </div>

        <div className="footer-contact" aria-label="Datos de contacto de Nítora">
          <div>
            <span>WhatsApp de la empresa</span>
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
              {whatsapp.display}
            </a>
          </div>
          <div>
            <span>Ubicación</span>
            <address>
              <a
                href={businessAddress.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Abrir la ubicación de Nítora en Google Maps"
              >
                {businessAddress.display}
              </a>
            </address>
            <a
              className="footer-map-link"
              href={businessAddress.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Abrir en Google Maps ↗
            </a>
          </div>
        </div>

        <nav className="footer-links" aria-label="Navegación del pie">
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">WhatsApp</a>
          {socialLinks.map((social) => (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${social.label} de Nítora, ${social.handle}`}
            >
              {social.label}
            </a>
          ))}
          <a href="/privacidad">Aviso de privacidad</a>
          <a href={sectionHref("metodo")}>Metodología</a>
          <a href={onHome ? "#inicio" : "/"}>{onHome ? "Volver arriba" : "Inicio"}</a>
        </nav>

        <p className="footer-legal">
          Nítora · Inteligencia hotelera · México · No constituye auditoría financiera ni garantía de ingresos.
          Para derechos ARCO: <a href={`mailto:${privacyEmail}`}>{privacyEmail}</a>.
        </p>
      </div>
    </footer>
  );
}
