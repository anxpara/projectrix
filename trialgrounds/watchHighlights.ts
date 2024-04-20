import { demoNames } from './src/lib/demos/demoNames';
import {
  getSvelteFileNameForDemo,
  getSvelteHighlightsFileNameForDemo,
  getUsageFileNameForDemo,
  getUsageHighlightsFileNameForDemo,
} from './src/lib/demos/demoCodes';
import { getHighlighter, type Highlighter } from 'shiki/bundle/web';
import fs from 'node:fs';
import watch from 'node-watch';

const langs = ['typescript', 'svelte'];
const themes = ['min-dark', 'one-dark-pro', 'tokyo-night'];
const theme = 'one-dark-pro';

const hl = await getHighlighter({
  langs,
  themes,
});

function codeToHighlightedString(hl: Highlighter, code: string, lang: string): string {
  const html = hl.codeToHtml(code, {
    lang,
    theme,
  });
  return html;
}

export function updateHighlights(): void {
  demoNames.forEach((demoName) => {
    const usageFile = getUsageFileNameForDemo(demoName);
    const usageHLFile = getUsageHighlightsFileNameForDemo(demoName);
    const svelteFile = getSvelteFileNameForDemo(demoName);
    const svelteHLFile = getSvelteHighlightsFileNameForDemo(demoName);

    const usage = fs.readFileSync(usageFile, 'utf8');
    const svelte = fs.readFileSync(svelteFile, 'utf8');

    const usageHL = codeToHighlightedString(hl, usage, 'typescript');
    const svelteHL = codeToHighlightedString(hl, svelte, 'svelte');

    fs.writeFileSync(usageHLFile, usageHL);
    fs.writeFileSync(svelteHLFile, svelteHL);
  });

  console.log('updated highlights');
}

updateHighlights();

watch(['./src/components/demos', './static/highlights/demos/usage'], {}, updateHighlights);
