// Reproductor de la VSL.
// - Con código de VTurb en src/vsl-embed.js: se inserta tal cual.
// - Sin él: MP4 local con autoplay silenciado (permitido en móviles), botón grande para activar el sonido
//   que reinicia el video desde el inicio, y controles nativos accesibles después de la primera interacción.

import { CONFIG } from './config.js';
import { VSL_EMBED_HTML } from './vsl-embed.js';
import { track } from './tracking.js';

export function vslHTML() {
  if (VSL_EMBED_HTML.trim()) {
    return `<div class="vsl vsl-embed" id="vsl-embed" aria-label="Video de presentación del proyecto BOSCO"></div>`;
  }
  return `
  <div class="vsl" data-state="idle">
    <video id="vsl" playsinline muted preload="metadata" poster="${CONFIG.vslPoster}"
      aria-label="Video de presentación del proyecto BOSCO" width="1280" height="720">
      <source src="${CONFIG.vslMp4}" type="video/mp4">
      Tu navegador no puede reproducir este video.
    </video>
    <button class="vsl-overlay" type="button" id="vsl-start">
      <span class="vsl-pill">
        <span class="vsl-icon" aria-hidden="true"></span>
        <span class="vsl-overlay-text">Toca para activar el sonido</span>
      </span>
    </button>
  </div>`;
}

function mountEmbed(container) {
  // innerHTML no ejecuta <script>; se recrean para que el reproductor del proveedor arranque.
  container.innerHTML = VSL_EMBED_HTML;
  container.querySelectorAll('script').forEach((old) => {
    const s = document.createElement('script');
    [...old.attributes].forEach((a) => s.setAttribute(a.name, a.value));
    s.textContent = old.textContent;
    old.replaceWith(s);
  });
}

export function bindVsl(root = document) {
  const embed = root.querySelector('#vsl-embed');
  if (embed) {
    mountEmbed(embed);
    return;
  }

  const video = root.querySelector('#vsl');
  const overlay = root.querySelector('#vsl-start');
  if (!video || !overlay) return;
  const wrapper = video.closest('.vsl');
  const label = overlay.querySelector('.vsl-overlay-text');
  const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  const setState = (state) => {
    wrapper.dataset.state = state;
  };

  // Vista previa silenciada. Si el navegador bloquea el autoplay, se muestra "Reproducir".
  const startPreview = () => {
    if (reduceMotion) {
      label.textContent = 'Reproducir presentación';
      setState('paused');
      return;
    }
    video.muted = true;
    const attempt = video.play();
    if (attempt?.catch) {
      attempt
        .then(() => setState('preview'))
        .catch(() => {
          label.textContent = 'Reproducir presentación';
          setState('paused');
        });
    }
  };

  overlay.addEventListener('click', () => {
    video.currentTime = 0;
    video.muted = false;
    video.controls = true;
    setState('playing');
    video.play().catch(() => {
      video.muted = true;
      video.play().catch(() => {});
    });
    track('vsl_play', { with_sound: !video.muted });
    video.focus({ preventScroll: true });
  });

  // Progreso de reproducción con sonido (25/50/75/100%).
  const marks = [25, 50, 75, 100];
  const reached = new Set();
  video.addEventListener('timeupdate', () => {
    if (wrapper.dataset.state !== 'playing' || !video.duration) return;
    const pct = (video.currentTime / video.duration) * 100;
    marks.forEach((m) => {
      if (pct >= m - 0.5 && !reached.has(m)) {
        reached.add(m);
        track('vsl_progress', { percent: m });
      }
    });
  });

  // Si otro video empieza (testimonios), se pausa la VSL y viceversa.
  document.addEventListener(
    'play',
    (event) => {
      if (event.target instanceof HTMLVideoElement && event.target !== video && !video.paused) video.pause();
    },
    true
  );

  startPreview();
}

// Pausa los demás videos cuando uno empieza a reproducirse.
export function bindExclusivePlayback(root = document) {
  root.addEventListener(
    'play',
    (event) => {
      const current = event.target;
      if (!(current instanceof HTMLVideoElement)) return;
      root.querySelectorAll('video').forEach((v) => {
        if (v !== current && v.id !== 'vsl' && !v.paused) v.pause();
      });
    },
    true
  );
}
