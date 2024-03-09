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
    return {
      transformType: 'matrix3d',
    };
  }
</script>

<div class="target-container">
  <div bind:this={targetElement} class="target-element {trial.name}">{trial.name}</div>
</div>

<style lang="scss">
  .target-element {
    transform: rotate(-15deg);
  }
</style>
