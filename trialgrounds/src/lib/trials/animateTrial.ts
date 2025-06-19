import { animate, utils, type JSAnimation } from 'animejs';
import { mat4 } from 'gl-matrix';
import {
  clearInlineStyles,
  getProjection,
  measureSubject,
  setInlineStyles,
  type Measurement,
  type Projection,
  type ProjectionOptions,
} from 'projectrix';
import type { Options } from '$lib/options';
import type { Trial, TrialAnimationOptions } from './trials.svelte';

// probably needs more refactoring
export function animateTrial(
  trial: Trial,
  defaultSubject: HTMLElement,
  trialOptions: Options,
  animationOptions?: TrialAnimationOptions,
): void {
  trialOptions = {
    ...trialOptions,
    ...trial.instance!.getTrialOptionOverrides?.(),
  };

  // allow trial to override the animation
  const playCustomAnimation = trial.instance!.playCustomAnimation;
  if (playCustomAnimation) {
    playCustomAnimation(defaultSubject, trialOptions, animationOptions);
    return;
  }

  const target = trial.instance!.getTargetElement();
  const subjectEl = trial.instance!.getSubjectElement?.() ?? defaultSubject;

  let options: ProjectionOptions = trial.instance!.getProjectionOptions?.() ?? {};
  options = {
    ...options,
    transformType: options.transformType ?? 'transform',
    log: trialOptions.log,
  };

  // reset target
  utils.remove(target);
  clearInlineStyles(target);

  // mark target origin
  if (!trialOptions.toTargetOrigin || !trialOptions.skipAnimation) {
    trial.originMarker?.markOrigin(trial.instance!.getTargetElement());
  } else {
    trial.originMarker?.unmark();
  }

  const subject: HTMLElement | Measurement = trialOptions.alwaysMeasure
    ? measureSubject(subjectEl)
    : subjectEl;

  // project
  const { toSubject, toTargetOrigin } = getProjection(subject, target, options);

  if (trialOptions.skipAnimation) {
    setInlineStyles(target, trialOptions.toTargetOrigin ? toTargetOrigin : toSubject);
    animationOptions?.complete?.(trialOptions);
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
  const durationMs = animationOptions?.duration ?? 1000;
  if (trialOptions.toTargetOrigin) {
    trial.animation = animateToTargetOrigin(target, toSubject, toTargetOrigin, durationMs, () => {
      trial.originMarker?.unmark();
      animationOptions?.complete?.(trialOptions);
    });
  } else {
    trial.animation = animateToSubject(target, toSubject, toTargetOrigin, durationMs, () => {
      animationOptions?.complete?.(trialOptions);
    });
  }
}

function animateToTargetOrigin(
  target: HTMLElement,
  toSubject: Projection,
  toTargetOrigin: Projection,
  duration: number,
  onComplete: () => void,
): JSAnimation {
  utils.set(target, {
    ...toSubject,
    pointerEvents: 'none',
  });

  return animate(target, {
    ...toTargetOrigin,
    duration,
    ease: 'inOutQuad',

    onComplete: () => {
      utils.set(target, {
        pointerEvents: 'all',
      });
      onComplete();
    },
  });
}

function animateToSubject(
  target: HTMLElement,
  toSubject: Projection,
  toTargetOrigin: Projection,
  duration: number,
  onComplete: () => void,
): JSAnimation {
  utils.set(target, {
    ...toTargetOrigin,
    borderStyle: toSubject.borderStyle,
    pointerEvents: 'none',
  });

  return animate(target, {
    ...toSubject,
    duration,
    ease: 'inOutQuad',

    onComplete,
  });
}

export function animateTrialReturn(trial: Trial, trialOptions: Options, durationMs = 500): void {
  trialOptions = {
    ...trialOptions,
    ...trial.instance!.getTrialOptionOverrides?.(),
  };

  const target = trial.instance!.getTargetElement();
  if (trialOptions.skipAnimation) {
    onReturnComplete(target, trial);
    return;
  }
  if (trialOptions.toTargetOrigin || !trial.toTargetOrigin) return;

  const options: ProjectionOptions = trial.instance!.getProjectionOptions?.() ?? {};
  options.transformType = options.transformType ?? 'transform';

  if (options.transformType === 'transformMat4') {
    // trial.toTargetOrigin converted to matrix3d earlier
    options.transformType = 'matrix3d';
  }

  trial.animation = animateReturn(target, trial.toTargetOrigin, durationMs, () => {
    onReturnComplete(target, trial);
  });
}

function animateReturn(
  target: HTMLElement,
  toTargetOrigin: Projection,
  duration: number,
  onComplete: () => void,
): JSAnimation {
  utils.remove(target);
  return animate(target, {
    ...toTargetOrigin,
    duration,
    ease: 'inOutQuad',

    onComplete,
  });
}

function onReturnComplete(target: HTMLElement, trial: Trial): void {
  utils.set(target, {
    pointerEvents: 'all',
  });

  clearInlineStyles(target);
  trial.originMarker?.unmark();
}

export function stopTrial(trial: Trial): void {
  trial.originMarker?.unmark();
  const target = trial.instance?.getTargetElement();
  if (!target) return;
  utils.remove(target);
}

function convertMat4ToCssMatrix3dSubstring(mat: mat4): string {
  let str = mat4.str(mat);
  str = str.split('(')[1];
  str = str.split(')')[0];
  return str;
}
