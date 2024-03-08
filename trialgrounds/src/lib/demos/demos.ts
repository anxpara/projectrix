import type { ComponentType, SvelteComponent } from 'svelte';
import { DemoName } from './demoNames';
import MatchDemo from '../../components/demos/MatchDemo.svelte';
import AnimateDemo from '../../components/demos/AnimateDemo.svelte';
import FlipDemo from '../../components/demos/FlipDemo.svelte';
import DivGolfDemo from '../../components/demos/DivGolfDemo.svelte';

export type DemoComponent = SvelteComponent;

export type Demo = {
  name: DemoName;
  demoType: ComponentType<DemoComponent>;
  summary: string;
  demoComponent?: DemoComponent;
};

export const allDemos: Demo[] = [
  {
    name: DemoName.Flip,
    demoType: FlipDemo,
    summary: "animate from subject to target's origin using first-last-invert-play technique",
  },
  {
    name: DemoName.Animate,
    demoType: AnimateDemo,
    summary: "on click: animate the target directly to the subject's projection",
  },
  {
    name: DemoName.Match,
    demoType: MatchDemo,
    summary:
      "on click: set target's inline styles to the projection of the subject onto the target",
  },
  {
    name: DemoName.DivGolf,
    demoType: DivGolfDemo,
    summary: 'click the modifier divs to match the green div to a red goal. click the goal ftw',
  },
];
export const demosByName = new Map<DemoName, Demo>(allDemos.map((demo) => [demo.name, demo]));
