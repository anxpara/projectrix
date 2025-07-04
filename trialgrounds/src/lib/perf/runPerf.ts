import { browser } from '$app/environment';
import { clearInlineStyles, getProjection, setInlineStyles } from 'projectrix';
import type { Options } from '$lib/options';
import { PerfInProgress, type Perf } from './perfs.svelte';

export function runPerf(perf: Perf, options: Options): void {
  if (!browser) return;
  perf.durationMs = PerfInProgress;

  const subject = perf.instance!.getSubjectElement();
  const target = perf.instance!.getTargetElement();

  clearInlineStyles(target);

  requestAnimationFrame(() => {
    const startMs = Date.now();
    const { toSubject } = getProjection(subject, target, { log: options.log });
    perf.durationMs = Date.now() - startMs;

    setInlineStyles(target, toSubject);
  });
}
