import { sveltekit } from '@sveltejs/kit/vite';
import devtoolsJson from 'vite-plugin-devtools-json';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [sveltekit(), devtoolsJson()],

  build: {
    // minify: false,
  },

  test: {
    include: ['src/**/*.{test,spec}.{js,ts}'],
  },

  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler',
        additionalData: `@use "$styles/variables.scss" as *;
        @use "$styles/mixins.scss" as *;`,
      },
    },
  },
});
