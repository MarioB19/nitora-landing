"use client";
import { Isotipo, LogoLockup } from "./logo";
import { ImpactCalculator } from "./components/ImpactCalculator";
import { LeadForm } from "./components/LeadForm";
import { MobileCta } from "./components/MobileCta";

const deliverables = [
  "Mapa del flujo actual de información",
  "Horas mensuales estimadas en tareas manuales",
  "Señales de posibles fugas de ingreso neto",
  "Tres decisiones: qué corregir, qué medir y qué no tocar todavía",
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
    impact: "Tiempo por medir",
    caveat: "requiere bitácora",
    confidence: "ALTA" as const,
  },
  {
    idx: "02",
    title: "Promociones superpuestas",
    evidence: "Dos descuentos coinciden en una parte de la muestra.",
    impact: "No cuantificado",
    caveat: "falta tarifa neta",
    confidence: "MEDIA" as const,
  },
  {
    idx: "03",
    title: "Cancelaciones sin lectura común",
    evidence: "El motivo no está normalizado entre canales.",
    impact: "Dato inconsistente",
    caveat: "requiere normalizar",
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
  return (
    <main>
      <header className="site-header">
        <div className="shell">
          <a className="brand" href="#inicio" aria-label="Nítora, inicio">
            <LogoLockup />
          </a>
          <nav className="site-nav" aria-label="Navegación principal">
            <a href="#metodo">Cómo funciona</a>
            <a href="#calcular">Calcula tu carga</a>
            <a href="#ejemplo">Ejemplo</a>
            <a className="button button-ghost button-sm" data-cta="header" href="#solicitar">
              Solicitar evaluación
            </a>
          </nav>
        </div>
      </header>

      <section className="hero" id="inicio">
        <div className="shell hero-grid">
          <div className="hero-copy">
            <p className="hero-eyebrow">Margen Uno · diagnóstico para hoteles independientes</p>
            <h1>
              Tres decisiones para proteger <em>margen y liberar horas.</em>
            </h1>
            <p className="hero-lead">
              Tus sistemas ya generan los datos. En cinco días hábiles los convertimos en una
              línea base y tres decisiones: qué corregir ahora, qué medir durante 30 días y qué
              no vale la pena tocar todavía.
            </p>
            <p className="hero-firme">Sin acceso al PMS. Sin integraciones. Validamos los archivos antes de cobrar.</p>
            <div className="hero-actions">
              <a className="button button-primary" data-cta="hero-fit" href="#solicitar">
                Solicitar evaluación gratuita <ArrowIcon />
              </a>
              <a className="link-quiet" data-cta="hero-sample" href="#ejemplo">
                Ver ejemplo con trazabilidad
              </a>
            </div>
            <div className="hero-oferta">
              <strong>$5,900 MXN + IVA</strong>
              <span>Precio piloto · una propiedad</span>
              <span>El plazo inicia al validar archivos</span>
            </div>
            <p className="hero-icp">
              Para hoteles independientes de 40 a 150 habitaciones que venden por tres o más canales.
            </p>
          </div>

          <article className="hero-diagnostic" aria-label="Vista del diagnóstico con datos hipotéticos">
            <header className="hero-diagnostic-head">
              <div>
                <span className="diagnostic-kicker"><i /> CASO HIPOTÉTICO 01</span>
                <strong>Lectura de distribución</strong>
              </div>
              <span>90 DÍAS</span>
            </header>
            <div className="source-flow" aria-label="Fuentes que se revisan">
              <span>PMS</span><b>+</b><span>Canales</span><b>+</b><span>Excel</span>
            </div>
            <div className="diagnostic-summary">
              <div><small>SEÑALES ENCONTRADAS</small><strong>03</strong></div>
              <p>La cifra sólo se publica cuando el archivo y la fórmula permiten sostenerla.</p>
            </div>
            <ol className="hero-finding-list">
              {findings.map((finding) => (
                <li key={finding.idx}>
                  <span>{finding.idx}</span>
                  <div><strong>{finding.title}</strong><small>{finding.caveat}</small></div>
                  <em>{finding.confidence}</em>
                </li>
              ))}
            </ol>
            <footer className="hero-diagnostic-foot">
              <span>OBSERVADO</span><span>DECLARADO</span><span>ESTIMADO</span><span>POR VALIDAR</span>
            </footer>
          </article>
        </div>
      </section>

      <section className="hechos" aria-label="Resumen de Margen Uno">
        <div className="shell hechos-grid">
          <div><strong>5 días</strong><small>de diagnóstico</small></div>
          <div><strong>3 decisiones</strong><small>con siguiente paso</small></div>
          <div><strong>CSV o Excel</strong><small>sin integración</small></div>
          <div><strong>Antes de cobrar</strong><small>validamos tus archivos</small></div>
        </div>
      </section>

      <section className="value-section sec">
        <div className="shell value-shell">
          <div className="section-intro">
            <p className="eyebrow eyebrow-dark"><span /> El valor para el hotel</p>
            <h2>No compras más gráficas. Compras claridad para decidir.</h2>
            <p>
              El diagnóstico separa la carga operativa de las señales de margen para que una
              cifra llamativa no se convierta en una recomendación equivocada.
            </p>
          </div>
          <div className="decision-grid">
            <article>
              <span>AHORA</span>
              <h3>Qué corregir primero</h3>
              <p>Una prioridad explicada con evidencia, impacto, esfuerzo y nivel de confianza.</p>
            </article>
            <article>
              <span>30 DÍAS</span>
              <h3>Qué conviene medir</h3>
              <p>Un experimento pequeño con responsable, métrica y criterio para continuar o detener.</p>
            </article>
            <article>
              <span>TODAVÍA NO</span>
              <h3>Qué no tocar</h3>
              <p>Lo que no tiene evidencia suficiente y no justifica otra herramienta o proyecto de TI.</p>
            </article>
          </div>
        </div>
      </section>

      <ImpactCalculator />

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
              Solicitar evaluación gratuita <ArrowIcon />
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
                Este formato demostrativo enseña cómo separamos evidencia, estimación y confianza.
                No representa resultados de clientes ni un benchmark del sector.
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
                <h3>Caso hipotético 01</h3>
              </div>
              <div className="sheet-meta">
                <span>1 propiedad</span>
                <span>90 días</span>
                <span className="sheet-flag">FORMATO DEMOSTRATIVO</span>
              </div>
            </header>

            <div className="resumen">
              <p>
                La lectura encuentra <strong>tres señales</strong>, pero sólo recomienda cuantificar
                lo que los archivos y sus supuestos permiten sostener.
              </p>
              <div className="confianza">
                <small>Confianza general</small>
                <strong>MEDIA</strong>
              </div>
            </div>

            <div className="baseline">
              <div><small>Horas declaradas</small><strong>Por medir</strong><span>requiere bitácora</span></div>
              <div><small>Fuentes revisadas</small><strong>4</strong><span>sistemas y hojas</span></div>
              <div><small>Mezcla OTA</small><strong>Pendiente</strong><span>falta normalizar canal</span></div>
              <div><small>Calidad de datos</small><strong>Media</strong><span>campos incompletos</span></div>
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
                preparación antes y después, y decisiones ejecutadas. Fijar la meta después de
                levantar la línea base; continuar sólo si baja el tiempo sin aumentar errores.
              </p>
            </div>

            <footer className="sheet-footer">
              <span>Ejemplo de estructura · sin datos de clientes</span>
              <span>No es benchmark ni garantía de resultados · 01/01</span>
            </footer>
          </article>
        </div>
      </section>

      <section className="evidence-band" aria-label="Cómo se clasifica la evidencia">
        <div className="shell evidence-band-grid">
          <div><strong>Observado</strong><span>Lo que aparece en el archivo.</span></div>
          <div><strong>Declarado</strong><span>Lo que explica tu equipo.</span></div>
          <div><strong>Estimado</strong><span>La fórmula y sus supuestos.</span></div>
          <div><strong>Por validar</strong><span>Lo que todavía no se puede afirmar.</span></div>
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
            <h2>Cuéntame qué decisión necesitas tomar mejor.</h2>
            <p className="lead-copy">
              No subas archivos aquí. Primero confirmamos el encaje y qué exportaciones serían
              necesarias. Si la información no permite un diagnóstico sólido, te lo diré antes de cobrar.
            </p>
            <div className="promesa">
              <div><strong>30 minutos</strong><small>Una conversación inicial para definir la pregunta.</small></div>
              <div><strong>Antes de cobrar</strong><small>Validamos que los archivos sean suficientes.</small></div>
              <div><strong>Sin accesos</strong><small>No solicitamos credenciales ni datos de tarjeta.</small></div>
            </div>
            <p className="firma">
              La evaluación, el análisis y la entrega los hago yo, no un equipo de cuenta.
              — Brandon Muro
            </p>
          </div>

          <LeadForm />
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

      <MobileCta />
    </main>
  );
}
