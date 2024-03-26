<script lang="ts">
  import type { Options } from '$lib/options';
  import type { Trial, TrialControls } from '$lib/trials';
  import {
    clearInlineStyles,
    getProjection,
    setInlineStyles,
    type PartialProjectionResults,
  } from 'projectrix';

  export let trial: Trial;
  export let hideSubject: boolean | undefined = undefined;

  let targetElement: HTMLElement;
  function getTargetElement(): HTMLElement {
    return targetElement;
  }

  function playCustomAnimation(defaultSubject: HTMLElement, trialOptions: Options): void {
    clearInlineStyles(targetElement);
    targetElement.style.borderStyle = 'solid';
    targetElement.style.borderColor = 'limegreen';

    const { toSubject } = getProjection(defaultSubject, targetElement, {
      transformType: 'matrix3d',
    }) as PartialProjectionResults;
    delete toSubject.borderStyle;

    targetElement.style.borderStyle = 'dashed';
    setInlineStyles(targetElement, toSubject);

    clearInlineStyles(targetElement, toSubject);

    if (targetElement.style.borderStyle !== 'dashed') {
      targetElement.style.borderColor = 'red';
    }
  }

  export function getTrialControls(): TrialControls {
    return {
      getTargetElement,
      playCustomAnimation,
    };
  }
</script>

<div class="target-container">
  <div bind:this={targetElement} class="target-element {trial.name}">{trial.name}</div>
</div>

<style lang="scss">
  .target-element {
    outline: none;
    border: solid 2px limegreen;
  }
</style>
