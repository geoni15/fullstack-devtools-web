import type { APIRoute } from 'astro';
import { SITE_ORIGIN } from '../lib/site';

export const GET: APIRoute = ({ site }) => {
  const base = import.meta.env.BASE_URL.replace(/\/+$/, '');
  const sitemap = new URL(`${base}/sitemap.xml`, site ?? SITE_ORIGIN).href;

  return new Response(`User-agent: *\nAllow: /\n\nSitemap: ${sitemap}\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};