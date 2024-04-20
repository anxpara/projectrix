import { capDemoName, type DemoName } from './demoNames';

export type DemoCodes = {
  usage: string;
  code: string;
  usageHL: string;
  codeHL: string;
};
export type CodesByDemoName = Map<DemoName, DemoCodes>;

export function getUsageFileNameForDemo(demoName: string): string {
  return `src/lib/demos/usage/${capDemoName(demoName)}Usage.ts`;
}

export function getCodeFileNameForDemo(demoName: string): string {
  return `src/components/demos/${capDemoName(demoName)}Demo.svelte`;
}

export function getUsageLocation(): string {
  return './src/lib/demos/usage';
}

export function getCodeLocation(): string {
  return './src/components/demos';
}

export function getCodesByDemoNameFilename(): string {
  return 'src/lib/demos/codesByDemoName.ts';
}

export type DemoCodeMapEntries = [string, DemoCodes][];

export function computeCodesByDemoNameFile(demoCodeEntries: DemoCodeMapEntries): string {
  const demoCodesString = JSON.stringify(demoCodeEntries);

  return `import type { CodesByDemoName } from './demoCodes';

export const codesByDemoName: CodesByDemoName = new Map(${demoCodesString});`;
}
