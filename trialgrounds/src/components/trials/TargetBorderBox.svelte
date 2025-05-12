<script lang="ts">
  import type { Trial, TrialControls } from '$lib/trials/trials';
  import type { ProjectionOptions } from 'projectrix';

  interface Props {
    trial: Trial;
    hideSubject?: boolean | undefined;
  }

  let { trial, hideSubject = undefined }: Props = $props();

  let targetElement: HTMLElement = $state();
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
