# Nítora — Margen Uno

Landing pública de adquisición B2B para **Margen Uno**: diagnóstico de distribución en cinco días para hoteles independientes mexicanos de 40–150 habitaciones.

Next.js 16 (App Router) · React 19 · Tailwind CSS 4 · TypeScript · desplegada en Vercel.

## Rutas

| Ruta | Qué es | Render |
|---|---|---|
| `/` | Landing de conversión | Estático |
| `/privacidad` | Aviso de privacidad integral | Estático |

Las dos se prerenderizan como contenido estático. No hay base de datos, API ni estado en servidor: el formulario arma un mensaje y abre WhatsApp desde el navegador.

## Puesta en marcha

Requiere Node.js `>=20.9.0`.

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # build de producción
npm run lint
```

## Configuración

Ninguna. No hay variables de entorno.

La URL pública vive como constante en `app/layout.tsx` (`siteUrl`), y solo se usa para que Next convierta en absolutas las rutas relativas de metadata — la imagen de Open Graph y el canonical. Si algún día cambia el dominio, se edita esa línea.

## Despliegue en Vercel

1. Importar el repositorio en Vercel. El framework se detecta solo — no hay que tocar comandos de build, directorio de salida ni variables de entorno.
2. Conectar el dominio en **Settings → Domains** y crear en el DNS los registros que Vercel indique.

**Al conectar `nitora.online`:** si Vercel pide un CNAME en la raíz del dominio, ese registro no puede convivir con los `MX` del correo. Si `brandon@nitora.online` va a vivir en ese mismo dominio, usa el registro `A` que Vercel ofrece para la raíz, o publica en `www` y redirige la raíz. **Nunca borres los MX para acomodar la landing.**

## Conversión y atribución

1. El visitante revisa encaje, alcance, precio y muestra sintética.
2. Completa el formulario mínimo.
3. La página abre WhatsApp. **El formulario no se almacena en ningún lado.**
4. `utm_source`, `utm_medium`, `utm_campaign`, `utm_content` y `utm_term` se agregan al cuerpo del mensaje para atribución manual.
5. Se emite el evento `nitora_lead_whatsapp` a `dataLayer` si hay un contenedor de Google Tag cargado.

La evaluación de encaje es gratuita; el diagnóstico Margen Uno es pagado.

## Antes de publicar un cambio

- [ ] `npm run lint && npm run build` pasan.
- [ ] `/privacidad` responde y está enlazada desde el formulario y el pie.
- [ ] Los cinco UTMs llegan al mensaje de WhatsApp.
- [ ] Precio, alcance y exclusiones coinciden con `Ventas/Oferta — Diagnóstico de distribución en 5 días.md`.
- [ ] El correo visible es del dominio propio, no Gmail.
- [ ] Probado en móvil y escritorio; la tarjeta social carga con el dominio correcto.

## Pendiente en `/privacidad`

`app/privacidad/page.tsx` tiene tres constantes al inicio del archivo. Mientras `DOMICILIO` diga `PENDIENTE`, la página muestra un aviso de "borrador — no publicar" que desaparece solo al completarlo.

**El aviso debe revisarlo un profesional en protección de datos (LFPDPPP) antes de publicarse.**

## Reglas de contenido

- No publicar resultados, logos ni testimonios sin autorización escrita y separada.
- No convertir señales o estimaciones en garantías.
- Separar observado, declarado, estimado y por validar.
- Mantener precio y mensaje estables durante cada gate de adquisición.
- Actualizar con evidencia real, no con una conversación aislada.

## Origen

Migrada desde `Landing GTM/`, que compilaba para Cloudflare Workers a través de vinext y se publicaba en ChatGPT Sites. Aquí se eliminaron vinext, `@cloudflare/vite-plugin`, wrangler, Drizzle/D1, el worker y `.openai/` — ninguno se usaba para servir estas dos páginas.
