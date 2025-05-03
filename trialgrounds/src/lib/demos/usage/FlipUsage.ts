// don't combine projectrix's setInlineStyles with animejs' animate; use utils.set
import { measureSubject, getProjection, clearInlineStyles } from 'projectrix';
import { animate, utils } from 'animejs';

// the F.L.I.P. technique inverts a direct animation: measure the element's first position,
// apply a dom change to it, then play the animation from its first position to its last
function flipTargetToNextParent(target: HTMLElement, nextParent: HTMLElement): void {
  const firstPosition = measureSubject(target);

  nextParent.append(target);

  // RAF waits for pending dom changes to be rendered
  requestAnimationFrame(() => {
    // set target to the projection of its first position
    const { toSubject, toTargetOrigin } = getProjection(firstPosition, target);
    utils.set(target, toSubject);

    // animate target to its last position, i.e. its current origin
    animate(target, {
      ...toTargetOrigin,
      
      duration: 1000,
      ease: 'outQuad',

      // clear inline styles from the projection once they're redundant
      onComplete: () => clearInlineStyles(target),
    });
  });
}