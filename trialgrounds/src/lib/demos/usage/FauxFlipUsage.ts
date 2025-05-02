import { getProjection, setInlineStyles, clearInlineStyles } from 'projectrix';
import { animate } from 'motion';

function fauxFlip(subject: HTMLElement, target: HTMLElement): void {
  const { toSubject, toTargetOrigin } = getProjection(subject, target);

  // set target to subject's projection
  setInlineStyles(target, toSubject);
  target.style.opacity = '1';
  subject.style.opacity = '0';

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
}
