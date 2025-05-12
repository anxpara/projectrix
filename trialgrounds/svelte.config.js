import vercel from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { preprocessMeltUI, sequence } from '@melt-ui/pp';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: sequence([vitePreprocess({}), preprocessMeltUI()]),

  kit: {
    adapter: vercel(),
  },
};

export default config;
