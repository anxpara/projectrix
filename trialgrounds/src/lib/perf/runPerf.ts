import { clearInlineStyles, getProjection, setInlineStyles } from 'projectrix';
import { PerfInProgress, type Perf } from './perfs';
import type { Options } from '$lib/options';
import { browser } from '$app/environment';

export function runPerf(perf: Perf, options: Options): void {
  if (!browser) return;

  perf.durationMs.set(PerfInProgress);

  const subject = perf.perfComponent!.getPerfControls().getSubjectElement();
  const target = perf.perfComponent!.getPerfControls().getTargetElement();

  clearInlineStyles(target);

  requestAnimationFrame(() => {
    const startMs = Date.now();
    const { toSubject, toTargetOrigin } = getProjection(subject, target, { log: options.log });
    perf.durationMs.set(Date.now() - startMs);

    setInlineStyles(target, toSubject);
  });
}
