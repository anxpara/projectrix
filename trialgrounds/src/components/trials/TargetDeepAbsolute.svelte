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
