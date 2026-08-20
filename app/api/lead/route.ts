import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server.js";

/**
 * Registro de solicitudes del diagnóstico de distribución y reportería hotelera.
 *
 * La ruta conserva dos destinos independientes: un webhook para automatización
 * y una notificación interna por Resend. Basta con que uno entregue el lead.
 * Las credenciales viven exclusivamente en variables del servidor.
 */

export const runtime = "nodejs";

const PRIVACY_VERSION = "2026-08-20";
const MAX_BODY_BYTES = 16 * 1024;
const TIMEOUT_MS = 8000;
const LARGO = { corto: 120, email: 254, utm: 240, largo: 1200 } as const;
const CORREO = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const HOSTS_CANONICOS = new Set(["nitora.online", "www.nitora.online"]);
const UTM_KEYS = ["source", "medium", "campaign", "content", "term"] as const;

type Cuerpo = Record<string, unknown>;
type UtmKey = (typeof UTM_KEYS)[number];
type EstadoLectura =
  | { ok: true; cuerpo: Cuerpo }
  | { ok: false; error: "cuerpo_demasiado_grande" | "json_invalido" };

interface Utm {
  source: string;
  medium: string;
  campaign: string;
  content: string;
  term: string;
}

interface Lead {
  leadId: string;
  submissionId: string;
  recibido: string;
  nombre: string;
  hotel: string;
  cargo: string;
  correo: string;
  habitaciones: string;
  pms: string;
  friccion: string;
  consent: true;
  privacyVersion: string;
  utm: Utm;
  landingUrl: string;
  referrer: string;
  /* Alias heredados para no romper webhooks creados con el payload anterior. */
  origen: string;
  pagina: string;
}

class ErrorEntrega extends Error {
  readonly codigo: string;

  constructor(codigo: string) {
    super(codigo);
    this.name = "ErrorEntrega";
    this.codigo = codigo;
  }
}

function respuestaJson(data: Record<string, unknown>, status = 200) {
  return NextResponse.json(data, {
    status,
    headers: { "cache-control": "no-store" },
  });
}

function esRegistro(valor: unknown): valor is Cuerpo {
  return typeof valor === "object" && valor !== null && !Array.isArray(valor);
}

/** Normaliza espacios sin truncar: un valor excesivo debe rechazarse. */
function texto(valor: unknown, max: number): string | null {
  if (valor === undefined || valor === null) return "";
  if (typeof valor !== "string") return null;
  const limpio = valor.replace(/\s+/g, " ").trim();
  return limpio.length <= max ? limpio : null;
}

function urlHttp(valor: string): URL | null {
  try {
    const url = new URL(valor);
    if (!["http:", "https:"].includes(url.protocol) || url.username || url.password) return null;
    return url;
  } catch {
    return null;
  }
}

function mismoSitio(origen: URL, destino: URL): boolean {
  if (origen.origin === destino.origin) return true;

  /* El dominio raíz redirige a www, pero ambos pertenecen al mismo sitio. */
  return (
    origen.protocol === "https:" &&
    destino.protocol === "https:" &&
    HOSTS_CANONICOS.has(origen.hostname.toLowerCase()) &&
    HOSTS_CANONICOS.has(destino.hostname.toLowerCase())
  );
}

function origenPermitido(request: Request): boolean {
  const valor = request.headers.get("origin");
  if (!valor) return false;

  const origen = urlHttp(valor);
  if (!origen) return false;

  try {
    return mismoSitio(origen, new URL(request.url));
  } catch {
    return false;
  }
}

async function leerCuerpo(request: Request): Promise<EstadoLectura> {
  const declarado = Number(request.headers.get("content-length"));
  if (Number.isFinite(declarado) && declarado > MAX_BODY_BYTES) {
    return { ok: false, error: "cuerpo_demasiado_grande" };
  }

  let crudo: string;
  try {
    crudo = await request.text();
  } catch {
    return { ok: false, error: "json_invalido" };
  }

  if (new TextEncoder().encode(crudo).byteLength > MAX_BODY_BYTES) {
    return { ok: false, error: "cuerpo_demasiado_grande" };
  }

  try {
    const cuerpo: unknown = JSON.parse(crudo);
    return esRegistro(cuerpo)
      ? { ok: true, cuerpo }
      : { ok: false, error: "json_invalido" };
  } catch {
    return { ok: false, error: "json_invalido" };
  }
}

