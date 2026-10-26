// Vite multipágina (sin dependencias adicionales).
// - Cada página es un HTML propio: /, /registro, /agenda, /gracias, /no-califica, /aviso-de-privacidad.
// - En desarrollo, las URL limpias (/registro) y las funciones /api/* se sirven con un middleware local.
// - VITE_SITE_URL convierte og:image en URL absoluta y agrega <link rel="canonical"> en la página principal.

import { fileURLToPath } from 'node:url';
import { loadEnv } from 'vite';

const PAGES = {
  index: 'index.html',
  registro: 'registro.html',
  agenda: 'agenda.html',
  gracias: 'gracias.html',
  'no-califica': 'no-califica.html',
  'aviso-de-privacidad': 'aviso-de-privacidad.html',
};

const input = Object.fromEntries(
  Object.entries(PAGES).map(([name, file]) => [name, fileURLToPath(new URL(file, import.meta.url))])
);

function cleanUrls() {
  const rewrite = (req, _res, next) => {
    const [path, query] = req.url.split('?');
    const name = path.replace(/^\/+|\/+$/g, '');
    if (name && name !== 'index' && PAGES[name]) req.url = `/${PAGES[name]}${query ? `?${query}` : ''}`;
    next();
  };
  return {
    name: 'bosco-clean-urls',
    configureServer(server) {
      // /api/* en local: ejecuta los mismos handlers que Vercel.
      server.middlewares.use(async (req, res, next) => {
        const match = req.url.match(/^\/api\/([a-z-]+)(?:\?|$)/);
        if (!match) return next();
        try {
          const mod = await server.ssrLoadModule(`/api/${match[1]}.js`);
          await mod.default(req, res);
        } catch (error) {
          server.config.logger.error(error);
          res.statusCode = 404;
          res.end('{"ok":false}');
        }
      });
      server.middlewares.use(rewrite);
    },
    configurePreviewServer(server) {
      server.middlewares.use(rewrite);
    },
  };
}

function absoluteMeta(siteUrl) {
  return {
    name: 'bosco-absolute-meta',
    transformIndexHtml(html, ctx) {
      if (!siteUrl) return html;
      let out = html.replace('content="/assets/imagenes/og-bosco.jpg"', `content="${siteUrl}/assets/imagenes/og-bosco.jpg"`);
      if (ctx.path === '/index.html') {
        out = out.replace(
          '</title>',
          `</title>\n  <link rel="canonical" href="${siteUrl}/">\n  <meta property="og:url" content="${siteUrl}/">`
        );
      }
      return out;
    },
  };
}

export default ({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  // Variables de servidor (GHL_*, META_*) disponibles para /api en desarrollo local.
  for (const [key, value] of Object.entries(env)) {
    if (!key.startsWith('VITE_') && process.env[key] === undefined) process.env[key] = value;
  }
  const siteUrl = (env.VITE_SITE_URL || '').trim().replace(/\/+$/, '');

  return {
    plugins: [cleanUrls(), absoluteMeta(siteUrl)],
    build: {
      rollupOptions: { input },
    },
  };
};
