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
  <div bind:this={targetElement} class="target-element {trial.name}">{trial.name}</div>
</div>

<style lang="scss">
  .subject-element {
    pointer-events: none;
  }

  .target-container {
    position: relative;
  }

  .target-element {
    outline: none;
    border-style: dashed;
    border-width: 1px 4px 8px 12px;
    border-radius: 25px 10px 7px 3px;
  }
</style>
