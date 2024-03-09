import anime from 'animejs';
import type { Trial } from './trials';
import { getProjection, type Projection, type ProjectionOptions } from 'projectrix';
import { animate } from 'motion';
import { mat4 } from 'gl-matrix';

export function animateTrial(
  trial: Trial,
  defaultSubject: HTMLElement,
  toOrigin = false,
  skipAnimation = false,
  log = false,
  duration = 1000,
): void {
  const target = trial.trialComponent!.getTargetElement();
  const subject = trial.trialComponent!.getSubjectElement() ?? defaultSubject;
  const options: ProjectionOptions = trial.trialComponent!.getProjectionOptions() ?? {};
  options.transformType = skipAnimation ? 'transform' : options.transformType ?? 'transform';

  // reset target
  anime.remove(target);
  if (trial.animation?.currentTime && trial.animation.currentTime < 1) {
    trial.animation.stop();
    trial.animation = undefined;
  }
  clearInlineStyles(target);

  // mark target origin
  if (!toOrigin) {
    trial.originMarker!.markOrigin(trial.trialComponent!.getTargetElement());
  }

  // project
  const projectionResults = getProjection(subject, target, options);
  const { toSubject, toTargetOrigin } = projectionResults;
  if (log) {
    console.log(projectionResults);
  }

  if (skipAnimation) {
    setInlineStyles(target, toOrigin ? toTargetOrigin : toSubject);
    return;
  }

  if (options.transformType === 'transformMat4') {
    toSubject.matrix3d = convertMat4ToCssMatrix3dSubstring(toSubject.transformMat4 as mat4);
    toTargetOrigin.matrix3d = convertMat4ToCssMatrix3dSubstring(
      toTargetOrigin.transformMat4 as mat4,
    );
    delete toSubject.transformMat4;
    delete toTargetOrigin.transformMat4;
    options.transformType = 'matrix3d';
  }

  trial.toTargetOrigin = toTargetOrigin;

  // animate
  if (options.transformType === 'matrix3d') {
    if (toOrigin) {
      anime.set(target, {
        ...toSubject,

        pointerEvents: 'none',
      });

      anime({
        targets: target,
        duration: skipAnimation ? 0 : duration,
        easing: 'easeInOutQuad',

        ...toTargetOrigin,

        complete: () => {
          trial.originMarker!.unmark();
          anime.set(target, {
            pointerEvents: 'all',
          });
        },
      });
    } else {
      anime.set(target, {
        ...toTargetOrigin,

        borderStyle: toSubject.borderStyle,
        pointerEvents: 'none',
      });

      anime({
        targets: target,
        duration: skipAnimation ? 0 : duration,
        easing: 'easeInOutQuad',

        ...toSubject,
      });
    }
  } else if (options.transformType === 'transform') {
    if (toOrigin) {
      animate(
        target,
        {
          ...toSubject,
          pointerEvents: 'none',
        },
        {
          duration: 0,
        },
      );

      trial.animation = animate(
        target,
        {
          ...toTargetOrigin,
        },
        {
          duration: skipAnimation ? 0 : duration / 1000,
          easing: 'ease-in-out',
        },
      );

      trial.animation.finished.then(() => {
        trial.originMarker!.unmark();
        anime.set(target, {
          pointerEvents: 'all',
        });
      });
    } else {
      animate(
        target,
        {
          ...toTargetOrigin,

          borderStyle: toSubject.borderStyle,
          pointerEvents: 'none',
        },
        {
          duration: 0,
        },
      );

      trial.animation = animate(
        target,
        {
          ...toSubject,
        },
        {
          duration: skipAnimation ? 0 : duration / 1000,
          easing: 'ease-in-out',
        },
      );
    }
  }
}

export function animateTrialReturn(
  trial: Trial,
  toOrigin = false,
  skipAnimation = false,
  _log = false,
  duration = 500,
): void {
  if (toOrigin || !trial.toTargetOrigin) return;

  const target = trial.trialComponent!.getTargetElement();
  const options: ProjectionOptions = trial.trialComponent!.getProjectionOptions() ?? {};
  options.transformType = options.transformType ?? 'transform';

  if (options.transformType === 'transformMat4') {
    // trial.toTargetOrigin converted to matrix3d earlier
    options.transformType = 'matrix3d';
  }

  if (options.transformType === 'matrix3d') {
    anime.remove(target);
    anime({
      targets: target,
      duration: skipAnimation ? 0 : duration,
      easing: 'easeInOutQuad',

      ...trial.toTargetOrigin,

      complete: () => {
        anime.set(target, {
          pointerEvents: 'all',
        });

        clearInlineStyles(target);

        trial.originMarker!.unmark();
      },
    });
  } else if (options.transformType === 'transform') {
    if (trial.animation?.currentTime && trial.animation.currentTime < 1) {
      trial.animation.stop();
      trial.animation = undefined;
    }

    trial.animation = animate(
      target,
      {
        ...trial.toTargetOrigin,
      },
      {
        duration: skipAnimation ? 0 : duration / 1000,
        easing: 'ease-in-out',
      },
    );

    trial.animation.finished.then(() => {
      anime.set(target, {
        pointerEvents: 'all',
      });

      clearInlineStyles(target);

      trial.originMarker!.unmark();
    });
  }
}

function setInlineStyles(target: HTMLElement, projection: Projection): void {
  target.style.width = projection.width;
  target.style.height = projection.height;
  target.style.borderStyle = projection.borderStyle;
  target.style.borderWidth = projection.borderWidth;
  target.style.borderRadius = projection.borderRadius;
  target.style.transformOrigin = projection.transformOrigin;
  target.style.transform = projection.transform;
}

function clearInlineStyles(target: HTMLElement): void {
  target.style.width = '';
  target.style.height = '';
  target.style.borderStyle = '';
  target.style.borderWidth = '';
  target.style.borderRadius = '';
  target.style.transformOrigin = '';
  target.style.transform = '';
}

function convertMat4ToCssMatrix3dSubstring(mat: mat4): string {
  let str = mat4.str(mat);
  str = str.split('(')[1];
  str = str.split(')')[0];
  return str;
}
