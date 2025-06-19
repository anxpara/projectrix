<script lang="ts">
  import type { ProjectionOptions } from 'projectrix';
  import type { TrialProps } from '$lib/trials/trials.svelte';

  let { trial }: TrialProps = $props();

  let targetElement = $state() as HTMLElement;
  export function getTargetElement(): HTMLElement {
    return targetElement;
  }

  export function getProjectionOptions(): ProjectionOptions {
    return {
      useBorder: 'target',
    };
  }
</script>

<div class="target-container">
  <div bind:this={targetElement} class="target-element {trial.name}">{trial.name}</div>
</div>

<style lang="scss">
  .subject-element {
    pointer-events: none;
  }

  .target-container {
    position: relative;
  }

  .target-element {
    border-width: 1px 4px 8px 12px;
    border-style: dashed;
    border-radius: 25px 10px 7px 3px;
    outline: none;
  }
</style>
