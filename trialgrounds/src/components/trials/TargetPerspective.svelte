<script lang="ts">
  import type { TrialProps } from '$lib/trials/trials.svelte';

  let { trial }: TrialProps = $props();

  let targetElement = $state() as HTMLElement;
  export function getTargetElement(): HTMLElement {
    return targetElement;
  }
</script>

<div class="target-container">
  <div bind:this={targetElement} class="target-element">{trial.name}</div>
</div>

<style lang="scss">
  .target-container {
    perspective: 200px;
  }

  .target-element {
    transform: rotateX(-45deg) rotateY(10deg);
  }
</style>
