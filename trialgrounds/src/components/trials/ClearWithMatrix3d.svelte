<script lang="ts">
  import {
    clearInlineStyles,
    getProjection,
    setInlineStyles,
    type PartialProjectionResults,
  } from 'projectrix';
  import type { Options } from '$lib/options';
  import type { TrialAnimationOptions, TrialProps } from '$lib/trials/trials.svelte';

  let { trial }: TrialProps = $props();

  let targetElement = $state() as HTMLElement;
  export function getTargetElement(): HTMLElement {
    return targetElement;
  }

  export function playCustomAnimation(
    defaultSubject: HTMLElement,
    trialOptions: Options,
    animationOptions?: TrialAnimationOptions,
  ): void {
    clearInlineStyles(targetElement);
    targetElement.style.borderStyle = 'solid';
    targetElement.style.borderColor = 'limegreen';

    const { toSubject } = getProjection(defaultSubject, targetElement, {
      transformType: 'matrix3d',
    }) as PartialProjectionResults;
    delete toSubject.borderStyle;

    if (trialOptions.log) {
      console.log(toSubject);
    }

    targetElement.style.borderStyle = 'dashed';
    setInlineStyles(targetElement, toSubject);

    clearInlineStyles(targetElement, toSubject);

    if (targetElement.style.borderStyle !== 'dashed') {
      targetElement.style.borderColor = 'red';
    }

    animationOptions?.complete?.(trialOptions);
  }
</script>

<div class="target-container">
  <div bind:this={targetElement} class="target-element {trial.name}">{trial.name}</div>
</div>

<style lang="scss">
  .target-element {
    border: solid 2px limegreen;
    outline: none;
  }
</style>
