"use client";
import { Isotipo } from "./logo";

import { FormEvent, useState } from "react";

/** +52 33 2924 7910. Formato de wa.me: código de país + 10 dígitos, sin signos. */
const WHATSAPP_NUMBER = "523329247910";

const deliverables = [
  "Mapa del flujo actual de información",
  "Horas mensuales estimadas en tareas manuales",
  "Señales de posibles fugas de ingreso neto",
  "Tres oportunidades priorizadas por impacto y esfuerzo",
  "Plan de acción de 30 días con una métrica principal",
  "Resumen y sesión ejecutiva de resultados",
];

const steps = [
  {
    dia: "Día 0",
    title: "Confirmamos el encaje",
    body: "Una llamada de 30 minutos para conocer canales, sistemas, responsables y el problema que quieres medir.",
  },
  {
    dia: "Días 1–3",
    title: "Revisamos tus exportaciones",
    body: "Tu equipo descarga CSV o Excel. No pedimos credenciales ni modificamos tarifas, reservas o inventario.",
  },
  {
    dia: "Días 4–5",
    title: "Priorizamos y entregamos",
    body: "Presentamos hallazgos, limitaciones y un experimento de 30 días con métrica y criterio de decisión.",
  },
];

const findings = [
  {
    idx: "01",
    title: "Reportería duplicada",
    evidence: "Tres hojas repiten campos del PMS y del channel manager.",
    impact: "22 h / mes",
    caveat: "estimación",
    confidence: "ALTA" as const,
  },
  {
    idx: "02",
    title: "Promociones superpuestas",
    evidence: "Dos descuentos coinciden en 14% de la muestra.",
    impact: "$18–31 mil",
    caveat: "requiere validar",
    confidence: "MEDIA" as const,
  },
  {
    idx: "03",
    title: "Cancelaciones sin lectura común",
    evidence: "El motivo no está normalizado entre canales.",
    impact: "7 h / mes",
    caveat: "estimación",
    confidence: "MEDIA" as const,
  },
];

const fitYes = [
  "Operas un hotel independiente de 40 a 150 habitaciones.",
  "Vendes mediante tres o más canales.",
  "Tu equipo consolida reportes manualmente.",
  "Puedes exportar reservas y canales en CSV o Excel.",
];

const fitNo = [
  "Auditoría financiera, fiscal o contractual.",
  "Migración o reemplazo de PMS.",
  "Implementación tecnológica incluida.",
  "Garantía de ahorro o nuevos ingresos.",
];

const faqs = [
  {
    question: "¿Tendremos que cambiar de PMS?",
    answer:
      "No. El diagnóstico evalúa tu operación actual y lo que puede mejorarse alrededor de las herramientas que ya utilizas. No migramos ni modificamos tu PMS.",
  },
  {
    question: "¿Qué información necesitan?",
    answer:
      "Exportaciones CSV o Excel de reservas y canales, idealmente de 6 a 12 meses, además de una conversación breve con la persona que prepara los reportes. Confirmamos los campos mínimos antes de iniciar.",
  },
  {
    question: "¿Necesitan contraseñas o acceso directo?",
    answer:
      "No. Trabajamos con copias exportadas por tu equipo. No pedimos usuarios, contraseñas ni permisos para cambiar tarifas, inventario o reservas.",
  },
  {
    question: "¿Van a ver datos de tarjetas?",
    answer:
      "No solicitamos ni necesitamos datos de tarjeta. Pedimos únicamente los campos necesarios y preferimos información agregada o anonimizada cuando el análisis lo permite.",
  },
  {
    question: "¿Cuándo comienzan los cinco días?",
    answer:
      "Cuando validamos que los archivos mínimos pueden abrirse y acordamos el alcance. Si falta información, lo documentamos antes de comenzar y tú decides si continuar.",
  },
  {
    question: "¿Cuánto tiempo requiere de mi equipo?",
    answer:
      "Una conversación inicial de 30 minutos, la preparación de las exportaciones acordadas y la sesión ejecutiva de resultados. Confirmamos responsables y esfuerzo antes de iniciar.",
  },
  {
    question: "¿Qué ocurre si mis archivos están incompletos?",
    answer:
      "Los revisamos antes de iniciar el plazo y de solicitar el pago. Si no contienen los campos mínimos para responder una pregunta útil, te explicamos la limitación y no comenzamos el diagnóstico.",
  },
  {
    question: "¿Incluye implementar las recomendaciones?",
    answer:
      "No. Margen Uno incluye el diagnóstico, la priorización y un plan de validación de 30 días. Cualquier implementación posterior se cotiza por separado sólo si tiene sentido para el hotel.",
  },
  {
    question: "¿Garantizan recuperar una cantidad de dinero?",
    answer:
      "No. Encontramos señales, estimamos impactos con supuestos visibles y proponemos experimentos para comprobar cada oportunidad. No es una auditoría financiera ni una garantía de ingresos.",
  },
];

