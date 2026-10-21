import './styles.css';
import { ROUTES } from './config.js';
import { landingHTML, notQualifiedHTML, thankYouHTML } from './templates.js';
import { bindQualificationForm } from './qualify.js';
import { bindMedia, bindSoundToggle } from './media.js';

const app = document.querySelector('#app');
const path = location.pathname.replace(/\/+$/, '') || '/';

function render(html) {
  app.innerHTML = html;
  bindMedia(app);
}

// Rutas: /gracias y /no-califica son páginas estáticas. Cualquier otra ruta muestra la landing.
if (path === ROUTES.notQualified) {
  render(notQualifiedHTML());
} else if (path === ROUTES.thanks) {
  render(thankYouHTML());
} else {
  render(landingHTML());
  bindSoundToggle(app);
  bindQualificationForm(app);
}
