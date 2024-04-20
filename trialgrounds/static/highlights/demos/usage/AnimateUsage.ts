import { getProjection, type PartialProjection } from 'projectrix';
import { animate, type AnimationControls } from 'motion';

let currentAnim: AnimationControls | undefined;

function animateDirect(subject: HTMLElement, target: HTMLElement): void {
  // stop current animation; motion one will update target's inline
  // styles to mid-animation values
  if (currentAnim?.currentTime && currentAnim.currentTime < 1) {
    currentAnim.stop();
  }

  const toSubject = getProjection(subject, target).toSubject as PartialProjection;
  delete toSubject.borderStyle; // preserve target border style

  currentAnim = animate(
    target,
    { ...toSubject },
    {
      duration: 0.4,
      easing: 'ease-out',
    },
  );
}
