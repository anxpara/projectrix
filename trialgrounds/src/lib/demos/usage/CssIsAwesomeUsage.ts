import { getProjection, setInlineStyles, clearInlineStyles } from 'projectrix';
import { animate } from 'motion';

let currentSide: 'left' | 'right' = 'left';

function flipFromCurrentSide(): void {
  const subject = currentSide === 'left' ? leftTarget : rightTarget;
  const target = currentSide === 'left' ? rightTarget : leftTarget;
  const { toSubject, toTargetOrigin } = getProjection(subject, target);

  setInlineStyles(target, toSubject);
  subject.style.opacity = '0';
  target.style.opacity = '1';

  const flipAnim = animate(
    target,
    { ...toTargetOrigin },
    { duration: 0.75, easing: 'ease-in-out' },
  );

  flipAnim.finished.then(() => {
    clearInlineStyles(target);
    currentSide = otherSide(currentSide);
    toNeutral();
  });
}