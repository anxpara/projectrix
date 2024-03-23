<script lang="ts">
  import type { Trial } from '$lib/trials';
  import type { ProjectionOptions } from 'projectrix';

  export let trial: Trial;
  export let hideSubject: boolean | undefined = undefined;

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

<div class="target-container">
  <div bind:this={targetElement} class="target-element {trial.name}">{trial.name}</div>
</div>

<style lang="scss">
  .target-container {
    transform: translate(0.5em, 0.5em);
  }

  .target-element {
    position: absolute;
    top: 1em;
    left: 1em;
  }
</style>
