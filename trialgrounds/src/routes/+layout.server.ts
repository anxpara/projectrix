import { DemoName, demoNames } from '$lib/demos/demoNames';
import {
  getSvelteFileNameForDemo,
  getSvelteHighlightsFileNameForDemo,
  getUsageFileNameForDemo,
  getUsageHighlightsFileNameForDemo,
} from '$lib/demos/demoCodes';
import type { CodesByDemoName, DemoCodes } from '$lib/demos/demoCodes';
import fs from 'node:fs';

/** @type {import('./$types').LayoutServerLoad} */
export async function load({ params, url }) {
  return {
    codesByDemoName: getDemoCodesByDemoName(),
  };
}

function getDemoCodesByDemoName(): CodesByDemoName {
  const codesByDemoName: CodesByDemoName = new Map();
  demoNames.forEach((name) => {
    codesByDemoName.set(name as DemoName, loadDemoCodes(name));
  });
  return codesByDemoName;
}

function loadDemoCodes(demoName: string): DemoCodes {
  const svelteFile = getSvelteFileNameForDemo(demoName);
  const svelteHLFile = getSvelteHighlightsFileNameForDemo(demoName);
  const usageFile = getUsageFileNameForDemo(demoName);
  const usageHLFile = getUsageHighlightsFileNameForDemo(demoName);

  return {
    usage: fs.readFileSync(usageFile, 'utf8'),
    usageHL: fs.readFileSync(usageHLFile, 'utf8'),
    code: fs.readFileSync(svelteFile, 'utf8'),
    codeHL: fs.readFileSync(svelteHLFile, 'utf8'),
  };
}
