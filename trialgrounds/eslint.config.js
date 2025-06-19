import { fileURLToPath } from 'node:url';
import { includeIgnoreFile } from '@eslint/compat';
import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import svelte from 'eslint-plugin-svelte';
import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';
import ts from 'typescript-eslint';
import svelteConfig from './svelte.config.js';

const ignorePatterns = [
  '.DS_Store',
  'node_modules/',
  'build/',
  '.svelte-kit/',
  'package/',
  '.env',
  '.env.*',
  'pnpm-lock.yaml',
  'package-lock.json',
  'yarn.lock',
  '.vercel/',
  '.vscode/',
  'src/lib/demos/usage/'
];

const gitignorePath = fileURLToPath(new URL('./.gitignore', import.meta.url));

export default defineConfig(globalIgnores(ignorePatterns), [
  ts.config(
    includeIgnoreFile(gitignorePath),
    js.configs.recommended,
    ...ts.configs.recommended,
    ...svelte.configs.recommended,
    prettier,
    ...svelte.configs.prettier,
    {
      languageOptions: {
        globals: { ...globals.browser, ...globals.node },
      },
      rules: { 'no-undef': 'off' },
    },
    {
      files: ['**/*.svelte', '**/*.svelte.ts', '**/*.svelte.js'],
      languageOptions: {
        parserOptions: {
          projectService: true,
          extraFileExtensions: ['.svelte'],
          parser: ts.parser,
          svelteConfig,
        },
      },
    },
  ),
]);
