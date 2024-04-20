import { getProjection, measureSubject, setInlineStyles, clearInlineStyles } from 'projectrix';
import { animate } from 'motion';

function flip(target: HTMLElement, nextParent: HTMLElement): void {
  const subject = measureSubject(target);

  nextParent.append(target);

  requestAnimationFrame(() => {
    const { toSubject, toTargetOrigin } = getProjection(subject, target);

    // set target to subject's projection
    setInlineStyles(target, toSubject);

    // FLIP back to origin
    const flipAnimation = animate(
      target,
      { ...toTargetOrigin },
      {
        duration: 1,
        easing: 'ease-out',
      },
    );

    // clear inline styles once they're redundant
    flipAnimation.finished.then(() => clearInlineStyles(target, toTargetOrigin));
  });
}
