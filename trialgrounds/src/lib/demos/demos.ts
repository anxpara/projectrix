import type { ComponentType, SvelteComponent } from 'svelte';
import { DemoName } from './demoNames';
import MatchDemo from '../../components/demos/MatchDemo.svelte';
import AnimateDemo from '../../components/demos/AnimateDemo.svelte';
import FlipDemo from '../../components/demos/FlipDemo.svelte';
import DivGolfDemo from '../../components/demos/DivGolfDemo.svelte';
import { FlipCode, FlipCodeHL, FlipUsage, FlipUsageHL } from './usages/FlipUsage';
import { AnimateCode, AnimateCodeHL, AnimateUsage, AnimateUsageHL } from './usages/AnimateUsage';
import { MatchCode, MatchCodeHL, MatchUsage, MatchUsageHL } from './usages/MatchUsage';
import { DivGolfCode, DivGolfCodeHL, DivGolfUsage, DivGolfUsageHL } from './usages/DivGolfUsage';

export type DemoComponent = SvelteComponent;

export type Demo = {
  name: DemoName;
  demoType: ComponentType<DemoComponent>;
  summary: string;
  demoComponent?: DemoComponent;
  usage: string;
  code: string;
  usageHL: string;
  codeHL: string;
};

export const allDemos: Demo[] = [
  {
    name: DemoName.Flip,
    demoType: FlipDemo,
    summary: "animate from subject to target's origin using first-last-invert-play technique",
    usage: FlipUsage,
    code: FlipCode,
    usageHL: FlipUsageHL,
    codeHL: FlipCodeHL,
  },
  {
    name: DemoName.Animate,
    demoType: AnimateDemo,
    summary: "on click: animate the target directly to the subject's projection",
    usage: AnimateUsage,
    code: AnimateCode,
    usageHL: AnimateUsageHL,
    codeHL: AnimateCodeHL,
  },
  {
    name: DemoName.Match,
    demoType: MatchDemo,
    summary:
      "on click: set target's inline styles to the projection of the subject onto the target",
    usage: MatchUsage,
    code: MatchCode,
    usageHL: MatchUsageHL,
    codeHL: MatchCodeHL,
  },
  {
    name: DemoName.DivGolf,
    demoType: DivGolfDemo,
    summary: 'click modifier divs or num keys 1-3 to match the green div to a red goal. click current modifier to attempt goal',

    usage: DivGolfUsage,
    code: DivGolfCode,
    usageHL: DivGolfUsageHL,
    codeHL: DivGolfCodeHL,
  },
];
export const demosByName = new Map<DemoName, Demo>(allDemos.map((demo) => [demo.name, demo]));
