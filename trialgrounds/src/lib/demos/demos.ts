import type { ComponentType, SvelteComponent } from 'svelte';
import { DemoName } from './demoNames';
import MatchDemo from '../../components/demos/MatchDemo.svelte';
import AnimateDemo from '../../components/demos/AnimateDemo.svelte';
import FlipDemo from '../../components/demos/FlipDemo.svelte';
import DivGolfDemo from '../../components/demos/DivGolfDemo.svelte';
import CssIsAwesomeDemo from '../../components/demos/CssIsAwesomeDemo.svelte';
import FauxFlipDemo from '../../components/demos/FauxFlipDemo.svelte';

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
    summary: 'animate target between two parents using the first-last-invert-play technique',
  },
  {
    name: DemoName.Animate,
    demoType: AnimateDemo,
    summary: "click to animate target directly to the subject's projection",
  },
  {
    name: DemoName.Match,
    demoType: MatchDemo,
    summary:
      "click to set target's inline styles to the subject's projection",
  },
  {
    name: DemoName.DivGolf,
    demoType: DivGolfDemo,
    summary:
      'click moving divs (or num keys 1-3) to align green div within 10px & 8° of a red goal; click current moving div to attempt goal',
  },
  {
    name: DemoName.FauxFlip,
    demoType: FauxFlipDemo,
    summary: 'flip without modifying the dom by toggling the opacities of coexisting targets',
  },
  {
    name: DemoName.CssIsAwesome,
    demoType: CssIsAwesomeDemo,
    summary:
      'preserve-3d and perspective properties are supported',
  },
];
export const demosByName = new Map<DemoName, Demo>(allDemos.map((demo) => [demo.name, demo]));
