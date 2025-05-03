export const DemoName = {
  Flip: 'flip',
  Animate: 'animate',
  Match: 'match',
  DivGolf: 'divGolf',
  FauxFlip: 'fauxFlip',
  CssIsAwesome: 'cssIsAwesome',
} as const;
export type DemoName = (typeof DemoName)[keyof typeof DemoName];
export const demoNames: string[] = Object.values(DemoName);

export function capDemoName(demoName: string): string {
  return demoName.charAt(0).toUpperCase() + demoName.slice(1);
}
