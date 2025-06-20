import type { Component } from 'svelte';
import type { Options } from '$lib/options';
import type { Store } from '$lib/stores/Store';
import { DemoName } from './demoNames';
import AnimateDemo from '$components/demos/AnimateDemo.svelte';
import CssIsAwesomeDemo from '$components/demos/CssIsAwesomeDemo.svelte';
import DivGolfDemo from '$components/demos/DivGolfDemo.svelte';
import FauxFlipDemo from '$components/demos/FauxFlipDemo.svelte';
import FlipDemo from '$components/demos/FlipDemo.svelte';
import MatchDemo from '$components/demos/MatchDemo.svelte';
import DemoStartSlot from '$components/demos/ui/DemoStartSlot.svelte';

export interface DemoProps {
  startSlot: DemoStartSlot;
  options: Store<Options>;
}

export type DemoComponent = Component<DemoProps>;

export type Demo = {
  name: DemoName;
  summary: string;
  Component: DemoComponent;
  instance?: ReturnType<DemoComponent>;
  useSlot?: boolean;
};

export const allDemos: Demo[] = $state([
  {
    name: DemoName.Flip,
    summary: 'animate target between two parents using the first-last-invert-play technique',
    Component: FlipDemo,
    useSlot: true,
  },
  {
    name: DemoName.Animate,
    summary: "click to animate target directly to the subject's projection",
    Component: AnimateDemo,
    useSlot: true,
  },
  {
    name: DemoName.Match,
    summary: "click to set target's inline styles to the subject's projection",
    Component: MatchDemo,
    useSlot: true,
  },
  {
    name: DemoName.DivGolf,
    summary:
      'click moving divs (or num keys 1-3) to align green div within 10px & 8° of a red goal; click current moving div to attempt goal',
    Component: DivGolfDemo,
  },
  {
    name: DemoName.FauxFlip,
    summary: 'flip without modifying the dom by toggling the opacities of coexisting targets',
    Component: FauxFlipDemo,
    useSlot: true,
  },
  {
    name: DemoName.CssIsAwesome,
    summary: 'preserve-3d and perspective properties are supported',
    Component: CssIsAwesomeDemo,
  },
]);
export const demosByName = new Map<DemoName, Demo>(allDemos.map((demo) => [demo.name, demo]));
