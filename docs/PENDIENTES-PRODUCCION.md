# Pendientes para producción

Marcar cada punto solo cuando esté **probado**, no solo configurado.

## Cuentas y accesos
- [ ] Subcuenta de GHL definitiva de esta campaña (el nuevo vendedor tiene su propio GHL).
- [ ] Dominio o subdominio definitivo, DNS y HTTPS (Daniel reportó vincular Squarespace con GHL; sin verificar).
- [ ] Revisar el pipeline que adelantó Daniel antes de crear uno nuevo.
- [ ] Calendario: responsable, duración, horarios, zona horaria, Google Meet, cancelación/reagendamiento, redirección a `/gracias?cita=1`.
- [ ] WhatsApp API: proveedor actual, titularidad/WABA, migración o coexistencia, plantillas, consentimiento.
- [ ] Remitente de correo autenticado (dominio propio) y respuesta a `caromarisol@gmail.com`.
- [ ] Permisos de Meta Business, Pixel ID y token de CAPI de esta campaña.
- [ ] Propiedad GA4 nueva.
- [ ] Enlace definitivo de VTurb (pago/activación pendiente de confirmar).
- [ ] Exportación de Pancake **filtrada** a «Seguimiento auto» (101 según capturas), con respaldo, teléfonos normalizados, duplicados revisados y sin mensajes masivos al importar.

## Contenido a validar con documentos (marcado `[VERIFICAR]` en `src/content.js`)
- [ ] «Más de 50 familias regias han invertido».
- [ ] Plusvalía histórica del 15% en cuatro años.
- [ ] La tabla BOSCO vs CETES usa 7% y es una proyección a futuro → apagada (`FLAGS.plusvaliaTable`).
- [ ] Cifras de testimonios ($385,000 / $400,000 MXN) → apagadas (`FLAGS.testimonialFigures`). Confirmar autorización de uso de imagen y video de cada testimonio.
- [ ] Contrato adherido a PROFECO (número de registro).
- [ ] Licencias, factibilidades y permisos vigentes.
- [ ] CONSUR, 15 años de experiencia (el sitio de CONSUR menciona «más de 10 años»).
- [ ] Entrega estimada diciembre 2028.
- [ ] Departamentos de 1 y 2 recámaras, más de 15 amenidades (tomado del banner de la foto de inversionistas).
- [ ] 20 minutos de la playa y del Centro Histórico.
- [ ] Enganche desde $250,000 MXN y opciones de capital del formulario.
- [ ] Marisol Caro como asesora que atiende las citas de esta campaña; «más de 60 familias»; que invirtió en el proyecto.
- [ ] Fecha y porcentaje de avance de las fotos de obra (tomadas de la VSL).
- [ ] Datos del responsable y correo ARCO para el aviso de privacidad (`LEGAL` en `src/content.js`) y revisión legal.

## Activación
- [ ] Variables cargadas en Vercel (ver `.env.example`).
- [ ] Prueba integral completa (ver `docs/INTEGRACIONES.md` §9).
- [ ] `VITE_FUNNEL_MODE=live` y redeploy.
- [ ] Borrar `META_TEST_EVENT_CODE` y el contacto de prueba.
