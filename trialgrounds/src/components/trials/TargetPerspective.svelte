<script lang="ts">
  import type { Trial, TrialControls } from '$lib/trials/trials';

  interface Props {
    trial: Trial;
    hideSubject?: boolean | undefined;
  }

  let { trial, hideSubject = undefined }: Props = $props();

  let targetElement: HTMLElement = $state();
  function getTargetElement(): HTMLElement {
    return targetElement;
  }

  export function getTrialControls(): TrialControls {
    return {
      getTargetElement,
    };
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
