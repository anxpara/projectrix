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
</div>

<style lang="scss">
  .target-element {
    margin: 1em;
  }
</style>