function utmDesde(cuerpo: Cuerpo): Utm | null {
  const resultado: Utm = { source: "", medium: "", campaign: "", content: "", term: "" };

  if (cuerpo.utm !== undefined && cuerpo.utm !== null) {
    if (!esRegistro(cuerpo.utm)) return null;
    for (const key of UTM_KEYS) {
      const valor = texto(cuerpo.utm[key], LARGO.utm);
      if (valor === null) return null;
      resultado[key] = valor;
    }
    return resultado;
  }

  /* Compatibilidad con `source: x · medium: y` del formulario anterior. */
  const heredado = texto(cuerpo.attribution, LARGO.largo);
  if (heredado === null) return null;
  for (const parte of heredado.split(/\s*·\s*/)) {
    const separador = parte.indexOf(":");
    if (separador < 1) continue;
    const key = parte.slice(0, separador).trim() as UtmKey;
    if (!UTM_KEYS.includes(key)) continue;
    const valor = texto(parte.slice(separador + 1), LARGO.utm);
    if (valor === null) return null;
    resultado[key] = valor;
  }
  return resultado;
}

function describirUtm(utm: Utm, heredado: string): string {
  const partes = UTM_KEYS.filter((key) => utm[key]).map((key) => `${key}: ${utm[key]}`);
  return partes.join(" · ") || heredado || "Directo";
}

function construir(cuerpo: Cuerpo, request: Request): Lead | null {
  const idRecibido = texto(cuerpo.submissionId, 64);
  if (idRecibido === null || (idRecibido && !UUID.test(idRecibido))) return null;
  const leadId = idRecibido.toLowerCase() || randomUUID();

  const nombre = texto(cuerpo.name, LARGO.corto);
  const hotel = texto(cuerpo.hotel, LARGO.corto);
  const cargo = texto(cuerpo.role, LARGO.corto);
  const correo = texto(cuerpo.email, LARGO.email);
  const habitaciones = texto(cuerpo.rooms, LARGO.corto);
  const pms = texto(cuerpo.pms, LARGO.corto);
  const friccion = texto(cuerpo.pain, LARGO.largo);
  const version = texto(cuerpo.privacyVersion, 32);
  const landing = texto(cuerpo.landingUrl ?? cuerpo.page, LARGO.largo);
  const referente = texto(cuerpo.referrer, LARGO.largo);
  const heredado = texto(cuerpo.attribution, LARGO.largo);
  const utm = utmDesde(cuerpo);

  if (
    !nombre ||
    !hotel ||
    !cargo ||
    !correo ||
    !habitaciones ||
    !friccion ||
    pms === null ||
    version === null ||
    landing === null ||
    referente === null ||
    heredado === null ||
    !utm ||
    !CORREO.test(correo) ||
    cuerpo.consent !== true ||
    (version && version !== PRIVACY_VERSION)
  ) {
    return null;
  }

  const landingUrl = urlHttp(landing);
  const referrerUrl = referente ? urlHttp(referente) : null;
  if (!landingUrl || !mismoSitio(landingUrl, new URL(request.url)) || (referente && !referrerUrl)) {
    return null;
  }

  return {
    leadId,
    submissionId: leadId,
    recibido: new Date().toISOString(),
    nombre,
    hotel,
    cargo,
    correo,
    habitaciones,
    pms: pms || "Por confirmar",
    friccion,
    consent: true,
    privacyVersion: version || PRIVACY_VERSION,
    utm,
    landingUrl: landingUrl.toString(),
    referrer: referrerUrl?.toString() ?? "",
    origen: describirUtm(utm, heredado),
    pagina: landingUrl.toString(),
  };
}

async function porWebhook(lead: Lead): Promise<boolean> {
  const url = process.env.LEAD_WEBHOOK_URL;
  if (!url) return false;

  try {
    const respuesta = await fetch(url, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "idempotency-key": `nitora-lead/${lead.leadId}`,
      },
      body: JSON.stringify(lead),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (!respuesta.ok) throw new ErrorEntrega(`http_${respuesta.status}`);
    return true;
  } catch (error) {
    if (error instanceof ErrorEntrega) throw error;
    throw new ErrorEntrega("request_failed");
  }
}

