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
  <div bind:this={targetElement} class="target-element {trial.name}">{trial.name}</div>
</div>

<style lang="scss">
  .target-container {
    position: relative;
  }

  .target-element {
    width: 6em;
    height: 5em;
    transform-origin: top left;
    transform: rotate(-15deg);
  }
</style>
