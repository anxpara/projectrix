// don't combine projectrix's setInlineStyles with animejs' animate; use utils.set
import { getProjection, clearInlineStyles } from 'projectrix';
import { animate, utils } from 'animejs';

function fauxFlip(currentTarget: HTMLElement, nextTarget: HTMLElement): void {
  const { toSubject, toTargetOrigin } = getProjection(currentTarget, nextTarget);

  // set nextTarget to currentTarget's projection
  utils.set(nextTarget, toSubject);
  currentTarget.style.opacity = '0';
  nextTarget.style.opacity = '1';

  // FLIP nextTarget back to its origin
  animate(nextTarget, {
    ...toTargetOrigin,

    duration: 1000,
    ease: 'outQuad',

    // clear inline styles from the projection once they're redundant
    onComplete: () => clearInlineStyles(nextTarget),
  });
}
