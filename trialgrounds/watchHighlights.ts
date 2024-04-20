import { demoNames } from './src/lib/demos/demoNames';
import {
  DemoCodeMapEntries,
  computeCodesByDemoNameFile,
  getCodeLocation,
  getCodesByDemoNameFilename,
  getCodeFileNameForDemo,
  getUsageFileNameForDemo,
  getUsageLocation,
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

function updateHighlights(): void {
  const demoCodeEntries = computeHighlightedCodes();
  writeHighlightedCodesToLib(demoCodeEntries);
}

function computeHighlightedCodes(): DemoCodeMapEntries {
  return demoNames.map((demoName) => {
    const usageFile = getUsageFileNameForDemo(demoName);
    const codeFile = getCodeFileNameForDemo(demoName);

    const usage = fs.readFileSync(usageFile, 'utf8');
    const code = fs.readFileSync(codeFile, 'utf8');

    const usageHL = codeToHighlightedString(hl, usage, 'typescript');
    const codeHL = codeToHighlightedString(hl, code, 'svelte');

    return [
      demoName,
      {
        usage,
        code,
        usageHL,
        codeHL,
      },
    ];
  });
}

function codeToHighlightedString(hl: Highlighter, code: string, lang: string): string {
  const html = hl.codeToHtml(code, {
    lang,
    theme,
  });
  return html;
}

// can't use file system when deployed to vercel, write to a lib script
function writeHighlightedCodesToLib(demoCodeEntries: DemoCodeMapEntries): void {
  fs.writeFileSync(getCodesByDemoNameFilename(), computeCodesByDemoNameFile(demoCodeEntries));
  console.log(`updated ${getCodesByDemoNameFilename()}`);
}

updateHighlights();
watch([getUsageLocation(), getCodeLocation()], {}, updateHighlights);
