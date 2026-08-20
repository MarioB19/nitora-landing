import type { Metadata } from "next";
import { LogoWordmark } from "../logo";
import Link from "next/link";
import { SiteFooter } from "../components/SiteFooter";
import { businessAddress } from "../site";

/* ------------------------------------------------------------------
   CAMPOS QUE DEBEN CERRARSE ANTES DE PUBLICAR

   Mientras alguno siga con el valor "PENDIENTE", la página muestra
   un aviso rojo arriba. En cuanto los completes, el aviso desaparece
   solo. No hay nada más que tocar.
------------------------------------------------------------------- */

const DOMICILIO = businessAddress.display;
const FECHA_ACTUALIZACION = "20 de agosto de 2026"; // debe coincidir con el día real de publicación
const RETENCION_ARCHIVOS = "30";                  // días naturales tras la entrega

/**
 * Cada encargado se declara sólo si realmente está en uso. Las condiciones son
 * las mismas variables que encienden cada integración, para que el aviso nunca
 * liste un proveedor que no trata datos.
 *
 * IMPORTANTE: si configuras LEAD_WEBHOOK_URL apuntando a un servicio con
 * nombre propio (Zapier, Make, Google Sheets, n8n…), añádelo aquí a mano.
 * La ley pide nombrar al encargado, y desde el código no se puede deducir.
 */
const ENCARGADOS = [
  { nombre: "Hostinger", rol: "correo electrónico y DNS del dominio" },
  { nombre: "Vercel Inc.", rol: "alojamiento y entrega de este sitio" },
  ...(process.env.RESEND_API_KEY
    ? [{ nombre: "Resend", rol: "envío de la notificación interna de cada solicitud" }]
    : []),
  ...(process.env.NEXT_PUBLIC_GA_ID
    ? [{ nombre: "Google Analytics", rol: "medición de tráfico y origen de la visita" }]
    : []),
  { nombre: "WhatsApp (Meta)", rol: "mensajería con quien solicita información" },
];

const PENDIENTES = [DOMICILIO, FECHA_ACTUALIZACION, RETENCION_ARCHIVOS].some(
  (valor) => valor.trim() === "" || valor.includes("PENDIENTE"),
);

export const metadata: Metadata = {
  title: "Aviso de privacidad",
  description:
    "Aviso de privacidad integral de Nítora: qué datos tratamos, para qué, con quién los compartimos, cuánto los conservamos y cómo ejercer tus derechos ARCO.",
  alternates: { canonical: "/privacidad" },
  openGraph: {
    title: "Aviso de privacidad | Nítora",
    description:
      "Conoce qué datos trata Nítora, con qué finalidad y cómo ejercer tus derechos ARCO.",
    type: "website",
    locale: "es_MX",
    siteName: "Nítora",
    url: "/privacidad",
    images: [
      {
        url: "/og-nitora-distribucion-v2.png",
        width: 1200,
        height: 630,
        alt: "Nítora — diagnóstico hotelero en cinco días",
      },
    ],
  },
  robots: { index: true, follow: true },
};

