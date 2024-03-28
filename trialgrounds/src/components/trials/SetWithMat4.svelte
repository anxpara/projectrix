<script lang="ts">
  import type { Options } from '$lib/options';
  import type { Trial, TrialAnimationOptions, TrialControls } from '$lib/trials';
  import { clearInlineStyles, getProjection, setInlineStyles } from 'projectrix';

  export let trial: Trial;
  export let hideSubject: boolean | undefined = undefined;

  let targetElement: HTMLElement;
  function getTargetElement(): HTMLElement {
    return targetElement;
  }

  function playCustomAnimation(
    defaultSubject: HTMLElement,
    trialOptions: Options,
    animationOptions?: TrialAnimationOptions,
  ): void {
    clearInlineStyles(targetElement);
    const projectionResults = getProjection(defaultSubject, targetElement, {
      transformType: 'transformMat4',
      log: trialOptions.log,
    });
    const { toSubject, toTargetOrigin } = projectionResults;

    const projection = trialOptions.toTargetOrigin ? toTargetOrigin : toSubject;
    setInlineStyles(targetElement, projection);

    animationOptions?.complete?.call(null, trialOptions);
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
