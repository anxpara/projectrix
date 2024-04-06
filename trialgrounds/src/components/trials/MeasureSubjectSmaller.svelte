<script lang="ts">
  import type { Options } from '$lib/options';
  import type { Trial, TrialControls } from '$lib/trials';

  export let trial: Trial;
  export let hideSubject: boolean | undefined = undefined;

  let targetElement: HTMLElement;
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
