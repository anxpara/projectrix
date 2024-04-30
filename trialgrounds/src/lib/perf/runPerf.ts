import { clearInlineStyles, getProjection, setInlineStyles } from 'projectrix';
import { PerfInProgress, type Perf } from './perfs';
import type { Options } from '$lib/options';
import { browser } from '$app/environment';

export function runPerf(perf: Perf, options: Options): void {
  if (!browser) return;
  const perfControls = perf.perfComponent!.getPerfControls();

  perf.durationMs.set(PerfInProgress);

  const subject = perfControls.getSubjectElement();
  const target = perfControls.getTargetElement();

  clearInlineStyles(target);

  requestAnimationFrame(() => {
    const startMs = Date.now();
    const { toSubject } = getProjection(subject, target, { log: options.log });
    perf.durationMs.set(Date.now() - startMs);

    setInlineStyles(target, toSubject);
  });
}
