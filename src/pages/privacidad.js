// /aviso-de-privacidad · Estructura de aviso integral conforme a la legislación mexicana de protección de datos.
// BORRADOR: requiere revisión legal y completar los datos del responsable en src/content.js (LEGAL).

import { boot, render } from '../boot.js';
import { LEGAL } from '../content.js';
import { esc, footerHTML, navHTML } from '../ui.js';

const pending = (value, label) =>
  value ? esc(value) : `<mark class="pending">[Pendiente: ${esc(label)}]</mark>`;

const complete = LEGAL.responsable && LEGAL.domicilio && LEGAL.emailPrivacidad;

boot();
render(`
${navHTML({ action: 'back' })}
<main class="legal-page wrap">
  <p class="eyebrow">BOSCO Departamentos</p>
  <h1>Aviso de privacidad</h1>
  ${complete ? '' : '<p class="notice">Borrador pendiente de revisión legal y de completar los datos del responsable.</p>'}
  ${LEGAL.actualizado ? `<p class="fine">Última actualización: ${esc(LEGAL.actualizado)}</p>` : ''}

  <h2>1. Identidad y domicilio del responsable</h2>
  <p>${pending(LEGAL.responsable, 'nombre o razón social del responsable')}, con domicilio en ${pending(LEGAL.domicilio, 'domicilio')}, es responsable del tratamiento de los datos personales que nos proporciones a través de este sitio.</p>

  <h2>2. Datos personales que recabamos</h2>
  <p>Nombre, número de teléfono o WhatsApp, correo electrónico, estado de residencia y las respuestas sobre tu perfil de inversión (experiencia, plazo, objetivo y capital disponible). No solicitamos datos personales sensibles.</p>

  <h2>3. Finalidades del tratamiento</h2>
  <p><strong>Finalidades necesarias:</strong> contactarte para darte información sobre el proyecto BOSCO, agendar y confirmar tu asesoría, enviarte recordatorios por WhatsApp y correo electrónico, y dar seguimiento a tu solicitud.</p>
  <p><strong>Finalidades adicionales:</strong> medir el desempeño de nuestras campañas y enviarte información comercial de proyectos relacionados. Puedes oponerte a estas finalidades escribiendo al correo indicado en la sección 6, sin que ello afecte las finalidades necesarias.</p>

  <h2>4. Transferencias y encargados</h2>
  <p>Para operar este servicio, tus datos son tratados por proveedores que actúan por nuestra cuenta, como la plataforma de gestión de clientes y agenda, el servicio de mensajería de WhatsApp y el de correo electrónico. No vendemos tus datos ni los transferimos a terceros para fines propios de ellos, salvo en los casos previstos por la ley.</p>

  <h2>5. Cookies y tecnologías de rastreo</h2>
  <p>Este sitio puede utilizar cookies y tecnologías similares de Google Analytics y Meta (Facebook/Instagram) para medir visitas y la efectividad de nuestros anuncios. Puedes deshabilitarlas desde la configuración de tu navegador.</p>

  <h2>6. Derechos ARCO y revocación del consentimiento</h2>
  <p>Puedes acceder, rectificar o cancelar tus datos, oponerte a su uso o revocar tu consentimiento enviando una solicitud a ${pending(LEGAL.emailPrivacidad, 'correo para solicitudes de privacidad')}. Tu solicitud debe incluir tu nombre, un medio para responderte, la descripción de lo que solicitas y, en su caso, una identificación. Te responderemos en los plazos que establece la ley.</p>

  <h2>7. Cambios a este aviso</h2>
  <p>Cualquier cambio a este aviso de privacidad se publicará en esta misma página.</p>
</main>
${footerHTML()}`);
