import { getHighlighter, type Highlighter } from 'shiki/bundle/web';

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
