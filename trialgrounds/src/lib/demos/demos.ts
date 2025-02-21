import type { ComponentType, SvelteComponent } from 'svelte';
import { DemoName } from './demoNames';
import MatchDemo from '../../components/demos/MatchDemo.svelte';
import AnimateDemo from '../../components/demos/AnimateDemo.svelte';
import FlipDemo from '../../components/demos/FlipDemo.svelte';
import DivGolfDemo from '../../components/demos/DivGolfDemo.svelte';
import CssIsAwesomeDemo from '../../components/demos/CssIsAwesomeDemo.svelte';
import FlipCoexistDemo from '../../components/demos/FlipCoexistDemo.svelte';

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
    summary: 'animate target between two parents using first-last-invert-play technique',
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
    summary:
      'Click moving divs (or num keys 1-3) to align green div within 10px & 8° of a red goal. Click current moving div to attempt goal.',
  },
  {
    name: DemoName.FlipCoexist,
    demoType: FlipCoexistDemo,
    summary: 'flip using coexisting target children',
  },
  {
    name: DemoName.CssIsAwesome,
    demoType: CssIsAwesomeDemo,
    summary:
      'preserve-3d and perspective are supported; confirm your animation engine animates between perspectives properly',
  },
];
export const demosByName = new Map<DemoName, Demo>(allDemos.map((demo) => [demo.name, demo]));
