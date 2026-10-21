# BOSCO Campaña Meta — Primera etapa

Landing independiente en español, construida con Vite, HTML, CSS y JavaScript.

## Ejecutar

```bash
npm install
npm run dev
```

Abrir la URL que indique Vite (normalmente http://localhost:5173).

## Estado actual

- Landing responsive con branding BOSCO v2 y secciones del brief v9.
- Formulario local de demostración: **NO envía ni almacena datos**.
- Si se selecciona «No tengo capital disponible», redirige a `/no-califica`.
- Si califica, muestra espacio reservado para calendario GHL. **NO crea reservas reales**.
- `/gracias` es una página de presentación; solo debe mostrarse después de confirmación real de GHL.
- Videos/testimonios e imágenes reutilizados del proyecto anterior.

## Pendiente antes de publicar

1. Confirmar quién firma y atiende las citas; el brief v9 identifica a Marisol.
2. Obtener imágenes actuales de avance de obra, fecha y porcentaje/etapa.
3. Validar cifras financieras, comparaciones, testimonios, claims legales y materiales autorizados.
4. Revisar texto de aviso de privacidad y datos legales para esta campaña.
5. Integrar formulario, campos personalizados y calendario GHL en Agencia Bosco Blue.
6. Configurar máximo 2 días de anticipación en el calendario real.
7. Configurar workflows de WhatsApp/email, pipeline, UTMs, Pixel y Meta CAPI, evitando eventos duplicados.
8. Implementar condición de objetivo habitacional en la página de gracias mediante datos reales del survey.
9. Conectar dominio correcto, verificar DNS y probar todo en producción.

No usar esta versión para campañas reales hasta terminar las integraciones.
