import { getHighlighter, type Highlighter } from 'shiki/bundle/web';
import { allDemos } from './demos/demos';

const langs = ['typescript', 'svelte'];
const themes = ['min-dark', 'one-dark-pro', 'tokyo-night'];
const theme = 'one-dark-pro';

export async function getShikiHighlighter(): Promise<Highlighter> {
  const hl = await getHighlighter({
    langs,
    themes,
  });

  return hl;
}

export function codeToHighlightedString(hl: Highlighter, code: string, lang: string): string {
  const html = hl.codeToHtml(code, {
    lang,
    theme,
  });
  return html;
}

export function logUpToDateHighlightsToConsole(hl: Highlighter): void {
  allDemos.forEach((demo) => {
    const usageHL = codeToHighlightedString(hl, demo.usage, 'typescript');
    console.log(`${demo.name} usage:`);
    console.log(usageHL);

    const codeHL = codeToHighlightedString(hl, demo.code, 'svelte');
    console.log(`${demo.name} code:`);
    console.log(codeHL);
  });
}
