import type { APIRoute } from 'astro';
import { asset, SITE_DESCRIPTION, SITE_ORIGIN, SITE_TITLE } from '../lib/site';

const escape = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export const GET: APIRoute = ({ site }) => {
  const origin = site ?? SITE_ORIGIN;
  const base = import.meta.env.BASE_URL.replace(/\/+$/, '');
  const page = new URL(`${base}/`, origin).href;
  const lastmod = new Date().toISOString().slice(0, 10);

  const images = [
    { src: new URL(asset('foto-main.png'), origin).href, title: SITE_TITLE, caption: SITE_DESCRIPTION },
    {
      src: new URL(asset('mapa.png'), origin).href,
      title: 'Mapa de flujo de una aplicación web local',
      caption: 'El grafo que enlaza controles, manejadores, peticiones, rutas, consultas SQL y tablas.',
    },
    {
      src: new URL(`${base}/og-image.png`, origin).href,
      title: SITE_TITLE,
      caption: SITE_DESCRIPTION,
    },
  ];

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <url>
    <loc>${escape(page)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
${images
  .map(
    (img) =>
      `    <image:image>\n      <image:loc>${escape(img.src)}</image:loc>\n      <image:title>${escape(img.title)}</image:title>\n      <image:caption>${escape(img.caption)}</image:caption>\n    </image:image>`,
  )
  .join('\n')}
  </url>
</urlset>
`;

  return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};