import anime from 'animejs';
import type { Trial, TrialAnimationOptions } from './trials';
import {
  clearInlineStyles,
  getProjection,
  setInlineStyles,
  type ProjectionOptions,
} from 'projectrix';
import { animate } from 'motion';
import { mat4 } from 'gl-matrix';
import type { Options } from './options';

// needs refactoring
export function animateTrial(
  trial: Trial,
  defaultSubject: HTMLElement,
  trialOptions: Options,
  animationOptions?: TrialAnimationOptions,
): void {
  const duration = animationOptions?.duration ?? 1000;

  // allow trial to override the animation
  const playCustomAnimation = trial.trialComponent!.getTrialControls().playCustomAnimation;
  if (playCustomAnimation) {
    playCustomAnimation(defaultSubject, trialOptions, animationOptions);
    return;
  }

  const target = trial.trialComponent!.getTrialControls().getTargetElement();
  const subject =
    trial.trialComponent!.getTrialControls().getSubjectElement?.call(null) ?? defaultSubject;
  let options: ProjectionOptions =
    trial.trialComponent!.getTrialControls().getProjectionOptions?.call(null) ?? {};
  options = { ...options };
  options.transformType = trialOptions.skipAnimation
    ? 'transform'
    : options.transformType ?? 'transform';
  options.log = trialOptions.log;

  // reset target
  anime.remove(target);
  if (trial.animation?.currentTime && trial.animation.currentTime < 1) {
    trial.animation.stop();
    trial.animation = undefined;
  }
  clearInlineStyles(target);

  // mark target origin
  if (!trialOptions.toTargetOrigin || !trialOptions.skipAnimation) {
    trial.originMarker?.markOrigin(trial.trialComponent!.getTrialControls().getTargetElement());
  } else {
    trial.originMarker?.unmark();
  }

  // project
  const { toSubject, toTargetOrigin } = getProjection(subject, target, options);

  if (trialOptions.skipAnimation) {
    setInlineStyles(target, trialOptions.toTargetOrigin ? toTargetOrigin : toSubject);
    animationOptions?.complete?.call(null, trialOptions);
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
    if (trialOptions.toTargetOrigin) {
      anime.set(target, {
        ...toSubject,

        pointerEvents: 'none',
      });

      anime({
        targets: target,
        duration: trialOptions.skipAnimation ? 0 : duration,
        easing: 'easeInOutQuad',

        ...toTargetOrigin,

        complete: () => {
          trial.originMarker?.unmark();
          anime.set(target, {
            pointerEvents: 'all',
          });
          animationOptions?.complete?.call(null, trialOptions);
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
        duration: trialOptions.skipAnimation ? 0 : duration,
        easing: 'easeInOutQuad',

        ...toSubject,

        complete: () => {
          animationOptions?.complete?.call(null, trialOptions);
        },
      });
    }
  } else if (options.transformType === 'transform') {
    if (trialOptions.toTargetOrigin) {
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
          duration: trialOptions.skipAnimation ? 0 : duration / 1000,
          easing: 'ease-in-out',
        },
      );

      trial.animation.finished.then(() => {
        trial.originMarker?.unmark();
        anime.set(target, {
          pointerEvents: 'all',
        });
        animationOptions?.complete?.call(null, trialOptions);
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
          duration: trialOptions.skipAnimation ? 0 : duration / 1000,
          easing: 'ease-in-out',
        },
      );

      trial.animation.finished.then(() => {
        animationOptions?.complete?.call(null, trialOptions);
      });
    }
  }
}

export function animateTrialReturn(trial: Trial, trialOptions: Options, duration = 500): void {
  if (trialOptions.skipAnimation) {
    clearInlineStyles(trial.trialComponent!.getTrialControls().getTargetElement());
    trial.originMarker?.unmark();
    return;
  }
  if (trialOptions.toTargetOrigin || !trial.toTargetOrigin) return;

  const target = trial.trialComponent!.getTrialControls().getTargetElement();
  const options: ProjectionOptions =
    trial.trialComponent!.getTrialControls().getProjectionOptions?.call(null) ?? {};
  options.transformType = options.transformType ?? 'transform';

  if (options.transformType === 'transformMat4') {
    // trial.toTargetOrigin converted to matrix3d earlier
    options.transformType = 'matrix3d';
  }

  if (options.transformType === 'matrix3d') {
    anime.remove(target);
    anime({
      targets: target,
      duration: trialOptions.skipAnimation ? 0 : duration,
      easing: 'easeInOutQuad',

      ...trial.toTargetOrigin,

      complete: () => {
        anime.set(target, {
          pointerEvents: 'all',
        });

        clearInlineStyles(target);

        trial.originMarker?.unmark();
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
        duration: trialOptions.skipAnimation ? 0 : duration / 1000,
        easing: 'ease-in-out',
      },
    );

    trial.animation.finished.then(() => {
      anime.set(target, {
        pointerEvents: 'all',
      });

      clearInlineStyles(target);

      trial.originMarker?.unmark();
    });
  }
}

function convertMat4ToCssMatrix3dSubstring(mat: mat4): string {
  let str = mat4.str(mat);
  str = str.split('(')[1];
  str = str.split(')')[0];
  return str;
}