/* Iconos de trazo. Nunca glifos unicode: escalan y recolorean con el texto. */
function ArrowIcon() {
  return (
    <svg className="ic ic-arw" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
      <path d="M2.5 8 H13" />
      <path d="M8.5 3.5 L13 8 L8.5 12.5" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg className="ic" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
      <path d="M3 8.4 L6.3 11.7 L13 4.7" />
    </svg>
  );
}

function MinusIcon() {
  return (
    <svg className="ic" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
      <path d="M3.5 8 H12.5" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg className="ic ic-plus" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
      <path d="M8 3 V13" />
      <path d="M3 8 H13" />
    </svg>
  );
}

export default function Home() {
  /* Guarda el enlace generado para poder ofrecerlo de nuevo si el navegador
     bloqueó la ventana emergente. `window.open` con `noopener` siempre
     devuelve null, así que no hay forma de detectar el bloqueo. */
  const [waUrl, setWaUrl] = useState<string | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const params = new URLSearchParams(window.location.search);
    const attribution = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"]
      .map((key) => [key, params.get(key)] as const)
      .filter(([, value]) => value)
      .map(([key, value]) => `${key.replace("utm_", "")}: ${value}`)
      .join(" · ");
    const message = [
      "Hola, me interesa Margen Uno de Nítora.",
      "",
      `Nombre: ${data.get("name")}`,
      `Hotel: ${data.get("hotel")}`,
      `Cargo: ${data.get("role")}`,
      `Correo: ${data.get("email")}`,
      `Habitaciones: ${data.get("rooms")}`,
      `PMS / sistema: ${data.get("pms") || "Por confirmar"}`,
      `Mayor fricción: ${data.get("pain")}`,
      attribution ? `Origen: ${attribution}` : "",
    ].filter(Boolean).join("\n");

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

    /* GTM dispara con el push a dataLayer; gtag.js necesita la llamada
       explícita. Se hacen las dos para que la medición funcione con
       cualquiera de los dos montajes, y ninguna falla si no hay etiqueta. */
    const trackingWindow = window as Window & {
      dataLayer?: Array<Record<string, unknown>>;
      gtag?: (...args: unknown[]) => void;
    };
    trackingWindow.dataLayer?.push({ event: "nitora_lead_whatsapp", form: "margen_uno" });
    trackingWindow.gtag?.("event", "nitora_lead_whatsapp", { form: "margen_uno" });

    /* WhatsApp se abre primero y de forma síncrona: si esperáramos al registro,
       el navegador dejaría de ver la apertura como consecuencia directa del
       clic y la bloquearía. */
    setWaUrl(url);
    window.open(url, "_blank", "noopener,noreferrer");

    /* El registro va después y nunca bloquea. `keepalive` lo mantiene vivo
       aunque la pestaña pierda el foco al saltar a WhatsApp. */
    void fetch("/api/lead", {
      method: "POST",
      headers: { "content-type": "application/json" },
      keepalive: true,
      body: JSON.stringify({
        name: data.get("name"),
        hotel: data.get("hotel"),
        role: data.get("role"),
        email: data.get("email"),
        rooms: data.get("rooms"),
        pms: data.get("pms"),
        pain: data.get("pain"),
        company: data.get("company"),
        attribution,
        page: window.location.href,
      }),
    }).catch(() => {
      /* Si el registro falla, la conversación por WhatsApp ya está en marcha.
         El fallo queda en los logs del servidor, no en la cara del visitante. */
    });
  }

  return (
    <main>
      <header className="site-header">
        <div className="shell">
          <a className="brand" href="#inicio" aria-label="Nítora, inicio">
            <Isotipo />
            <span className="brand-copy">
              <strong>Nítora</strong>
              <small>Inteligencia hotelera</small>
            </span>
          </a>
          <nav className="site-nav" aria-label="Navegación principal">
            <a href="#oferta">Qué recibes</a>
            <a href="#ejemplo">Ejemplo</a>
            <a href="#preguntas">Preguntas</a>
            <a className="button button-ghost button-sm" data-cta="header" href="#solicitar">
              Ver si mi hotel aplica
            </a>
          </nav>
        </div>
      </header>

      <section className="hero" id="inicio">
        <div className="shell">
          <h1>
            Tres decisiones<br />
            para proteger margen<br />
            y liberar horas.
          </h1>
          <p className="hero-lead">
            En cinco días cruzamos las exportaciones de reservas y canales que tu equipo ya
            genera. Identificamos dónde se diluyen el margen y las horas, estimamos el impacto
            y priorizamos qué conviene corregir primero.
          </p>
          <p className="hero-firme">Sin integraciones, sin credenciales, sin migrar tu PMS.</p>
          <div className="hero-actions">
            <a className="button button-primary" data-cta="hero-fit" href="#solicitar">
              Ver si mi hotel aplica <ArrowIcon />
            </a>
            <a className="link-quiet" data-cta="hero-sample" href="#ejemplo">
              Ver diagnóstico de muestra
            </a>
          </div>
          <div className="hero-oferta">
            <strong>$5,900 MXN + IVA</strong>
            <span>Una propiedad</span>
            <span>El plazo inicia cuando validamos tus archivos</span>
          </div>
          <p className="hero-icp">
            Para hoteles independientes de 40 a 150 habitaciones que venden por tres o más canales.
          </p>
        </div>
      </section>

      <section className="hechos" aria-label="Resumen de Margen Uno">
        <div className="shell hechos-grid">
          <div><strong>5 días</strong><small>de diagnóstico</small></div>
          <div><strong>3 acciones</strong><small>priorizadas</small></div>
          <div><strong>CSV o Excel</strong><small>sin integración</small></div>
          <div><strong>Antes de cobrar</strong><small>validamos tus archivos</small></div>
        </div>
      </section>

      <section className="sec">
        <div className="shell">
          <div className="section-intro">
            <h2>¿Por dónde empiezas?</h2>
            <p>
              Tus cifras viven entre PMS, canales, comisiones, cancelaciones y hojas manuales.
              Margen Uno organiza esa evidencia para convertir una sospecha operativa en una
              decisión con prioridad, métrica y siguiente paso.
            </p>
          </div>
          <div className="par">
            <article>
              <h3>Cuánto tiempo se va en preparar el reporte</h3>
              <p>
                Mapeamos las horas que tu equipo declara invirtiendo en juntar, conciliar y revisar
                información antes de poder decidir algo con ella.
              </p>
            </article>
            <article>
              <h3>Qué es evidencia y qué es suposición</h3>
              <p>
                Cada señal declara de qué archivo salió, qué supone y qué tan seguros estamos. Las
                que no alcanzan para concluir se marcan como tales, no se maquillan.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="metodo sec" id="metodo">
        <div className="shell">
          <h2>De archivos dispersos a un plan en cinco días.</h2>
          <ol className="pasos">
            {steps.map((step, index) => (
              <li key={step.title}>
                <span className="paso-num">{index + 1}</span>
                <span className="paso-dia">{step.dia}</span>
                <div>
                  <h3>{step.title}</h3>
                  <p>{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="sec" id="oferta">
        <div className="shell entrega">
          <div>
            <h2>Una lectura ejecutiva, no otra carpeta de gráficas.</h2>
            <p className="lead-copy">
              Margen Uno resume qué observamos, qué estimamos, qué conviene validar y cuál debería
              ser el siguiente movimiento.
            </p>
            <ul className="entrega-lista">
              {deliverables.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>
          <aside className="scope-card">
            <p className="scope-eyebrow">Oferta de entrada</p>
            <h3>Margen Uno</h3>
            <div className="precio"><strong>$5,900</strong><span>MXN + IVA</span></div>
            <p className="scope-desc">Diagnóstico de distribución y reportería para una propiedad.</p>
            <hr className="scope-divider" />
            <p className="scope-riesgo">
              El pago se solicita después de confirmar que tus archivos permiten un diagnóstico útil.
            </p>
            <a className="button button-primary full" data-cta="offer" href="#solicitar">
              Quiero validar mis archivos <ArrowIcon />
            </a>
            <p className="scope-nota">Cupo piloto: cinco hoteles · precio experimental.</p>
          </aside>
        </div>
      </section>

      <section className="muestra sec" id="ejemplo">
        <div className="shell">
          <div className="muestra-top">
            <div className="section-intro">
              <h2>Así se entrega una decisión.</h2>
              <p>
                Una muestra completa con datos sintéticos. Verás cómo separamos evidencia,
                estimación y confianza antes de que compartas información de tu hotel.
              </p>
            </div>
            <button className="button button-ghost button-sm" type="button" onClick={() => window.print()}>
              Guardar muestra como PDF
            </button>
          </div>

          <article className="report-sheet" aria-label="Diagnóstico de distribución de muestra">
            <header className="sheet-header">
              <div>
                <p>Nítora · Margen Uno</p>
                <h3>Hotel Mirador</h3>
              </div>
              <div className="sheet-meta">
                <span>86 hab.</span>
                <span>1 propiedad</span>
                <span>90 días</span>
                <span className="sheet-flag">MUESTRA · DATOS SINTÉTICOS</span>
              </div>
            </header>

            <div className="resumen">
              <p>
                Detectamos <strong>tres oportunidades</strong> que podrían reducir carga manual y
                proteger ingreso neto visible, sujetas a validación.
              </p>
              <div className="confianza">
                <small>Confianza general</small>
                <strong>MEDIA</strong>
              </div>
            </div>

            <div className="baseline">
              <div><small>Horas declaradas</small><strong>9.5 h</strong><span>por semana</span></div>
              <div><small>Fuentes revisadas</small><strong>4</strong><span>sistemas y hojas</span></div>
              <div><small>Mezcla OTA</small><strong>38%</strong><span>sobre reservas</span></div>
              <div><small>Calidad de datos</small><strong>76%</strong><span>campos utilizables</span></div>
            </div>

            <div className="tabla-tit">
              <h4>Hallazgos priorizados</h4>
              <span>Impacto estimado ≠ resultado garantizado</span>
            </div>
            <table className="sheet-table">
              <caption className="sr-only">
                Hallazgos priorizados del diagnóstico de muestra, con su evidencia, impacto
                estimado y nivel de confianza.
              </caption>
              <thead>
                <tr className="fila cab">
                  <th scope="col">Prioridad</th>
                  <th scope="col">Hallazgo y evidencia</th>
                  <th scope="col">Impacto</th>
                  <th scope="col">Confianza</th>
                </tr>
              </thead>
              <tbody>
                {findings.map((f) => (
                  <tr className="fila" key={f.idx}>
                    <td className="idx">{f.idx}</td>
                    <td className="txt"><strong>{f.title}</strong><small>{f.evidence}</small></td>
                    <td className="val"><strong>{f.impact}</strong><small>{f.caveat}</small></td>
                    <td className="pill-wrap">
                      <b className={f.confidence === "ALTA" ? "pill alta" : "pill media"}>{f.confidence}</b>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="experimento">
              <span>Próximo experimento · 30 días</span>
              <p>
                <strong>Automatizar un único reporte semanal de pickup.</strong> Medir horas de
                preparación antes y después, y decisiones ejecutadas. Continuar si reduce al menos
                50% del tiempo sin aumentar errores.
              </p>
            </div>

            <footer className="sheet-footer">
              <span>Fuentes: exportaciones de muestra y entrevista simulada</span>
              <span>No constituye auditoría financiera ni garantía de ingresos · 01/01</span>
            </footer>
          </article>
        </div>
      </section>

      <section className="rigor sec">
        <div className="shell">
          <h2>Cada hallazgo dice qué sabemos y qué falta validar.</h2>
          <p>
            Señalamos de qué archivo o conversación proviene cada observación. Las estimaciones
            llevan sus supuestos y un nivel explícito de confianza, y cada recomendación viene con
            una métrica y un criterio para decidir si continuar.
          </p>
          <p className="cierre">Si algo no alcanza para concluir, lo dice.</p>
        </div>
      </section>

      <section className="encaje sec">
        <div className="shell encaje-grid">
          <div>
            <h2>Margen Uno funciona mejor si hoy…</h2>
          </div>
          <div className="encaje-col encaje-si">
            <h3>Buen encaje</h3>
            <ul>
              {fitYes.map((item) => (
                <li key={item}><CheckIcon /><span>{item}</span></li>
              ))}
            </ul>
          </div>
          <div className="encaje-col encaje-no">
            <h3>No es este servicio</h3>
            <ul>
              {fitNo.map((item) => (
                <li key={item}><MinusIcon /><span>{item}</span></li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="sec" id="preguntas">
        <div className="shell faq-grid">
          <h2>Antes de compartir un archivo.</h2>
          <div className="faq-list">
            {faqs.map((faq, index) => (
              <details key={faq.question} open={index === 0}>
                <summary><span>{faq.question}</span><PlusIcon /></summary>
                <p>{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="contacto" id="solicitar">
        <div className="shell contacto-grid">
          <div>
            <p className="eyebrow"><span /> Primer paso · sin costo</p>
            <h2>Confirma si tus archivos pueden responder una pregunta útil.</h2>
            <p className="lead-copy">
              Comparte el contexto mínimo. Revisaremos el encaje y te diremos qué exportaciones
              serían necesarias. Si la información no permite un diagnóstico sólido, te lo diremos
              antes de cobrar.
            </p>
            <div className="promesa">
              <div><strong>30 minutos</strong><small>Una conversación inicial para definir la pregunta.</small></div>
              <div><strong>Antes de cobrar</strong><small>Validamos que los archivos sean suficientes.</small></div>
              <div><strong>Sin accesos</strong><small>No solicitamos credenciales ni datos de tarjeta.</small></div>
            </div>
            <p className="firma">
              La evaluación y la entrega las hago yo, no un equipo de cuenta. Durante el piloto
              contesto yo.
            </p>
          </div>

          <form className="lead-form" onSubmit={handleSubmit}>
            <div className="form-heading">
              <span>Ver si mi hotel aplica</span>
              <small>Campos obligatorios *</small>
            </div>
            <div className="form-grid">
              <label>Nombre *<input name="name" required autoComplete="name" placeholder="Tu nombre" /></label>
              <label>Hotel *<input name="hotel" required autoComplete="organization" placeholder="Nombre del hotel" /></label>
              <label>Cargo *<input name="role" required autoComplete="organization-title" placeholder="Gerencia, Revenue, Operaciones…" /></label>
              <label>Correo de trabajo *<input name="email" type="email" required autoComplete="email" placeholder="nombre@hotel.com" /></label>
              <label>Habitaciones *
                <select name="rooms" required defaultValue="">
                  <option value="" disabled>Selecciona un rango</option>
                  <option>Menos de 40</option><option>40–79</option><option>80–150</option><option>Más de 150</option>
                </select>
              </label>
              <label>PMS o sistema principal<input name="pms" placeholder="Cloudbeds, Opera, Excel…" /></label>
              <label className="wide">¿Qué tarea consume más tiempo? *<textarea name="pain" required rows={3} placeholder="Consolidar reportes, revisar comisiones, entender cancelaciones…" /></label>
            </div>
            {/* Trampa antispam: invisible para personas, los bots la llenan. */}
            <div className="sr-only" aria-hidden="true">
              <label htmlFor="company">No llenes este campo</label>
              <input id="company" name="company" type="text" tabIndex={-1} autoComplete="off" />
            </div>
            <label className="consent">
              <input type="checkbox" required />{" "}
              <span>Acepto ser contactado para evaluar el diagnóstico y confirmo que leí el <a href="/privacidad">aviso de privacidad</a>.</span>
            </label>
            <button className="button button-accent full" data-cta="form-whatsapp" type="submit">
              Validar mi hotel por WhatsApp <ArrowIcon />
            </button>
            <p className="form-note">
              Al continuar se abrirá WhatsApp con el mensaje ya escrito; tú decides si enviarlo.
              Registramos tu solicitud para poder responderte aunque no completes el envío.
            </p>
            <details className="privacy-disclosure" id="uso-datos">
              <summary>Cómo usamos estos datos</summary>
              <p>
                Nítora es responsable del tratamiento de estos datos; la identificación completa
                del responsable está en el <a href="/privacidad">aviso de privacidad</a>. Nombre,
                correo profesional, hotel, cargo y contexto operativo se guardan como registro de
                tu solicitud y se usan únicamente para evaluar el encaje, responderte y coordinar
                Margen Uno. No pedimos información sensible ni datos de pago. Puedes solicitar
                acceso, corrección, cancelación u oposición escribiendo a{" "}
                <a href="mailto:privacidad@nitora.online">privacidad@nitora.online</a>.
              </p>
            </details>
            {waUrl && (
              <p className="success" role="status">
                WhatsApp se abrió en otra pestaña. Si no lo ves,{" "}
                <a href={waUrl} target="_blank" rel="noopener noreferrer">ábrelo desde aquí</a>.
              </p>
            )}
          </form>
        </div>
      </section>

      <footer className="site-footer">
        <div className="shell">
          <div className="footer-brand">
            <Isotipo />
            <div>
              <strong>Nítora</strong>
              <small>De datos dispersos a decisiones claras.</small>
            </div>
          </div>
          <div className="footer-links">
            <a href="mailto:privacidad@nitora.online">Contacto</a>
            <a href="/privacidad">Aviso de privacidad</a>
            <a href="#metodo">Metodología</a>
            <a href="#inicio">Volver arriba</a>
          </div>
          <p className="footer-legal">
            Nítora · Programa piloto · México · No constituye auditoría financiera ni garantía de ingresos.
          </p>
        </div>
      </footer>

      <a className="mobile-cta" data-cta="mobile-sticky" href="#solicitar">
        Ver si mi hotel aplica <ArrowIcon />
      </a>
    </main>
  );
}
