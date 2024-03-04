<script lang="ts">
  import type { Trial } from '$lib/trials';
  import type { ProjectionOptions } from 'projectrix';

  export let trial: Trial;

  export function getSubjectElement(): HTMLElement | undefined {
    return undefined;
  }

  let targetElement: HTMLElement;
  export function getTargetElement(): HTMLElement {
    return targetElement;
  }

  export function getProjectionOptions(): ProjectionOptions | undefined {
    return undefined;
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
