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
  <div bind:this={targetElement} class="target-element">{trial.name}</div>
</div>

<style lang="scss">
  .target-element {
    box-sizing: border-box;
    border: solid 5px;
    padding: 0.5em;
  }
</style>
