import type { Component } from 'svelte';
import { PerfName } from './perfNames';
import Depth1Perf from '$components/perfs/Depth1Perf.svelte';
import Depth10Perf from '$components/perfs/Depth10Perf.svelte';
import Depth100Perf from '$components/perfs/Depth100Perf.svelte';
// import Depth1000Perf from '$components/perfs/Depth1000Perf.svelte';

export interface PerfControls {
  getTargetElement: () => HTMLElement;
  getSubjectElement: () => HTMLElement;
}

export type PerfComponent = Component<Record<string, never>, PerfControls>;

export const PerfInProgress = -1;
export type Perf = {
  name: PerfName;
  Component: PerfComponent;
  instance?: ReturnType<PerfComponent>;
  durationMs?: number;
};

// TODO: add spinner; run perfs one at a time after mount in order to add Depth1000 back
export const allPerfs: Perf[] = $state([
  {
    name: PerfName.Depth1,
    Component: Depth1Perf,
  },
  {
    name: PerfName.Depth10,
    Component: Depth10Perf,
  },
  {
    name: PerfName.Depth100,
    Component: Depth100Perf,
  },
  // {
  //   name: PerfName.Depth1000,
  //   Component: Depth1000Perf,
  // },
]);
export const perfsByName = new Map<PerfName, Perf>(allPerfs.map((perf) => [perf.name, perf]));
