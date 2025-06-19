<script lang="ts">
  import type { ProjectionOptions } from 'projectrix';
  import type { Options } from '$lib/options';
  import type { TrialProps } from '$lib/trials/trials.svelte';

  let { trial }: TrialProps = $props();

  let targetElement = $state() as HTMLElement;
  export function getTargetElement(): HTMLElement {
    return targetElement;
  }

  export function getProjectionOptions(): ProjectionOptions {
    return {
      transformType: 'matrix3d',
    };
  }

  export function getTrialOptionOverrides(): Options {
    return {
      skipAnimation: true,
    };
  }
</script>

<div class="target-container">
  <div bind:this={targetElement} class="target-element {trial.name}">{trial.name}</div>
</div>
