import type { ComponentType, SvelteComponent } from 'svelte';
import { DemoName } from './demoNames';
import MatchDemo from '../../components/demos/MatchDemo.svelte';
import AnimateDemo from '../../components/demos/AnimateDemo.svelte';

export type DemoComponent = SvelteComponent;

export type Demo = {
  name: DemoName;
  demoType: ComponentType<DemoComponent>;
  summary: string;
  demoComponent?: DemoComponent;
};

export const allDemos: Demo[] = [
  {
    name: DemoName.Match,
    demoType: MatchDemo,
    summary:
      "on click: set target's inline styles to the projection of the subject onto the target",
  },
  {
    name: DemoName.Animate,
    demoType: AnimateDemo,
    summary: "on click: animate the target directly to the subject's projection",
  },
];
export const demosByName = new Map<DemoName, Demo>(allDemos.map((demo) => [demo.name, demo]));
