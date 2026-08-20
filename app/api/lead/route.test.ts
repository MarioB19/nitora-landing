import assert from "node:assert/strict";
import { afterEach, test } from "node:test";
// @ts-expect-error -- Node 22 strip-types requiere la extensión TypeScript explícita.
import { POST } from "./route.ts";

const URL_API = "https://www.nitora.online/api/lead";
const ORIGEN = "https://www.nitora.online";
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const fetchOriginal = globalThis.fetch;
const entornoOriginal = {
  LEAD_WEBHOOK_URL: process.env.LEAD_WEBHOOK_URL,
  RESEND_API_KEY: process.env.RESEND_API_KEY,
  LEAD_NOTIFY_TO: process.env.LEAD_NOTIFY_TO,
  LEAD_NOTIFY_FROM: process.env.LEAD_NOTIFY_FROM,
};

const payloadValido = {
  submissionId: "550e8400-e29b-41d4-a716-446655440000",
  name: "Ana Pérez",
  hotel: "Hotel Ejemplo",
  role: "Revenue Manager",
  email: "ana@example.com",
  rooms: "80–150",
  pms: "Cloudbeds",
  pain: "Consolidar reportes de canales cada semana",
  consent: true,
  privacyVersion: "2026-08-20",
  utm: {
    source: "linkedin",
    medium: "paid_social",
    campaign: "piloto_01",
    content: "caso_distribucion",
    term: "hoteles_independientes",
  },
  landingUrl: "https://www.nitora.online/?utm_source=linkedin",
  referrer: "https://www.linkedin.com/",
  formWebsite: "",
};

function solicitud(payload: Record<string, unknown>, origin = ORIGEN, extraHeaders = {}) {
  return new Request(URL_API, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      origin,
      ...extraHeaders,
    },
    body: JSON.stringify(payload),
  });
}

function restaurarVariable(key: keyof typeof entornoOriginal) {
  const valor = entornoOriginal[key];
  if (valor === undefined) delete process.env[key];
  else process.env[key] = valor;
}

afterEach(() => {
  globalThis.fetch = fetchOriginal;
  for (const key of Object.keys(entornoOriginal) as (keyof typeof entornoOriginal)[]) {
    restaurarVariable(key);
  }
});

test("entrega por Resend con idempotencia y UTMs estructurados", async () => {
  delete process.env.LEAD_WEBHOOK_URL;
  process.env.RESEND_API_KEY = "test_key";
  process.env.LEAD_NOTIFY_TO = "owner@example.com";

  const llamadas: Array<{ input: string; init?: RequestInit }> = [];
  globalThis.fetch = (async (input: string | URL | Request, init?: RequestInit) => {
    llamadas.push({ input: String(input), init });
    return Response.json({ id: "email_123" });
  }) as typeof fetch;

  const respuesta = await POST(solicitud(payloadValido));
  assert.equal(respuesta.status, 200);
  assert.deepEqual(await respuesta.json(), {
    ok: true,
    leadId: payloadValido.submissionId,
  });
  assert.equal(llamadas.length, 1);
  assert.equal(llamadas[0].input, "https://api.resend.com/emails");

  const headers = new Headers(llamadas[0].init?.headers);
  assert.equal(headers.get("idempotency-key"), `nitora-lead/${payloadValido.submissionId}`);
  const correo = JSON.parse(String(llamadas[0].init?.body)) as { text: string };
  assert.match(correo.text, /utm_source: linkedin/);
  assert.match(correo.text, new RegExp(`Lead ID: ${payloadValido.submissionId}`));
});

test("conserva el webhook con payload estructurado y alias heredados", async () => {
  process.env.LEAD_WEBHOOK_URL = "https://hooks.example/leads";
  delete process.env.RESEND_API_KEY;
  delete process.env.LEAD_NOTIFY_TO;

  let llamada: { input: string; init?: RequestInit } | undefined;
  globalThis.fetch = (async (input: string | URL | Request, init?: RequestInit) => {
    llamada = { input: String(input), init };
    return new Response(null, { status: 204 });
  }) as typeof fetch;

  const respuesta = await POST(solicitud(payloadValido));
  assert.equal(respuesta.status, 200);
  assert.equal(llamada?.input, "https://hooks.example/leads");

  const headers = new Headers(llamada?.init?.headers);
  assert.equal(headers.get("idempotency-key"), `nitora-lead/${payloadValido.submissionId}`);
  const lead = JSON.parse(String(llamada?.init?.body)) as {
    leadId: string;
    utm: { campaign: string };
    origen: string;
    pagina: string;
  };
  assert.equal(lead.leadId, payloadValido.submissionId);
  assert.equal(lead.utm.campaign, "piloto_01");
  assert.match(lead.origen, /campaign: piloto_01/);
  assert.equal(lead.pagina, payloadValido.landingUrl);
});

test("rechaza un Origin ajeno antes de entregar", async () => {
  globalThis.fetch = (async () => {
    throw new Error("fetch no debe ejecutarse");
  }) as typeof fetch;

  const respuesta = await POST(solicitud(payloadValido, "https://sitio-ajeno.example"));
  assert.equal(respuesta.status, 403);
  assert.deepEqual(await respuesta.json(), { ok: false, error: "origen_no_permitido" });
});

test("exige consentimiento", async () => {
  const respuesta = await POST(solicitud({ ...payloadValido, consent: false }));
  assert.equal(respuesta.status, 422);
  assert.deepEqual(await respuesta.json(), { ok: false, error: "campos_invalidos" });
});

test("rechaza el cuerpo antes de leerlo cuando excede el límite declarado", async () => {
  const respuesta = await POST(
    solicitud(payloadValido, ORIGEN, { "content-length": String(16 * 1024 + 1) }),
  );
  assert.equal(respuesta.status, 413);
  assert.deepEqual(await respuesta.json(), { ok: false, error: "cuerpo_demasiado_grande" });
});

test("acepta attribution/page heredados y genera un leadId", async () => {
  delete process.env.LEAD_WEBHOOK_URL;
  process.env.RESEND_API_KEY = "test_key";
  process.env.LEAD_NOTIFY_TO = "owner@example.com";

  let correo = "";
  globalThis.fetch = (async (_input: string | URL | Request, init?: RequestInit) => {
    correo = String(init?.body);
    return Response.json({ id: "email_legacy" });
  }) as typeof fetch;

  const base: Record<string, unknown> = { ...payloadValido };
  delete base.submissionId;
  delete base.privacyVersion;
  delete base.utm;
  delete base.landingUrl;
  const respuesta = await POST(
    solicitud({
      ...base,
      attribution: "source: newsletter · medium: email · campaign: agosto",
      page: "https://www.nitora.online/",
    }),
  );
  const body = (await respuesta.json()) as { ok: boolean; leadId: string };

  assert.equal(respuesta.status, 200);
  assert.equal(body.ok, true);
  assert.match(body.leadId, UUID_RE);
  assert.match(correo, /utm_source: newsletter/);
});
