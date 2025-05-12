<script lang="ts">
  import type { Options } from '$lib/options';
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

  function getTrialOptionOverrides(): Options {
    return {
      alwaysMeasure: true,
    };
  }

  export function getTrialControls(): TrialControls {
    return {
      getTargetElement,
      getTrialOptionOverrides,
    };
  }
</script>

<div class="target-container">
  <div bind:this={targetElement} class="target-element {trial.name}">{trial.name}</div>
</div>

<style lang="scss">
  .target-element {
    width: 6em;
    height: 5em;
    transform-origin: 25% 75% 0px;
    transform: rotate(-15deg);
  }
</style>