async function porCorreo(lead: Lead): Promise<boolean> {
  const clave = process.env.RESEND_API_KEY;
  const destino = process.env.LEAD_NOTIFY_TO;
  if (!clave || !destino) return false;

  const lineasUtm = UTM_KEYS.filter((key) => lead.utm[key]).map(
    (key) => `utm_${key}: ${lead.utm[key]}`,
  );
  const cuerpo = [
    `Lead ID: ${lead.leadId}`,
    `Hotel: ${lead.hotel}`,
    `Nombre: ${lead.nombre}`,
    `Cargo: ${lead.cargo}`,
    `Correo: ${lead.correo}`,
    `Habitaciones: ${lead.habitaciones}`,
    `PMS / sistema: ${lead.pms}`,
    "",
    "Mayor fricción declarada:",
    lead.friccion,
    "",
    ...(lineasUtm.length ? lineasUtm : ["Origen: Directo"]),
    `Página: ${lead.landingUrl}`,
    ...(lead.referrer ? [`Referente: ${lead.referrer}`] : []),
    `Consentimiento: sí · aviso ${lead.privacyVersion}`,
    `Recibido: ${lead.recibido}`,
  ].join("\n");

  try {
    const respuesta = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        authorization: `Bearer ${clave}`,
        "content-type": "application/json",
        "idempotency-key": `nitora-lead/${lead.leadId}`,
      },
      body: JSON.stringify({
        from: process.env.LEAD_NOTIFY_FROM ?? "Nítora <onboarding@resend.dev>",
        to: [destino],
        reply_to: lead.correo,
        subject: `Evaluación de distribución — ${lead.hotel} (${lead.habitaciones} hab.)`,
        text: cuerpo,
      }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (!respuesta.ok) throw new ErrorEntrega(`http_${respuesta.status}`);
    return true;
  } catch (error) {
    if (error instanceof ErrorEntrega) throw error;
    throw new ErrorEntrega("request_failed");
  }
}

function resumirEntrega(
  resultados: PromiseSettledResult<boolean>[],
  configurados: readonly boolean[],
) {
  return resultados.map((resultado, index) => ({
    destino: index === 0 ? "webhook" : "resend",
    estado:
      resultado.status === "fulfilled"
        ? resultado.value
          ? "ok"
          : "no_configurado"
        : configurados[index] && resultado.reason instanceof ErrorEntrega
          ? resultado.reason.codigo
          : "request_failed",
  }));
}

export async function POST(request: Request) {
  if (!origenPermitido(request)) {
    return respuestaJson({ ok: false, error: "origen_no_permitido" }, 403);
  }

  const contentType = request.headers.get("content-type")?.toLowerCase() ?? "";
  if (!contentType.startsWith("application/json")) {
    return respuestaJson({ ok: false, error: "content_type_invalido" }, 415);
  }

  const lectura = await leerCuerpo(request);
  if (!lectura.ok) {
    const status = lectura.error === "cuerpo_demasiado_grande" ? 413 : 400;
    return respuestaJson({ ok: false, error: lectura.error }, status);
  }

  const idTentativo = texto(lectura.cuerpo.submissionId, 64);
  const leadIdTentativo = idTentativo && UUID.test(idTentativo) ? idTentativo.toLowerCase() : randomUUID();

  /* Trampa antispam: se responde como si la entrega hubiera ocurrido. */
  /* `company` se conserva sólo para clientes previos; el nombre nuevo evita autofill legítimo. */
  const trampa = texto(lectura.cuerpo.formWebsite ?? lectura.cuerpo.company, LARGO.corto);
  if (trampa) return respuestaJson({ ok: true, leadId: leadIdTentativo });
  if (trampa === null) return respuestaJson({ ok: false, error: "campos_invalidos" }, 422);

  const lead = construir(lectura.cuerpo, request);
  if (!lead) {
    return respuestaJson({ ok: false, error: "campos_invalidos" }, 422);
  }

  const configurados = [
    Boolean(process.env.LEAD_WEBHOOK_URL),
    Boolean(process.env.RESEND_API_KEY && process.env.LEAD_NOTIFY_TO),
  ] as const;
  const resultados = await Promise.allSettled([porWebhook(lead), porCorreo(lead)]);
  const entregado = resultados.some((resultado) => resultado.status === "fulfilled" && resultado.value);
  const entregas = resumirEntrega(resultados, configurados);

  if (!entregado) {
    console.error("[lead] no_entregado", { leadId: lead.leadId, entregas });
    return respuestaJson({ ok: false, error: "no_entregado" }, 502);
  }

  if (entregas.some((entrega) => entrega.estado !== "ok" && entrega.estado !== "no_configurado")) {
    console.warn("[lead] entrega_parcial", { leadId: lead.leadId, entregas });
  }

  return respuestaJson({ ok: true, leadId: lead.leadId });
}
