# Fullstack DevTools — sitio de presentación

Página de presentación de [Fullstack DevTools](https://github.com/geoni15/fullstack-devtools), la devtool de
escritorio open source que sigue una aplicación web local desde el clic hasta la base de datos.

**Sitio en vivo:** https://geoni15.github.io/fullstack-devtools-web/

Astro + Tailwind CSS, salida estática, tema oscuro y claro, tipografías autoalojadas y sin dependencias de CDN.
Licencia MIT.

## Desarrollo

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # genera dist/
npm run preview  # sirve dist/
npm run check    # tipos y plantillas
```

Requiere Node.js 20 o superior.

## Publicación en GitHub Pages

El repositorio incluye `.github/workflows/deploy.yml`. Al hacer push a `main`, el flujo compila el sitio y lo
publica con GitHub Pages.

1. En **Settings → Pages**, seleccionar **Source: GitHub Actions**.
2. Hacer push a `main`.

`astro.config.mjs` calcula `base` a partir del nombre del repositorio, así que funciona igual en
`usuario.github.io` que en `usuario.github.io/nombre-del-repo`. Las variables `ASTRO_SITE` y `ASTRO_BASE`
permiten sobrescribirlo a mano.

`public/.nojekyll` evita que Jekyll descarte los directorios que empiezan por guion bajo.

## Contenido

| Ruta | Contenido |
| --- | --- |
| `src/lib/site.ts` | Textos, modos del inspector, capacidades, hallazgos de auditoría, stack y descargas |
| `src/lib/graph-data.ts` | Cadena de ejemplo del mapa de flujo interactivo |
| `src/lib/flowgraph.ts` | Motor SVG del grafo: layout, filtros, enfoque y panel de detalle |
| `src/styles/global.css` | Tokens de color, temas y sistema de componentes planos |
| `public/media/` | Capturas y vídeo de la aplicación |

Las capturas y el vídeo proceden de la versión 0.6.0 de la aplicación.

## SEO

| Pieza | Dónde |
| --- | --- |
| `title`, `description`, `canonical`, `robots`, Open Graph y Twitter Card | `src/layouts/Base.astro` |
| Datos estructurados JSON-LD (`WebSite`, `Person`, `SoftwareApplication`, `SoftwareSourceCode`) | `src/layouts/Base.astro` |
| `robots.txt` con la ruta del sitemap | `src/pages/robots.txt.ts` |
| `sitemap.xml` con extensión de imágenes de Google | `src/pages/sitemap.xml.ts` |
| Imagen para compartir 1200 × 630 | `public/og-image.png` |
| Icono táctil 180 × 180 | `public/apple-touch-icon.png` |

Todas las URL absolutas se derivan de `site` + `base`, así que el canonical, el sitemap y las etiquetas
`og:image` siguen al repositorio aunque se renombre.

Tras publicar, dar de alta la propiedad en [Google Search Console](https://search.google.com/search-console)
y enviar `sitemap.xml` acelera la indexación.