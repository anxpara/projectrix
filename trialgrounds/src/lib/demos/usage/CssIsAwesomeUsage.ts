// setInlineStyles and animejs' utils.set can both be used with waapi.animate
import { setInlineStyles, getProjection, clearInlineStyles } from 'projectrix';
import { waapi } from 'animejs';

function fauxFlip(currentTarget: HTMLElement, nextTarget: HTMLElement): void {
  const { toSubject, toTargetOrigin } = getProjection(currentTarget, nextTarget);

  // set nextTarget to currentTarget's projection
  setInlineStyles(nextTarget, toSubject);
  currentTarget.style.opacity = '0';
  nextTarget.style.opacity = '1';

  // FLIP nextTarget back to its origin
  waapi.animate(nextTarget, {
    ...toTargetOrigin,

    duration: 2000,
    ease: 'inOutQuad',

    // clear inline styles from the projection once they're redundant
    onComplete: () => clearInlineStyles(nextTarget),
  });
}