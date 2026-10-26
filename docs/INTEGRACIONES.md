# Integraciones · Segunda landing BOSCO

Estado al 24/10/2026: **todo está preparado en el código y nada está conectado a cuentas reales.**
Antes de conectar: confirmar la **subcuenta de GHL y el dominio definitivos** de esta campaña (el nuevo vendedor tiene su propio GHL). No reutilizar workflows, calendarios, números ni IDs de la primera landing sin verificarlos.

---

## 1. GoHighLevel · registro de prospectos

El formulario envía los datos a `/api/lead` (función de Vercel), que los reenvía a un **Inbound Webhook** de GHL. El navegador nunca ve la URL del webhook.

**En GHL (subcuenta de la campaña):**

1. Revisar el pipeline que Daniel ya adelantó antes de crear otro.
2. *Automation → Workflows → Create* → disparador **Inbound Webhook**. Copiar la URL.
3. En Vercel: `GHL_WEBHOOK_URL=<esa URL>` → redeploy.
4. Hacer un registro de prueba para que GHL capture el JSON de muestra.
5. Acción **Create/Update Contact** con este mapeo:

| Campo del JSON | Campo en GHL |
| --- | --- |
| `first_name`, `last_name`, `email`, `phone` (E.164) | Campos estándar del contacto |
| `estado`, `experiencia`, `plazo`, `objetivo`, `capital` | Campos personalizados (crearlos si no existen) |
| `califica` (`si` / `no` / vacío), `etapa_registro` (`parcial` / `completo`) | Campos personalizados |
| `consentimiento`, `consentimiento_texto`, `consentimiento_fecha` | Campos personalizados (respaldo del consentimiento) |
| `tags` | Etiquetas: `bosco-landing-2`, `registro-incompleto` / `registro-completo`, `califica` / `no-califica` |
| `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`, `fbclid`, `source`, `page_url` | Atribución |
| `lead_id` | Identificador para unir el envío parcial y el completo |

6. Ramas del workflow sugeridas:
   - `etapa_registro = parcial` → solo etiquetar (seguimiento manual de quien no terminó; **sin mensajes automáticos**).
   - `califica = si` → crear/actualizar oportunidad en la etapa inicial del pipeline.
   - `califica = no` → etiquetar; sin oportunidad ni mensajes.

Cada visitante produce dos envíos (parcial al terminar el paso 1 y completo al terminar el paso 2). GHL los une por correo/teléfono.

## 2. Calendario

1. Crear o elegir el calendario de esta campaña (Gabriel pidió los mismos horarios que la agenda de Marisol: **confirmar** responsable, duración, disponibilidad, zona horaria, Google Meet, buffer y límite de días).
2. Activar cancelación y reagendamiento y evitar dobles reservas (opción de conflicto con Google Calendar del asesor).
3. En la configuración del formulario del calendario: **al confirmar → redirigir a** `https://DOMINIO/gracias?cita=1`.
4. Copiar la URL del widget (*Calendars → Share → Permanent link / Embed*) → `VITE_GHL_CALENDAR_URL`.
5. La página `/agenda` agrega `first_name`, `last_name`, `email` y `phone` a la URL para prellenar. **Verificar** que el widget de la cuenta los tome.

## 3. WhatsApp

Recomendación: conservar el número de WhatsApp API ya aprobado (los prospectos reconocen a Marisol). Antes de conectarlo a GHL:

- Identificar proveedor actual, titular de la cuenta WABA y si admite migración o coexistencia.
- Revisar nombre aprobado, calificación de calidad, límite de mensajes y plantillas aprobadas.
- Evaluar qué pasa con las conversaciones existentes. **No prometer** que el historial se conserva.
- No comprar otro chip ni desconectar el número actual sin revisar lo anterior.

Automatizaciones (workflow con disparador *Appointment status / Customer booked appointment*), con plantillas aprobadas:
confirmación inmediata · recordatorio 24 h · recordatorio 2 h · cancelación · reagendamiento · no-show · seguimiento posterior.

`VITE_WHATSAPP_NUMBER` solo controla los botones de contacto visibles en `/agenda` y `/gracias`.

## 4. Correo

Correo proporcionado: `caromarisol@gmail.com` (dato recibido, **no** configurado como remitente).
Un Gmail no se puede autenticar como dominio remitente: lo recomendable es enviar desde un dominio propio verificado en GHL (SPF/DKIM/DMARC) y usar `caromarisol@gmail.com` como dirección de respuesta. Los correos acompañan a los WhatsApp; no duplicar el mismo mensaje en el mismo momento.

## 5. Meta Pixel + Conversions API

| Evento | Navegador (Pixel) | Servidor (CAPI) | Cuándo |
| --- | --- | --- | --- |
| `PageView` | Sí | — | Cada página |
| `Lead` | Sí | Sí, `/api/lead` | Registro completo **y calificado** |
| `Schedule` | Sí | Sí, `/api/event` | Llegada a `/gracias?cita=1` de alguien que calificó en la sesión |

- Ambos lados usan el mismo `event_id` → Meta deduplica.
- CAPI envía correo, teléfono, nombre y `external_id` cifrados con SHA-256, IP, user agent, `fbp` y `fbc`.
- Variables: `VITE_META_PIXEL_ID` (público) y `META_PIXEL_ID` + `META_CAPI_TOKEN` (servidor). El token **nunca** va con prefijo `VITE_`.
- Probar con `META_TEST_EVENT_CODE` en *Administrador de eventos → Probar eventos*; borrarlo al terminar.
- Alternativa más robusta para `Schedule`: enviarlo desde un workflow de GHL con el disparador de cita reservada. Si se hace, quitar la llamada de `/gracias` para no duplicar.
- Confirmar que los permisos de Meta Business corresponden a esta campaña (Gabriel cree que son los mismos del portafolio de Marisol: **verificar**).

## 6. Google Analytics 4

Crear la propiedad desde cero → flujo web → `VITE_GA4_ID=G-XXXX`.

Eventos que envía la página: `page_view`, `cta_click`, `vsl_play`, `vsl_progress` (25/50/75/100), `form_start`, `form_step_complete`, `generate_lead`, `lead_not_qualified`, `schedule_view`, `schedule_appointment`.
En GA4 marcar `generate_lead` y `schedule_appointment` como **eventos clave** (conversión principal: `schedule_appointment`).
Para depurar: abrir cualquier página con `?debug=1` (muestra los eventos en la consola).

## 7. VSL en VTurb

Cuando Daniel envíe el enlace: copiar el código de inserción de VTurb y pegarlo en `src/vsl-embed.js`. Mientras esté vacío se usa `public/assets/videos/vsl.mp4` (720p, optimizado para inicio rápido). No inventar la URL.

## 8. Dominio

Daniel informó que vinculó el dominio de Squarespace a GHL. Eso no confirma la publicación. Verificar: cuenta propietaria, dominio o subdominio final, DNS, HTTPS, a qué se apunta (funnel de GHL o este proyecto en Vercel) y que la URL pública abra. No tocar el DNS de la primera landing.

Si la landing se publica en Vercel: *Project → Settings → Domains* y crear los registros que indique Vercel en Squarespace. Después, `VITE_SITE_URL=https://dominio`.

## 9. Prueba integral (antes de pautar)

Visita con UTM → registro → calificación → contacto y oportunidad en GHL → reserva → WhatsApp y correo de confirmación → recordatorios → cancelación/reagendamiento → eventos en Meta (Probar eventos) y GA4 (DebugView).
Al terminar, **eliminar el contacto y el número de prueba** en GHL.
