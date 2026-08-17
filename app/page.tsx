"use client";

import { FormEvent, useState } from "react";

const WHATSAPP_NUMBER = "523321790549";

const deliverables = [
  "Mapa del flujo actual de información",
  "Horas mensuales estimadas en tareas manuales",
  "Señales de posibles fugas de ingreso neto",
  "Tres oportunidades priorizadas por impacto y esfuerzo",
  "Plan de acción de 30 días con una métrica principal",
  "Resumen y sesión ejecutiva de resultados",
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
      "Los revisamos antes de iniciar el plazo y solicitar el pago. Si no contienen los campos mínimos para responder una pregunta útil, te explicamos la limitación y no comenzamos el diagnóstico.",
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

export default function Home() {
  const [sent, setSent] = useState(false);

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

    const trackingWindow = window as Window & { dataLayer?: Array<Record<string, unknown>> };
    trackingWindow.dataLayer?.push({ event: "nitora_lead_whatsapp", form: "margen_uno" });

    setSent(true);
    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`,
      "_blank",
      "noopener,noreferrer",
    );
  }

  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#inicio" aria-label="Nítora, inicio">
          <span className="brand-mark" aria-hidden="true"><span>N</span><i /></span>
          <span className="brand-copy">
            <strong>Nítora</strong>
            <small>Inteligencia hotelera</small>
          </span>
        </a>
        <nav aria-label="Navegación principal">
          <a href="#oferta">Qué recibes</a>
          <a href="#ejemplo">Ejemplo</a>
          <a className="nav-cta" data-cta="header" href="#solicitar">Ver si mi hotel aplica</a>
        </nav>
      </header>

      <section className="hero" id="inicio">
        <div className="hero-copy">
          <p className="eyebrow"><span /> Margen Uno · diagnóstico para hoteles independientes</p>
          <h1>Tres decisiones para proteger <em>margen y liberar horas.</em></h1>
          <p className="hero-lead">
            En cinco días, Nítora cruza las exportaciones de reservas y canales que
            tu equipo ya genera. Identificamos señales de fuga de margen y tiempo,
            estimamos su impacto y priorizamos qué conviene corregir primero.
          </p>
          <p className="hero-assurance">Sin integraciones, credenciales ni migrar tu PMS.</p>
          <div className="hero-actions">
            <a className="button button-primary" data-cta="hero-fit" href="#solicitar">Ver si mi hotel aplica <span>→</span></a>
            <a className="button button-ghost" data-cta="hero-sample" href="#ejemplo">Ver diagnóstico de muestra</a>
          </div>
          <div className="hero-offer-line">
            <strong>$5,900 MXN + IVA</strong>
            <span>1 propiedad</span>
            <span>El plazo inicia al validar archivos</span>
          </div>
          <div className="fit-line" aria-label="Perfil de hotel ideal">
            <span>Para hoteles independientes</span>
            <span>40–150 habitaciones</span>
            <span>3+ canales activos</span>
          </div>
        </div>

        <div className="hero-visual" aria-label="Vista previa del diagnóstico">
          <div className="visual-grid" aria-hidden="true" />
          <article className="mini-report">
            <div className="mini-report-head">
              <div>
                <span className="micro-label">NÍTORA · MARGEN UNO</span>
                <h2>Distribución · 90 días</h2>
              </div>
              <span className="sample-tag">MUESTRA</span>
            </div>
            <div className="report-score">
              <div>
                <small>Oportunidades priorizadas</small>
                <strong>3</strong>
              </div>
              <div className="score-ring"><span>01</span></div>
            </div>
            <div className="finding-list">
              <div className="finding">
                <span className="finding-index">01</span>
                <div><strong>Reportería manual duplicada</strong><small>Impacto en horas · confianza alta</small></div>
                <span className="finding-state high">ALTA</span>
              </div>
              <div className="finding">
                <span className="finding-index">02</span>
                <div><strong>Promociones superpuestas</strong><small>Ingreso neto · requiere validar</small></div>
                <span className="finding-state medium">MEDIA</span>
              </div>
              <div className="finding">
                <span className="finding-index">03</span>
                <div><strong>Cancelaciones sin lectura común</strong><small>Proceso · confianza media</small></div>
                <span className="finding-state medium">MEDIA</span>
              </div>
            </div>
            <div className="mini-report-foot">
              <span>Nítora · datos sintéticos para demostración</span>
              <span>01 / 01</span>
            </div>
          </article>
          <div className="floating-note">Sin acceso directo a sistemas</div>
        </div>
      </section>

      <section className="mechanism-bar" aria-label="Resumen de Margen Uno">
        <div><strong>5 días</strong><span>de diagnóstico</span></div>
        <div><strong>3 acciones</strong><span>priorizadas</span></div>
        <div><strong>CSV o Excel</strong><span>sin integración</span></div>
        <div><strong>Antes de cobrar</strong><span>validamos tus archivos</span></div>
      </section>

      <section className="problem-section section-shell">
        <div className="section-intro">
          <h2>¿Por dónde empiezas?</h2>
          <p>Tus cifras viven entre PMS, canales, comisiones, cancelaciones y hojas manuales. Margen Uno organiza esa evidencia para convertir una sospecha operativa en una decisión con prioridad, métrica y siguiente paso.</p>
        </div>
        <div className="benefit-grid two">
          <article>
            <h3>Cuánto tiempo se va en preparar el reporte</h3>
            <p>Mapeamos las horas que tu equipo declara invirtiendo en juntar, conciliar y revisar información antes de poder decidir algo con ella.</p>
          </article>
          <article>
            <h3>Qué es evidencia y qué es suposición</h3>
            <p>Cada señal declara de qué archivo salió, qué supone y qué tan seguros estamos. Las que no alcanzan para concluir se marcan como tales, no se maquillan.</p>
          </article>
        </div>
      </section>

      <section className="method-section" id="metodo">
        <div className="section-shell method-shell">
          <div className="section-intro light">
                        <h2>De archivos dispersos a un plan en cinco días.</h2>
          </div>
          <ol className="steps">
            <li>
              <span>1</span>
              <div><small>DÍA 0</small><h3>Confirmamos el encaje</h3><p>Una llamada de 30 minutos para conocer canales, sistemas, responsables y el problema que quieres medir.</p></div>
            </li>
            <li>
              <span>2</span>
              <div><small>DÍAS 1–3</small><h3>Revisamos tus exportaciones</h3><p>Tu equipo descarga CSV o Excel. No pedimos credenciales ni modificamos tarifas, reservas o inventario.</p></div>
            </li>
            <li>
              <span>3</span>
              <div><small>DÍAS 4–5</small><h3>Priorizamos y entregamos</h3><p>Presentamos hallazgos, limitaciones y un experimento de 30 días con métrica y criterio de decisión.</p></div>
            </li>
          </ol>
        </div>
      </section>

      <section className="deliverable-section section-shell" id="oferta">
        <div className="deliverable-copy">
                    <h2>Una lectura ejecutiva, no otra carpeta de gráficas.</h2>
          <p>Margen Uno resume qué observamos, qué estimamos, qué conviene validar y cuál debería ser el siguiente movimiento.</p>
          <ul>
            {deliverables.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </div>
        <aside className="scope-card">
          <p className="micro-label">NÍTORA · OFERTA DE ENTRADA</p>
          <h3>Margen Uno</h3>
          <div className="price"><strong>$5,900</strong><span>MXN + IVA</span></div>
          <p>Diagnóstico de distribución y reportería para una propiedad.</p>
          <div className="scope-divider" />
          <p className="scope-start"><strong>Riesgo acotado:</strong> el pago se solicita después de confirmar que tus archivos permiten realizar un diagnóstico útil.</p>
          <a className="button button-primary full" data-cta="offer" href="#solicitar">Quiero validar mis archivos <span>→</span></a>
          <small>Cupo piloto: cinco hoteles · precio experimental.</small>
        </aside>
      </section>

      <section className="sample-section" id="ejemplo">
        <div className="sample-top section-shell">
          <div className="section-intro">
                        <h2>Así se entrega una decisión.</h2>
            <p>Revisa una muestra completa con datos sintéticos. Verás cómo distinguimos evidencia, estimaciones, confianza y acciones antes de compartir información de tu hotel.</p>
          </div>
          <button className="button button-ghost print-button" type="button" onClick={() => window.print()}>Guardar muestra como PDF</button>
        </div>

        <article className="report-sheet" aria-label="Diagnóstico de distribución de muestra">
          <div className="report-watermark">EJEMPLO · DATOS SINTÉTICOS</div>
          <header className="sheet-header">
            <div><p className="micro-label">NÍTORA · MARGEN UNO</p><h2>Hotel Mirador</h2></div>
            <div className="sheet-meta"><span>86 HAB.</span><span>1 PROPIEDAD</span><span>90 DÍAS</span></div>
          </header>
          <div className="executive-line">
            <span>Resumen</span>
            <p>Detectamos <strong>3 oportunidades</strong> que podrían reducir carga manual y proteger ingreso neto visible, sujetas a validación.</p>
            <div className="confidence"><small>CONFIANZA GENERAL</small><strong>MEDIA</strong></div>
          </div>
          <div className="baseline-grid">
            <div><small>HORAS DECLARADAS</small><strong>9.5 h</strong><span>por semana</span></div>
            <div><small>FUENTES REVISADAS</small><strong>4</strong><span>sistemas / hojas</span></div>
            <div><small>MEZCLA OTA</small><strong>38%</strong><span>sobre reservas</span></div>
            <div><small>CALIDAD DE DATOS</small><strong>76%</strong><span>campos utilizables</span></div>
          </div>
          <div className="sheet-table-wrap">
            <div className="sheet-table-title"><h3>Hallazgos priorizados</h3><span>IMPACTO ESTIMADO ≠ RESULTADO GARANTIZADO</span></div>
            <div className="sheet-table">
              <div className="table-row table-head"><span>PRIORIDAD</span><span>HALLAZGO Y EVIDENCIA</span><span>IMPACTO</span><span>CONFIANZA</span></div>
              <div className="table-row"><span className="priority">01</span><span><strong>Reportería duplicada</strong><small>3 hojas repiten campos de PMS y channel manager.</small></span><span><strong>22 h / mes</strong><small>estimación</small></span><span><b className="pill high">ALTA</b></span></div>
              <div className="table-row"><span className="priority">02</span><span><strong>Promociones superpuestas</strong><small>Dos descuentos coinciden en 14% de la muestra.</small></span><span><strong>$18–31 mil</strong><small>requiere validar</small></span><span><b className="pill medium">MEDIA</b></span></div>
              <div className="table-row"><span className="priority">03</span><span><strong>Cancelaciones sin lectura común</strong><small>El motivo no está normalizado entre canales.</small></span><span><strong>7 h / mes</strong><small>estimación</small></span><span><b className="pill medium">MEDIA</b></span></div>
            </div>
          </div>
          <div className="experiment-box">
            <span>PRÓXIMO EXPERIMENTO · 30 DÍAS</span>
            <p><strong>Automatizar un único reporte semanal de pickup.</strong> Medir horas de preparación antes/después y decisiones ejecutadas. Continuar si reduce ≥50% del tiempo sin aumentar errores.</p>
          </div>
          <footer className="sheet-footer"><span>Fuentes: exportaciones de muestra + entrevista simulada</span><span>No constituye auditoría financiera ni garantía de ingresos · 01/01</span></footer>
        </article>
      </section>

      <section className="rigor-section section-shell">
        <div className="section-intro">
          <h2>Cada hallazgo dice qué sabemos y qué falta validar.</h2>
          <p>Señalamos de qué archivo o conversación proviene cada observación. Las estimaciones llevan sus supuestos y un nivel explícito de confianza, y cada recomendación viene con una métrica y un criterio para decidir si continuar. Si algo no alcanza para concluir, lo dice.</p>
        </div>
      </section>

      <section className="fit-section">
        <div className="section-shell fit-shell">
          <div className="fit-head">
                        <h2>Margen Uno funciona mejor si hoy…</h2>
          </div>
          <div className="fit-column">
            <h3>Buen encaje</h3>
            <ul>
              <li><span>✓</span>Operas un hotel independiente de 40–150 habitaciones.</li>
              <li><span>✓</span>Vendes mediante tres o más canales.</li>
              <li><span>✓</span>Tu equipo consolida reportes manualmente.</li>
              <li><span>✓</span>Puedes exportar reservas y canales en CSV o Excel.</li>
            </ul>
          </div>
          <div className="fit-column not-fit">
            <h3>No es este servicio</h3>
            <ul>
              <li><span>×</span>Auditoría financiera, fiscal o contractual.</li>
              <li><span>×</span>Migración o reemplazo de PMS.</li>
              <li><span>×</span>Implementación tecnológica incluida.</li>
              <li><span>×</span>Garantía de ahorro o nuevos ingresos.</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="faq-section section-shell">
        <div className="section-intro">
                    <h2>Antes de compartir un archivo.</h2>
        </div>
        <div className="faq-list">
          {faqs.map((faq, index) => (
            <details key={faq.question} open={index === 0}>
              <summary><span>{faq.question}</span><b>+</b></summary>
              <p>{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="contact-section" id="solicitar">
        <div className="section-shell contact-shell">
          <div className="contact-copy">
            <p className="eyebrow"><span /> Primer paso · sin costo</p>
            <h2>Confirma si tus archivos pueden responder una pregunta útil.</h2>
            <p>Comparte el contexto mínimo. Revisaremos el encaje y te diremos qué exportaciones serían necesarias. Si la información no permite un diagnóstico sólido, te lo diremos antes de cobrar.</p>
            <div className="contact-promise">
              <p><strong>30 minutos</strong>Una conversación inicial para definir la pregunta.</p>
              <p><strong>Antes de cobrar</strong>Validamos que los archivos sean suficientes.</p>
              <p><strong>Sin accesos</strong>No solicitamos credenciales ni datos de tarjeta.</p>
            </div>
            <p className="founder-note">La evaluación y la entrega las hago yo. Durante el piloto contesto yo. — Brandon Muro</p>
          </div>

          <form className="lead-form" onSubmit={handleSubmit}>
            <div className="form-heading"><span>Ver si mi hotel aplica</span><small>Campos obligatorios *</small></div>
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
              <label className="wide">PMS o sistema principal<input name="pms" placeholder="Ej. Cloudbeds, Opera, Excel…" /></label>
              <label className="wide">¿Qué tarea consume más tiempo? *<textarea name="pain" required rows={4} placeholder="Ej. consolidar reportes, revisar comisiones, entender cancelaciones…" /></label>
            </div>
            <label className="consent"><input type="checkbox" required /> <span>Acepto ser contactado para evaluar el diagnóstico y confirmo que leí el <a href="/privacidad">aviso de privacidad</a>.</span></label>
            <button className="button button-accent full" data-cta="form-whatsapp" type="submit">Validar mi hotel por WhatsApp <span>→</span></button>
            <p className="form-note">Al continuar se abrirá WhatsApp con esta información. Tú decides si enviarla; esta página no la almacena.</p>
            <details className="privacy-disclosure" id="uso-datos">
              <summary>Cómo usamos estos datos</summary>
              <p>Brandon Muro es el responsable del contacto. Nombre, correo profesional, hotel, cargo y contexto operativo se usan únicamente para evaluar el encaje, responder tu solicitud y coordinar Margen Uno. No pedimos información sensible ni datos de pago. Puedes solicitar acceso, corrección, cancelación u oposición escribiendo a <a href="mailto:privacidad@nitora.online">privacidad@nitora.online</a>.</p>
            </details>
            {sent && <p className="success" role="status">WhatsApp se abrió en otra pestaña. Si no lo ves, permite ventanas emergentes e inténtalo de nuevo.</p>}
          </form>
        </div>
      </section>

      <footer className="site-footer">
        <div className="footer-brand"><span className="brand-mark" aria-hidden="true"><span>N</span><i /></span><div><strong>Nítora</strong><small>De datos dispersos a decisiones claras.</small></div></div>
        <div className="footer-links"><a href="mailto:privacidad@nitora.online">Contacto</a><a href="/privacidad">Aviso de privacidad</a><a href="#metodo">Metodología</a><a href="#inicio">Volver arriba ↑</a></div>
        <p>Nítora · Programa piloto · México · No constituye auditoría financiera ni garantía de ingresos.</p>
      </footer>
      <a className="mobile-cta" data-cta="mobile-sticky" href="#solicitar">Ver si mi hotel aplica <span>→</span></a>
    </main>
  );
}
