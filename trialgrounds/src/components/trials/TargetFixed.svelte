<script lang="ts">
  import type { TrialProps } from '$lib/trials/trials.svelte';

  let { trial }: TrialProps = $props();

  let targetElement = $state() as HTMLElement;
  export function getTargetElement(): HTMLElement {
    return targetElement;
  }
</script>

<div class="target-container">
  <div bind:this={targetElement} class="target-element {trial.name}">{trial.name}</div>
  <p>(container of target-fixed)</p>
</div>

<style lang="scss">
  .target-container {
    position: relative;
  }

  .target-element {
    position: fixed;
    top: 1em;
    right: 1em;
  }
</style>
