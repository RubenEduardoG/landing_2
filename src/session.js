// Estado del embudo en sessionStorage (solo esta pestaña). Todo envuelto en try/catch:
// en modo privado o con almacenamiento bloqueado la página sigue funcionando.

const KEY = 'bosco2_funnel';

export function readSession() {
  try {
    return JSON.parse(sessionStorage.getItem(KEY) || '{}') || {};
  } catch {
    return {};
  }
}

export function writeSession(patch) {
  const next = { ...readSession(), ...patch };
  try {
    sessionStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* almacenamiento no disponible */
  }
  return next;
}

export function clearSession() {
  try {
    sessionStorage.removeItem(KEY);
  } catch {
    /* almacenamiento no disponible */
  }
}

export function newId() {
  if (globalThis.crypto?.randomUUID) return crypto.randomUUID();
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}
