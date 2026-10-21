# Reporte de implementación · BOSCO landing

## Estado
- DONE: estructura en módulos, copy en es-MX, responsive, formulario con validación, regla de calificación, rutas /gracias y /no-califica, rewrites de Vercel, placeholders de media.
- NEEDS CLIENT ASSET: ver PENDING_CLIENT_ASSETS.md.
- NEEDS GHL CONFIGURATION: calendario, endpoint de contactos, WhatsApp, automatizaciones.
- NEEDS LEGAL APPROVAL: cifras, testimonios, aviso de privacidad, pie legal.

## Cambios principales
1. `src/main.js` dividido en `config.js`, `content.js`, `templates.js`, `qualify.js`, `media.js`.
2. Hero: oferta más corta; se mantiene el titular y el CTA. Se eliminó la frase secundaria.
3. Testimonios: intro aprobada, nombres y cifras más grandes, mayor contraste, disclaimer discreto.
4. Marisol: imagen actual como temporal, con slot fácil de reemplazar.
5. Plusvalía: panel hecho a mano reemplazado por el slot de `tabla-plusvalia-bosco.jpg` con placeholder.
6. Formulario: validación de WhatsApp (10–15 dígitos), consentimiento obligatorio, mensaje de aclaración para "Para irme a vivir a Mérida", opción de calendario tras calificar.
7. Calificación: sin capital → /no-califica; con capital → calendario. El formulario no envía datos todavía.
8. /gracias sin promesas falsas de cita confirmada. /no-califica sin prometer una guía que no existe.
9. Accesibilidad: foco visible, botón de audio con aria-pressed, labels,