export default function Privacidad() {
  return (
    <main>
      <header className="site-header">
        <div className="shell">
          <Link className="brand" href="/" aria-label="Nítora, inicio">
            <LogoWordmark />
          </Link>
          <nav className="site-nav" aria-label="Navegación principal">
            <Link className="button button-ghost button-sm" href="/#solicitar">Ver si mi hotel aplica</Link>
          </nav>
        </div>
      </header>

      {PENDIENTES && (
        <p className="legal-warning" role="alert">
          <strong>Borrador — no publicar.</strong> Faltan campos por cerrar en{" "}
          <code>app/privacidad/page.tsx</code>: revisa <code>DOMICILIO</code>,{" "}
          <code>FECHA_ACTUALIZACION</code> y <code>RETENCION_ARCHIVOS</code>. Este
          aviso desaparece solo cuando los tres tienen valor.
        </p>
      )}

      <article className="legal">
        <p className="eyebrow"><span /> Documento legal</p>
        <h1 className="legal-title">Aviso de privacidad integral</h1>
        <p className="legal-meta">Última actualización: {FECHA_ACTUALIZACION}</p>

        <section>
          <h2>1. Identidad y domicilio del responsable</h2>
          <p>
            <strong>Brandon Muro</strong>, persona física con actividad empresarial, que opera
            bajo el nombre comercial <strong>Nítora</strong>, con domicilio en {DOMICILIO}, es
            responsable del tratamiento de sus datos personales.
          </p>
          <p>
            Para cualquier asunto relacionado con este aviso puede escribir a{" "}
            <a href="mailto:privacidad@nitora.online">privacidad@nitora.online</a>.
          </p>
        </section>

        <section>
          <h2>2. Datos personales que tratamos</h2>
          <p>
            <strong>a) Datos de contacto profesional.</strong> Nombre, cargo, hotel o empresa,
            correo electrónico, teléfono y perfil profesional público, obtenidos directamente de
            usted o de fuentes de acceso público. Cuando completa el formulario de este sitio,
            esos campos —junto con el rango de habitaciones, el sistema que utiliza y la tarea
            que describe como más costosa— se registran como constancia de su solicitud en el
            momento en que pulsa el botón, con independencia de que después decida enviarnos o no
            el mensaje de WhatsApp.
          </p>
          <p>
            <strong>b) Datos de navegación.</strong> Dirección IP, tipo de dispositivo y
            navegador y páginas visitadas cuando se habilitan herramientas de analítica. Si
            completa el formulario, también registramos la página de entrada, el referente y los
            parámetros de origen de la visita (UTM) para atribuir la solicitud.
          </p>
          <p>
            <strong>c) Archivos operativos del hotel.</strong> Cuando contrata el diagnóstico
            de distribución y reportería hotelera, podemos tratar exportaciones de reservas,
            canales, cancelaciones, comisiones u ocupación en formato CSV o Excel.
          </p>
          <p className="legal-callout">
            <strong>No tratamos datos personales sensibles.</strong> No solicitamos ni almacenamos
            datos de tarjetas bancarias, credenciales de acceso a sistemas, ni información de
            salud, origen étnico, creencias, afiliación sindical, opiniones políticas, preferencia
            sexual o datos biométricos.
          </p>
          <p>
            <strong>Sobre los datos de huéspedes:</strong> solicitamos expresamente que los
            archivos se entreguen minimizados o anonimizados, sin nombre, contacto ni documento de
            identidad de los huéspedes. Si un archivo llegara a contener esa información, la
            eliminamos o enmascaramos antes de iniciar el análisis y se lo notificamos.
          </p>
        </section>

        <section>
          <h2>3. Finalidades del tratamiento</h2>
          <p><strong>Finalidades primarias</strong> (necesarias para la relación):</p>
          <ul>
            <li>Responder solicitudes de información y agendar la evaluación de encaje.</li>
            <li>Evaluar si el servicio es aplicable a su hotel.</li>
            <li>Prestar el servicio de diagnóstico contratado y entregar sus resultados.</li>
            <li>Emitir comprobantes fiscales y llevar el registro contable correspondiente.</li>
            <li>Dar seguimiento comercial y de soporte relacionado con el servicio.</li>
          </ul>
          <p><strong>Finalidades secundarias</strong> (puede oponerse sin afectar el servicio):</p>
          <ul>
            <li>Enviarle contenido, novedades o invitaciones relacionadas con nuestros servicios.</li>
            <li>Elaborar estadísticas agregadas y anonimizadas sobre el mercado hotelero.</li>
          </ul>
          <p>
            Si no desea que sus datos se traten para las finalidades secundarias, puede indicarlo
            en cualquier momento escribiendo a{" "}
            <a href="mailto:privacidad@nitora.online">privacidad@nitora.online</a>. Su negativa no
            será motivo para negarle el servicio.
          </p>
        </section>

        <section>
          <h2>4. Uso de resultados y casos de éxito</h2>
          <p>
            <strong>
              No publicamos su nombre, logotipo, cifras ni testimonios sin su autorización expresa,
              otorgada por escrito y por separado para cada uso.
            </strong>{" "}
            Los resultados de un diagnóstico son suyos y no se comparten con terceros.
          </p>
        </section>

        <section>
          <h2>5. Transferencias y encargados</h2>
          <p>
            No vendemos, cedemos ni transferimos sus datos personales a terceros para fines
            distintos a la prestación del servicio.
          </p>
          <p>
            Utilizamos proveedores que actúan como <strong>encargados</strong> y tratan datos
            únicamente por nuestra instrucción:
          </p>
          <ul>
            {ENCARGADOS.map((e) => (
              <li key={e.nombre}>
                <strong>{e.nombre}</strong> — {e.rol}.
              </li>
            ))}
          </ul>
          <p>
            Estos proveedores pueden almacenar información fuera de México; en ese caso se sujetan
            a compromisos contractuales de protección equivalentes. Las transferencias que no
            requieren su consentimiento son únicamente las previstas en el artículo 37 de la
            LFPDPPP.
          </p>
        </section>

        <section>
          <h2>6. Conservación y eliminación</h2>
          <ul>
            <li>
              <strong>Datos de contacto profesional y solicitudes del formulario:</strong> mientras
              exista relación comercial o interés legítimo de seguimiento, y hasta 24 meses después
              del último contacto. Puede pedir la eliminación de su solicitud en cualquier momento
              y se atiende sin condicionarla a nada.
            </li>
            <li>
              <strong>Archivos operativos del hotel:</strong> se eliminan de forma segura en un
              plazo máximo de {RETENCION_ARCHIVOS} días naturales contados a partir de la entrega
              del diagnóstico, o antes si usted lo solicita. La fecha de eliminación se acuerda por
              escrito al inicio del servicio.
            </li>
            <li>
              <strong>Registros fiscales y contables:</strong> por el plazo que la legislación
              aplicable exija.
            </li>
          </ul>
        </section>

        <section>
          <h2>7. Medidas de seguridad</h2>
          <p>
            Aplicamos medidas administrativas, técnicas y físicas razonables: autenticación de dos
            factores en las cuentas que acceden a la información, cifrado en tránsito, acceso
            limitado a las personas que participan en la prestación del servicio, y minimización de
            los datos desde su recepción.
          </p>
          <p>
            En caso de una vulneración que afecte de forma significativa sus derechos patrimoniales
            o morales, se lo comunicaremos sin demora para que pueda tomar medidas.
          </p>
        </section>

        <section>
          <h2>8. Derechos ARCO</h2>
          <p>
            Usted tiene derecho a <strong>Acceder</strong> a sus datos personales,{" "}
            <strong>Rectificarlos</strong> cuando sean inexactos, <strong>Cancelarlos</strong>{" "}
            cuando considere que no se requieren, y <strong>Oponerse</strong> a su tratamiento para
            fines específicos. También puede revocar su consentimiento y limitar el uso o
            divulgación de sus datos.
          </p>
          <p>
            Para ejercer cualquiera de estos derechos, envíe una solicitud a{" "}
            <a href="mailto:privacidad@nitora.online">privacidad@nitora.online</a> que incluya:
          </p>
          <ol>
            <li>Su nombre y un medio para comunicarle la respuesta.</li>
            <li>Documento que acredite su identidad, o la representación legal en su caso.</li>
            <li>Descripción clara de los datos respecto de los que busca ejercer el derecho.</li>
            <li>Cualquier elemento que facilite la localización de los datos.</li>
          </ol>
          <p>
            Responderemos en un plazo máximo de <strong>20 días hábiles</strong>. Si la solicitud
            procede, se hará efectiva dentro de los <strong>15 días hábiles</strong> siguientes.
          </p>
          <p>
            Si considera que su derecho a la protección de datos ha sido lesionado, puede acudir a
            la autoridad competente en materia de protección de datos personales en México.
          </p>
        </section>

        <section>
          <h2>9. Cookies y tecnologías de rastreo</h2>
          {process.env.NEXT_PUBLIC_GA_ID ? (
            <p>
              Nuestro sitio utiliza cookies y tecnologías similares para medir el tráfico y
              entender qué canal originó su visita. Puede deshabilitarlas desde la configuración
              de su navegador; algunas funciones podrían dejar de operar correctamente.
            </p>
          ) : (
            <p>
              Este sitio no utiliza cookies de analítica ni de publicidad. Los parámetros de
              origen de la visita (UTM) se leen de la dirección de la página y se registran sólo
              cuando usted envía la solicitud de evaluación. Si después abre WhatsApp, también se
              incluyen en ese mensaje para conservar la atribución.
            </p>
          )}
        </section>

        <section>
          <h2>10. Cambios a este aviso</h2>
          <p>
            Cualquier modificación se publicará en <strong>nitora.online/privacidad</strong>,
            indicando la fecha de última actualización. Le recomendamos revisarlo periódicamente.
          </p>
        </section>

        <p className="legal-back">
          <Link className="button button-ghost" href="/">← Volver al inicio</Link>
        </p>
      </article>

      <SiteFooter />
    </main>
  );
}
