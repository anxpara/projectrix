export const DemoName = {
  Match: 'match',
  Animate: 'animate',
  Flip: 'flip',
  DivGolf: 'divGolf',
} as const;
export type DemoName = (typeof DemoName)[keyof typeof DemoName];
export const demoNames: string[] = Object.values(DemoName);
