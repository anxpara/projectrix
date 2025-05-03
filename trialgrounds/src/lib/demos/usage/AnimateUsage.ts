import { getProjection, type PartialProjectionResults } from 'projectrix';
import { animate } from 'animejs';

function animateTargetToSubject(target: HTMLElement, subject: HTMLElement): void {
  const { toSubject } = getProjection(subject, target) as PartialProjectionResults;
  delete toSubject.borderStyle; // preserve target's border style

  animate(target, {
    ...toSubject,

    duration: 400,
    ease: 'outQuad',
  });
}
