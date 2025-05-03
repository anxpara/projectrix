import { setInlineStyles, getProjection } from 'projectrix';

// each modifier contains its own green target
// match the next target to the current target and toggle their opacities
function moveTargetToModifier(target: HTMLElement, modifier: HTMLElement): void {
  const nextTarget = modifier.firstElementChild as HTMLElement;
  if (target.isSameNode(nextTarget)) return;

  setInlineStyles(nextTarget, getProjection(target, nextTarget).toSubject);
  target.style.opacity = '0';
  nextTarget.style.opacity = '1';
}