<script lang="ts">
  import type { Options } from '$lib/options';
  import type { Trial, TrialControls } from '$lib/trials';
  import type { ProjectionOptions } from 'projectrix';

  export let trial: Trial;
  export let hideSubject: boolean | undefined = undefined;

  let targetElement: HTMLElement;
  function getTargetElement(): HTMLElement {
    return targetElement;
  }

  function getProjectionOptions(): ProjectionOptions {
    return {
      transformType: 'transformMat4',
    };
  }

  function getTrialOptionOverrides(): Options {
    return {
      skipAnimation: true,
    };
  }

  export function getTrialControls(): TrialControls {
    return {
      getTargetElement,
      getProjectionOptions,
      getTrialOptionOverrides,
    };
  }
</script>

<div class="target-container">
  <div bind:this={targetElement} class="target-element {trial.name}">{trial.name}</div>
</div>
