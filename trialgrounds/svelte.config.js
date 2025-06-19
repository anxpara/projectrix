import vercel from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess({}),

  kit: {
    adapter: vercel(),
    alias: {
      $components: 'src/components',
      $routes: 'src/routes',
      $styles: 'src/styles',
    },
  },
};

export default config;
