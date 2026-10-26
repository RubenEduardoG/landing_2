// Arranque común de todas las páginas.
import './styles.css';
import { initTracking, bindClickTracking } from './tracking.js';
import { bindMediaFallbacks } from './ui.js';

export const app = document.querySelector('#app');

export function render(html) {
  app.innerHTML = html;
  bindMediaFallbacks(app);
}

export function boot() {
  initTracking();
  bindClickTracking(document);
}
