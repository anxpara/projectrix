<script lang="ts">
  import type { Options } from '$lib/options';
  import type { Trial, TrialControls } from '$lib/trials';
  import { clearInlineStyles, getProjection, setInlineStyles } from 'projectrix';

  export let trial: Trial;
  export let hideSubject: boolean | undefined = undefined;

  let targetElement: HTMLElement;
  function getTargetElement(): HTMLElement {
    return targetElement;
  }

  function playCustomAnimation(defaultSubject: HTMLElement, trialOptions: Options): void {
    clearInlineStyles(targetElement);
    const { toSubject, toTargetOrigin } = getProjection(defaultSubject, targetElement, {
      transformType: 'matrix3d',
      log: trialOptions.log,
    });

    const projection = trialOptions.toTargetOrigin ? toTargetOrigin : toSubject;
    setInlineStyles(targetElement, projection);
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
