import { NextResponse } from "next/server";

/**
 * Registro de solicitudes del formulario de Margen Uno.
 *
 * El objetivo es no perder un lead aunque la persona nunca llegue a pulsar
 * "enviar" dentro de WhatsApp. La entrega es deliberadamente agnóstica: se
 * intentan los dos destinos configurados y basta con que uno responda.
 *
 *   LEAD_WEBHOOK_URL   POST con el lead en JSON. Sirve para Zapier, Make,
 *                      n8n, Google Sheets o cualquier endpoint propio.
 *   RESEND_API_KEY     Notificación por correo vía la API de Resend.
 *   LEAD_NOTIFY_TO     Destinatario de esa notificación.
 *   LEAD_NOTIFY_FROM   Remitente. Por omisión usa el remitente de pruebas de
 *                      Resend, que sólo entrega al correo dueño de la cuenta.
 *
 * Sin ninguna variable configurada la ruta responde 502 y deja el intento en
 * los logs de Vercel: el visitante nunca se entera, pero el fallo es visible.
 */

export const runtime = "nodejs";

const LARGO = { corto: 120, largo: 1200 } as const;
const CORREO = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const TIMEOUT_MS = 8000;

type Cuerpo = Record<string, unknown>;

interface Lead {
  recibido: string;
  nombre: string;
  hotel: string;
  cargo: string;
  correo: string;
  habitaciones: string;
  pms: string;
  friccion: string;
  origen: string;
  pagina: string;
}

function texto(valor: unknown, max: number): string {
  if (typeof valor !== "string") return "";
  return valor.replace(/\s+/g, " ").trim().slice(0, max);
}

function construir(cuerpo: Cuerpo): Lead {
  return {
    recibido: new Date().toISOString(),
    nombre: texto(cuerpo.name, LARGO.corto),
    hotel: texto(cuerpo.hotel, LARGO.corto),
    cargo: texto(cuerpo.role, LARGO.corto),
    correo: texto(cuerpo.email, LARGO.corto),
    habitaciones: texto(cuerpo.rooms, LARGO.corto),
    pms: texto(cuerpo.pms, LARGO.corto) || "Por confirmar",
    friccion: texto(cuerpo.pain, LARGO.largo),
    origen: texto(cuerpo.attribution, LARGO.largo) || "Directo",
    pagina: texto(cuerpo.page, LARGO.largo),
  };
}

async function porWebhook(lead: Lead): Promise<boolean> {
  const url = process.env.LEAD_WEBHOOK_URL;
  if (!url) return false;

  const respuesta = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(lead),
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  if (!respuesta.ok) throw new Error(`webhook respondió ${respuesta.status}`);
  return true;
}

async function porCorreo(lead: Lead): Promise<boolean> {
  const clave = process.env.RESEND_API_KEY;
  const destino = process.env.LEAD_NOTIFY_TO;
  if (!clave || !destino) return false;

  const cuerpo = [
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
    `Origen: ${lead.origen}`,
    `Página: ${lead.pagina}`,
    `Recibido: ${lead.recibido}`,
  ].join("\n");

  const respuesta = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      authorization: `Bearer ${clave}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.LEAD_NOTIFY_FROM ?? "Nítora <onboarding@resend.dev>",
      to: [destino],
      reply_to: lead.correo,
      subject: `Margen Uno — ${lead.hotel} (${lead.habitaciones} hab.)`,
      text: cuerpo,
    }),
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  if (!respuesta.ok) {
    throw new Error(`resend respondió ${respuesta.status}: ${await respuesta.text()}`);
  }
  return true;
}

export async function POST(request: Request) {
  let cuerpo: Cuerpo;
  try {
    cuerpo = (await request.json()) as Cuerpo;
  } catch {
    return NextResponse.json({ ok: false, error: "json_invalido" }, { status: 400 });
  }

  /* Trampa antispam: campo oculto que una persona nunca llena. Se acepta en
     silencio para no darle al bot la señal de que fue detectado. */
  if (texto(cuerpo.company, LARGO.corto)) {
    return NextResponse.json({ ok: true });
  }

  const lead = construir(cuerpo);
  if (!lead.nombre || !lead.hotel || !CORREO.test(lead.correo)) {
    return NextResponse.json({ ok: false, error: "campos_invalidos" }, { status: 422 });
  }

  const resultados = await Promise.allSettled([porWebhook(lead), porCorreo(lead)]);
  const entregado = resultados.some((r) => r.status === "fulfilled" && r.value === true);

  if (!entregado) {
    console.error("[lead] no entregado", {
      hotel: lead.hotel,
      correo: lead.correo,
      motivos: resultados.map((r) =>
        r.status === "rejected" ? String(r.reason) : "destino no configurado",
      ),
    });
    return NextResponse.json({ ok: false, error: "no_entregado" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
