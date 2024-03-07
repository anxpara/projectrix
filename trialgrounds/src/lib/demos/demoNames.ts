export const DemoName = {
  Flip: 'flip',
  Animate: 'animate',
  Match: 'match',
  DivGolf: 'divGolf',
} as const;
export type DemoName = (typeof DemoName)[keyof typeof DemoName];
export const demoNames: string[] = Object.values(DemoName);
