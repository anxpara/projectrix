<script lang="ts">
  import type { TrialProps } from '$lib/trials/trials.svelte';

  let { trial }: TrialProps = $props();

  let targetElement = $state() as HTMLElement;
  export function getTargetElement(): HTMLElement {
    return targetElement;
  }
</script>

<div class="target-container deep">
  <div class="target-container">
    <div bind:this={targetElement} class="target-element {trial.name}">{trial.name}</div>
  </div>
</div>

<style lang="scss">
  .deep {
    position: relative;
    padding: 2em;
  }

  .target-container {
  }

  .target-element {
    position: absolute;
    top: 0.5em;
    left: 0.5em;
  }
</style>
