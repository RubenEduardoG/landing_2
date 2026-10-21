# Pendientes del cliente y bloqueadores de lanzamiento

Estado: NEEDS CLIENT ASSET / NEEDS GHL CONFIGURATION / NEEDS LEGAL APPROVAL

## Media (carpeta public/assets/ — restaurar desde el proyecto original)
- `/assets/imagenes/marisol.webp`: foto de reemplazo de Marisol solicitada por el cliente (screenshot 03). Mantener la actual como temporal hasta recibir la imagen real. No sustituir por imágenes genéricas.
- `/assets/imagenes/tabla-plusvalia-bosco.jpg`: tabla original de Marisol BOSCO vs CETES (screenshot 04, brief p.14). No se incluye en este paquete. Reemplaza el panel programado a mano.
- `/assets/videos/vsl.mp4` y `/assets/imagenes/construccion.webp` (poster del VSL).
- Testimonios: `/assets/videos/francelia.mp4`, `paul.mp4`, `majo.mp4` y sus posters; `/assets/imagenes/daniela.webp`.
- Noticias: `/assets/imagenes/noticias/heinekenmerida.png`, `walmartmerida.png`, `merida.png`.
- Obra: `/assets/imagenes/consur-temozon.jpg`, `consur-mio.jpg`.

## Legal y consentimiento (NEEDS LEGAL APPROVAL)
- Confirmar derechos de uso y consentimiento publicitario de los testimonios.
- Validar cifras: 15% de plusvalía histórica, plusvalía por testimonio, comparación con CETES y supuestos.
- Confirmar fecha de entrega DIC 2028 y etapa actual de obra con fotos fechadas.
- Aprobar aviso de privacidad, pie legal y textos de CONSUR.
- Confirmar si el responsable legal y los datos de contacto de Marisol aparecen en la campaña.

## GHL y mensajería (NEEDS GHL CONFIGURATION)
- URL embed del calendario y asignación del calendario (Agencia Bosco Blue, no el pipeline orgánico de Marisol).
- Reserva con límite de 2 días configurado en GHL.
- Endpoint o webhook de creación de contacto y pipeline de campaña.
- Número de WhatsApp Business y plantillas aprobadas por Meta.
- Automatizaciones de confirmación por WhatsApp y correo.

## Medición (NEEDS GHL / META CONFIGURATION)
- Pixel ID y mapeo aprobado de eventos.
- Meta Conversions API en backend con token guardado en variables de entorno, nunca en frontend.
- Deduplicación con event_id compartido.
- Eventos `Lead` y `Schedule` solo tras acciones reales y consentimiento.
