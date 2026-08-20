"use client";

import { FormEvent, useRef, useState } from "react";

const WHATSAPP_NUMBER = "523329247910";
const PRIVACY_VERSION = "2026-08-20";
const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

type Draft = {
  name: string;
  hotel: string;
  role: string;
  email: string;
  rooms: string;
  pms: string;
  pain: string;
  consent: boolean;
};

type SubmitState = "idle" | "sending" | "success" | "error";

const initialDraft: Draft = {
  name: "",
  hotel: "",
  role: "",
  email: "",
  rooms: "",
  pms: "",
  pain: "",
  consent: false,
};

function track(event: string, detail: Record<string, unknown> = {}) {
  const trackingWindow = window as Window & {
    dataLayer?: Array<Record<string, unknown>>;
    gtag?: (...args: unknown[]) => void;
  };

  trackingWindow.dataLayer?.push({ event, form: "margen_uno", ...detail });
  trackingWindow.gtag?.("event", event, { form: "margen_uno", ...detail });
}

export function LeadForm() {
  const spamTrapRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState<1 | 2>(1);
  const [draft, setDraft] = useState<Draft>(initialDraft);
  const [state, setState] = useState<SubmitState>("idle");
  const [message, setMessage] = useState("");
  const [waUrl, setWaUrl] = useState<string | null>(null);
  const [leadId, setLeadId] = useState<string | null>(null);

  function update<K extends keyof Draft>(key: K, value: Draft[K]) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  function continueToQualification() {
    if (!draft.name.trim() || !draft.hotel.trim() || !draft.role.trim()) {
      setMessage("Completa nombre, hotel y cargo para continuar.");
      return;
    }
    if (!EMAIL.test(draft.email.trim())) {
      setMessage("Escribe un correo de trabajo válido para continuar.");
      return;
    }

    setMessage("");
    setStep(2);
    track("lead_form_start");
  }

  function buildWhatsAppUrl(submissionId: string, attribution: string) {
    const text = [
      "Hola, solicité una evaluación de Margen Uno en nitora.online.",
      "",
      `Referencia: ${submissionId}`,
      `Nombre: ${draft.name}`,
      `Hotel: ${draft.hotel}`,
      `Cargo: ${draft.role}`,
      `Correo: ${draft.email}`,
      `Habitaciones: ${draft.rooms}`,
      `PMS / sistema: ${draft.pms || "Por confirmar"}`,
      `Mayor fricción: ${draft.pain}`,
      attribution ? `Origen: ${attribution}` : "",
    ].filter(Boolean).join("\n");

    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (state === "sending") return;

    if (!draft.rooms || !draft.pain.trim() || !draft.consent) {
      setMessage("Completa el contexto y acepta el aviso de privacidad para enviar tu solicitud.");
      return;
    }

    const params = new URLSearchParams(window.location.search);
    const utm = {
      source: params.get("utm_source") ?? "",
      medium: params.get("utm_medium") ?? "",
      campaign: params.get("utm_campaign") ?? "",
      content: params.get("utm_content") ?? "",
      term: params.get("utm_term") ?? "",
    };
    const attribution = Object.entries(utm)
      .filter(([, value]) => value)
      .map(([key, value]) => `${key}: ${value}`)
      .join(" · ");
    const submissionId = crypto.randomUUID();
    const nextWaUrl = buildWhatsAppUrl(submissionId, attribution);

    setState("sending");
    setMessage("");
    setWaUrl(nextWaUrl);
    track("lead_form_submit", { step: 2 });

    try {
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          submissionId,
          ...draft,
          privacyVersion: PRIVACY_VERSION,
          formWebsite: spamTrapRef.current?.value ?? "",
          utm,
          landingUrl: window.location.href,
          referrer: document.referrer,
        }),
      });
      const result = await response.json().catch(() => null) as { ok?: boolean; leadId?: string } | null;

      if (!response.ok || !result?.ok) throw new Error("capture_failed");

      const capturedLeadId = result.leadId ?? submissionId;
      setLeadId(capturedLeadId);
      setState("success");
      track("lead_captured", { lead_id: capturedLeadId });
    } catch {
      setState("error");
      setMessage(
        "No pudimos registrar la solicitud automáticamente. Tus datos siguen en este navegador; puedes reintentar o continuar por WhatsApp.",
      );
      track("lead_capture_error");
    }
  }

  if (state === "success") {
    return (
      <div className="lead-form lead-success" role="status" aria-live="polite">
        <p className="scope-eyebrow">Solicitud recibida</p>
        <h3>Ya tengo el contexto de {draft.hotel}.</h3>
        <p>
          Revisaré si existe una pregunta útil para Margen Uno y te contactaré por el correo que
          compartiste. No subas archivos todavía.
        </p>
        {waUrl && (
          <a
            className="button button-accent full"
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track("whatsapp_open", { lead_id: leadId })}
          >
            Añadir contexto por WhatsApp <span aria-hidden="true">→</span>
          </a>
        )}
        <small className="lead-reference">Referencia: {leadId}</small>
      </div>
    );
  }

  return (
    <form className="lead-form" onSubmit={handleSubmit} noValidate>
      <div className="form-heading">
        <div>
          <span>Solicitar evaluación gratuita</span>
          <small>Paso {step} de 2</small>
        </div>
        <div className="form-progress" aria-label={`Paso ${step} de 2`}>
          <i className="active" />
          <i className={step === 2 ? "active" : ""} />
        </div>
      </div>

      {step === 1 ? (
        <div className="form-step" key="contacto">
          <p className="form-step-copy">Primero, ¿con quién y con qué hotel hablaré?</p>
          <div className="form-grid">
            <label>
              Nombre *
              <input value={draft.name} onChange={(event) => update("name", event.currentTarget.value)} autoComplete="name" placeholder="Tu nombre" />
            </label>
            <label>
              Hotel *
              <input value={draft.hotel} onChange={(event) => update("hotel", event.currentTarget.value)} autoComplete="organization" placeholder="Nombre del hotel" />
            </label>
            <label>
              Cargo *
              <input value={draft.role} onChange={(event) => update("role", event.currentTarget.value)} autoComplete="organization-title" placeholder="Gerencia, Revenue, Operaciones…" />
            </label>
            <label>
              Correo de trabajo *
              <input value={draft.email} onChange={(event) => update("email", event.currentTarget.value)} type="email" autoComplete="email" placeholder="nombre@hotel.com" />
            </label>
          </div>
          {message && <p className="form-error" role="alert">{message}</p>}
          <button className="button button-accent full" type="button" onClick={continueToQualification}>
            Continuar <span aria-hidden="true">→</span>
          </button>
          <p className="form-note">No pedimos archivos, accesos ni datos de huéspedes en este formulario.</p>
        </div>
      ) : (
        <div className="form-step" key="encaje">
          <p className="form-step-copy">Ahora, el contexto mínimo para saber si el diagnóstico aplica.</p>
          <div className="form-grid">
            <label>
              Habitaciones *
              <select value={draft.rooms} onChange={(event) => update("rooms", event.currentTarget.value)}>
                <option value="" disabled>Selecciona un rango</option>
                <option>Menos de 40</option>
                <option>40–79</option>
                <option>80–150</option>
                <option>Más de 150</option>
              </select>
            </label>
            <label>
              PMS o sistema principal
              <input value={draft.pms} onChange={(event) => update("pms", event.currentTarget.value)} placeholder="Cloudbeds, Opera, Excel…" />
            </label>
            <label className="wide">
              ¿Qué decisión o tarea consume más tiempo? *
              <textarea value={draft.pain} onChange={(event) => update("pain", event.currentTarget.value)} rows={4} placeholder="Consolidar reportes, revisar comisiones, entender cancelaciones…" />
            </label>
          </div>
          <div className="sr-only" aria-hidden="true">
            <label htmlFor="nitora-contact-website">No llenes este campo</label>
            <input
              ref={spamTrapRef}
              id="nitora-contact-website"
              name="nitora_contact_website"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              data-form-type="other"
            />
          </div>
          <label className="consent">
            <input
              name="consent"
              type="checkbox"
              checked={draft.consent}
              onChange={(event) => update("consent", event.currentTarget.checked)}
            />
            <span>
              Acepto ser contactado para evaluar el diagnóstico y confirmo que leí el{" "}
              <a href="/privacidad">aviso de privacidad</a>.
            </span>
          </label>
          {message && <p className="form-error" role="alert">{message}</p>}
          <div className="form-actions">
            <button className="button button-ghost" type="button" onClick={() => { setStep(1); setMessage(""); }}>
              Atrás
            </button>
            <button className="button button-accent" type="submit" disabled={state === "sending"}>
              {state === "sending" ? "Registrando…" : "Enviar solicitud"}
              {state !== "sending" && <span aria-hidden="true">→</span>}
            </button>
          </div>
          <p className="form-note">Primero registramos la solicitud. Después podrás añadir contexto por WhatsApp.</p>
          <details className="privacy-disclosure" id="uso-datos">
            <summary>Cómo usamos estos datos</summary>
            <p>
              Nítora usa nombre, correo profesional, hotel, cargo y contexto operativo únicamente
              para evaluar el encaje, responderte y coordinar Margen Uno. Puedes ejercer tus
              derechos escribiendo a <a href="mailto:privacidad@nitora.online">privacidad@nitora.online</a>.
            </p>
          </details>
        </div>
      )}

      {state === "error" && waUrl && (
        <div className="form-fallback">
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track("whatsapp_open", { fallback: true })}
          >
            Continuar por WhatsApp →
          </a>
        </div>
      )}
    </form>
  );
}
