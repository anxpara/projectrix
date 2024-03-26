<script lang="ts">
  import type { Trial, TrialControls } from '$lib/trials';

  export let trial: Trial;
  export let hideSubject: boolean | undefined = undefined;

  let targetElement: HTMLElement;
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
    transform: translate(0.5em, 0.5em);
  }

  .target-element {
    position: fixed;
    top: 1em;
    right: 1em;
  }
</style>
