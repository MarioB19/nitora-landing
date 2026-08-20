# Nítora — diagnóstico de distribución y reportería hotelera

Landing pública de adquisición B2B para el **diagnóstico de distribución y reportería hotelera en cinco días** de Nítora, dirigido a hoteles independientes mexicanos de 40–150 habitaciones.

Next.js 16 (App Router) · React 19 · Tailwind CSS 4 · TypeScript · desplegada en Vercel.

## Rutas

| Ruta | Qué es | Render |
|---|---|---|
| `/` | Landing de conversión y calculadora de carga operativa | Estático + cliente |
| `/privacidad` | Aviso de privacidad integral | Estático |
| `/api/lead` | Captura segura por Resend y/o webhook | Servidor |

La landing y el aviso se prerenderizan. La captura usa una ruta de servidor; no existe todavía una base de datos o CRM propio.

## Puesta en marcha

Requiere Node.js `^20.19.0`, `^22.13.0` o `>=24`, como indica `package.json`.

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # build de producción
npm run lint
npm test
```

## Configuración

Las variables están documentadas en `.env.example`. El formulario necesita al menos un destino para registrar leads:

- `RESEND_API_KEY` + `LEAD_NOTIFY_TO`, o
- `LEAD_WEBHOOK_URL`.

`LEAD_NOTIFY_FROM` permite usar un remitente de un dominio verificado. Los secretos se configuran en Vercel, nunca en el repositorio ni en variables `NEXT_PUBLIC_*`.

La URL pública vive en `app/site.ts` (`siteUrl`) y se usa para metadata, robots y sitemap.

## Despliegue en Vercel

1. Importar el repositorio en Vercel. El framework se detecta solo — no hay que tocar comandos de build, directorio de salida ni variables de entorno.
2. Conectar el dominio en **Settings → Domains** y crear en el DNS los registros que Vercel indique.

**Al conectar `nitora.online`:** si Vercel pide un CNAME en la raíz del dominio, ese registro no puede convivir con los `MX` del correo. Si `brandon@nitora.online` va a vivir en ese mismo dominio, usa el registro `A` que Vercel ofrece para la raíz, o publica en `www` y redirige la raíz. **Nunca borres los MX para acomodar la landing.**

## Conversión y atribución

1. El visitante revisa encaje, alcance, precio, ejemplo trazable y un escenario editable de carga operativa.
2. Completa un formulario nativo de dos pasos.
3. `/api/lead` valida consentimiento, origen, tamaño y campos; asigna un `leadId` y entrega por Resend y/o webhook.
4. `utm_source`, `utm_medium`, `utm_campaign`, `utm_content` y `utm_term` se conservan de forma estructurada.
5. Después de la captura se ofrece WhatsApp como canal opcional para añadir contexto.
6. La medición separa `lead_form_start`, `lead_form_submit`, `lead_captured`, `lead_capture_error` y `whatsapp_open`.

La evaluación de encaje es gratuita; el diagnóstico es pagado.

## Antes de publicar un cambio

- [ ] `npm run lint && npm run build` pasan.
- [ ] `npm test` pasa.
- [ ] `/privacidad` responde y está enlazada desde el formulario y el pie.
- [ ] Los cinco UTMs llegan al correo/webhook y al mensaje opcional de WhatsApp.
- [ ] El API devuelve un `leadId` y no registra datos personales en errores.
- [ ] Precio, alcance y exclusiones coinciden con `Ventas/Oferta — Diagnóstico de distribución en 5 días.md`.
- [ ] El correo visible es del dominio propio, no Gmail.
- [ ] Probado en móvil y escritorio; la tarjeta social carga con el dominio correcto.

## Aviso de privacidad

`app/privacidad/page.tsx` mantiene domicilio, fecha y retención como constantes visibles al inicio,
y declara Resend o Google Analytics sólo cuando la integración correspondiente está activa.

**El aviso debe revisarlo un profesional en protección de datos (LFPDPPP) antes de publicarse.**

## Reglas de contenido

- No publicar resultados, logos ni testimonios sin autorización escrita y separada.
- No convertir señales o estimaciones en garantías.
- Separar observado, declarado, estimado y por validar.
- Mantener precio y mensaje estables durante cada gate de adquisición.
- Actualizar con evidencia real, no con una conversación aislada.

## Origen

Migrada desde `Landing GTM/`, que compilaba para Cloudflare Workers a través de vinext y se publicaba en ChatGPT Sites. Aquí se eliminaron vinext, `@cloudflare/vite-plugin`, wrangler, Drizzle/D1, el worker y `.openai/` — ninguno se usaba para servir estas dos páginas.
