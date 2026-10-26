# BOSCO · Segunda landing (campaña Meta)

Landing y embudo de calificación para la campaña de **Daniel Barrios y Gabriel García** del proyecto BOSCO (Mérida, Yucatán).
Proyecto independiente de la primera landing de Marisol Caro: no comparte prospectos, calendarios, dominios, WhatsApp ni automatizaciones.

**Stack:** Vite 5 · HTML · CSS · JavaScript vanilla · funciones serverless de Vercel (`/api`). Sin frameworks ni dependencias de ejecución.

## Recorrido

```
Anuncio Meta → /  (VSL + información) → /registro (2 pasos) ─┬─ califica    → /agenda (calendario GHL) → /gracias?cita=1
                                                              └─ no califica → /no-califica
```

| Página | Archivo | Qué hace |
| --- | --- | --- |
| `/` | `index.html` → `src/pages/landing.js` | VSL arriba, promesa + CTA «Continuar registro», beneficios, proyecto y ubicación, avance de obra, testimonios, seguridad, asesora, CTA final, footer legal. Botón fijo en móvil. |
| `/registro` | `src/pages/registro.js` | Paso 1: nombre, WhatsApp (con lada), correo, consentimiento. Paso 2: estado, experiencia, plazo, objetivo, capital. Validación en español, trampa anti-bots. |
| `/agenda` | `src/pages/agenda.js` | Calendario de GHL con datos prellenados. Sin calendario configurado, no simula citas: ofrece WhatsApp. |
| `/gracias` | `src/pages/gracias.js` | Confirma registro o reserva y explica los siguientes pasos. Si GHL la abre dentro del iframe, se lleva a la ventana principal. |
| `/no-califica` | `src/pages/no-califica.js` | Mensaje cordial, sin cita. |
| `/aviso-de-privacidad` | `src/pages/privacidad.js` | Borrador de aviso integral; marca en amarillo los datos legales faltantes. |

## Ejecutar

```bash
npm install
cp .env.example .env.local   # opcional
npm run dev                  # http://localhost:5173 (incluye /api en local)
npm test                     # reglas del formulario y funciones /api (Node 18+)
npm run build                # genera dist/
```

## Dónde se cambia cada cosa

| Necesito… | Archivo |
| --- | --- |
| Textos, beneficios, testimonios, fotos de obra, datos legales | `src/content.js` |
| Mostrar cifras de testimonios o la tabla BOSCO vs CETES | `FLAGS` en `src/content.js` (apagadas por defecto) |
| IDs de GHL, WhatsApp, GA4, Pixel, dominio | Variables de entorno (`.env.example`) |
| Pasar la VSL a VTurb | Pegar el código de inserción en `src/vsl-embed.js` |
| Colores y diseño | `src/styles.css` (variables en `:root`) |

## Integraciones

Guía paso a paso en [`docs/INTEGRACIONES.md`](docs/INTEGRACIONES.md): webhook y workflow de GHL, calendario, WhatsApp, correo, Meta Pixel + CAPI y GA4.

## Antes de producción

Lista completa en [`docs/PENDIENTES-PRODUCCION.md`](docs/PENDIENTES-PRODUCCION.md). Mientras `VITE_FUNNEL_MODE` no sea `live`, el embudo muestra un aviso de versión de prueba.
