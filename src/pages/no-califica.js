// /no-califica · Mensaje cordial, sin simular una cita.
import { boot, render } from '../boot.js';
import { ROUTES } from '../config.js';
import { MESSAGES } from '../content.js';
import { clearSession } from '../session.js';
import { esc, footerHTML, navHTML } from '../ui.js';

boot();
render(`
${navHTML({ action: 'back' })}
<main class="funnel">
  <div class="funnel-card">
    <p class="eyebrow">BOSCO · Mérida</p>
    <h1>${esc(MESSAGES.notQualifiedTitle)}</h1>
    <p class="funnel-intro">${esc(MESSAGES.notQualified)}</p>
    <div class="resources">
      <p class="eyebrow">Sigue conociendo el proyecto</p>
      <a class="text-link" href="${ROUTES.home}#proyecto">Ubicación y detalles del proyecto <span aria-hidden="true">→</span></a>
      <a class="text-link" href="${ROUTES.home}#obra">Avance de obra <span aria-hidden="true">→</span></a>
    </div>
  </div>
</main>
${footerHTML()}`);

// Permite volver a registrarse desde cero si la situación cambia.
clearSession();
