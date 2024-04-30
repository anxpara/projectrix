export const PerfName = {
  Depth1: 'depth-1',
  Depth10: 'depth-10',
  Depth100: 'depth-100',
  Depth1000: 'depth-1000',
} as const;
export type PerfName = (typeof PerfName)[keyof typeof PerfName];
export const perfNames: string[] = Object.values(PerfName);

export function capDemoName(perfName: string): string {
  return perfName.charAt(0).toUpperCase() + perfName.slice(1);
}
