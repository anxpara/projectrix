<script lang="ts">
  import type { Trial, TrialControls } from '$lib/trials/trials';
  import type { ProjectionOptions } from 'projectrix';

  export let trial: Trial;
  export let hideSubject: boolean | undefined = undefined;

  let targetElement: HTMLElement;
  function getTargetElement(): HTMLElement {
    return targetElement;
  }

  function getProjectionOptions(): ProjectionOptions {
    return {
      useBorder: 'target',
    };
  }

  export function getTrialControls(): TrialControls {
    return {
      getTargetElement,
      getProjectionOptions,
    };
  }
</script>

<div class="target-container">
  <div bind:this={targetElement} class="target-element">{trial.name}</div>
</div>

<style lang="scss">
  .target-element {
    padding: 0.5em;
    border: solid 5px;
    box-sizing: border-box;
  }
</style>
