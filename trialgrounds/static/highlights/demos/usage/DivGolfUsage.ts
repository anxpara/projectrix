import { getProjection, setInlineStyles } from 'projectrix';

let currentTarget: HTMLElement;

// each modifier contains a unique green target. match the next target to
// the current target and swap their opacities to create the illusion of
// a single green target being passed between the modifiers
function moveCurrentTargetToModifier(modifier: HTMLElement): void {
  const nextTarget = modifier.firstElementChild as HTMLElement;
  if (currentTarget.isSameNode(nextTarget)) return;

  // match next target to current target's projection
  const { toSubject } = getProjection(currentTarget, nextTarget);
  setInlineStyles(nextTarget, toSubject);

  // swap targets
  currentTarget.style.opacity = '0';
  nextTarget.style.opacity = '1';
  currentTarget = nextTarget;
}