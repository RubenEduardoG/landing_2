// Manejo de media: placeholders cuando un archivo falta y control de audio del VSL.

export function bindMedia(root = document) {
  const markMissing = (el) => el.closest('.media')?.classList.add('is-missing');

  root.querySelectorAll('.media img').forEach((img) => {
    img.addEventListener('error', () => markMissing(img), { once: true });
    if (img.complete && img.naturalWidth === 0) markMissing(img);
  });

  root.querySelectorAll('.media video').forEach((video) => {
    const sources = video.querySelectorAll('source');
    const last = sources[sources.length - 1];
    last?.addEventListener('error', () => markMissing(video), { once: true });

    // Con preload="none" el error del <source> no se dispara hasta reproducir.
    // Se comprueba el poster por adelantado para mostrar el placeholder.
    if (video.poster) {
      const probe = new Image();
      probe.addEventListener('error', () => markMissing(video), { once: true });
      probe.src = video.poster;
    }
  });
}

export function bindSoundToggle(root) {
  const video = root.querySelector('#vsl');
  const button = root.querySelector('#sound');
  if (!video || !button) return;

  const sync = () => {
    const soundOn = !video.muted;
    button.setAttribute('aria-pressed', String(soundOn));
    button.textContent = soundOn ? '🔇 Silenciar video' : '🔊 Activar sonido';
  };

  button.addEventListener('click', () => {
    video.muted = !video.muted;
    if (video.paused) video.play().catch(() => {});
    sync();
  });
  video.addEventListener('volumechange', sync);
  sync();
}
