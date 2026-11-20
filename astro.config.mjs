import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

const repository = process.env.GITHUB_REPOSITORY ?? '';
const repoName = repository.split('/')[1] ?? '';
const isUserPage = repoName.toLowerCase().endsWith('.github.io');
const derived = repoName && !isUserPage ? `/${repoName}` : '/';
const base = process.env.ASTRO_BASE || derived;

export default defineConfig({
  site: process.env.ASTRO_SITE || 'https://geoni15.github.io',
  base,
  trailingSlash: 'ignore',
  output: 'static',
  devToolbar: { enabled: false },
  build: { inlineStylesheets: 'always' },
  vite: { plugins: [tailwindcss()] },
});