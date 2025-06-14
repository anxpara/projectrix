<script lang="ts">
  import type { Options } from '$lib/options';
  import type { TrialProps } from '$lib/trials/trials.svelte';

  let { trial }: TrialProps = $props();

  let targetElement = $state() as HTMLElement;
  export function getTargetElement(): HTMLElement {
    return targetElement;
  }

  export function getTrialOptionOverrides(): Options {
    return {
      alwaysMeasure: true,
    };
  }
</script>

<div class="target-container">
  <div bind:this={targetElement} class="target-element {trial.name}">{trial.name}</div>
</div>

<style lang="scss">
  .target-element {
    transform-origin: 0px 0px 0px;
    transform: rotate(-15deg);
  }
</style>
