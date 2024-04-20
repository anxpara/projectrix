import { capDemoName, type DemoName } from './demoNames';

export type DemoCodes = {
  usage: string;
  code: string;
  usageHL: string;
  codeHL: string;
};
export type CodesByDemoName = Map<DemoName, DemoCodes>;

export function getSvelteFileNameForDemo(demoName: string): string {
  return `src/components/demos/${capDemoName(demoName)}Demo.svelte`;
}

export function getSvelteHighlightsFileNameForDemo(demoName: string): string {
  return `static/highlights/demos/${capDemoName(demoName)}Demo.svelte.html`;
}

export function getUsageFileNameForDemo(demoName: string): string {
  return `static/highlights/demos/usage/${capDemoName(demoName)}Usage.ts`;
}

export function getUsageHighlightsFileNameForDemo(demoName: string): string {
  return `static/highlights/demos/${capDemoName(demoName)}Usage.ts.html`;
}
