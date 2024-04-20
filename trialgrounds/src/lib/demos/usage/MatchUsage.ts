import { getProjection, setInlineStyles, type PartialProjectionResults } from 'projectrix';

function match(subject: HTMLElement, target: HTMLElement): void {
  const { toSubject } = getProjection(subject, target) as PartialProjectionResults;
  delete toSubject.borderStyle; // preserve target border style

  setInlineStyles(target, toSubject);
}
