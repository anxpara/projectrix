export const DemoName = {
  Match: 'match',
  Animate: 'animate',
} as const;
export type DemoName = (typeof DemoName)[keyof typeof DemoName];
export const demoNames: string[] = Object.values(DemoName);