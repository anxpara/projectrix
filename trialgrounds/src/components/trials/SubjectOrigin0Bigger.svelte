<script lang="ts">
  import type { Trial } from '$lib/trials';
  import type { ProjectionOptions } from 'projectrix';

  export let trial: Trial;
  export let hideSubject: boolean | undefined = undefined;

  let subjectElement: HTMLElement;

  export function getSubjectElement(): HTMLElement | undefined {
    return subjectElement;
  }

  let targetElement: HTMLElement;
  export function getTargetElement(): HTMLElement {
    return targetElement;
  }

  export function getProjectionOptions(): ProjectionOptions | undefined {
    return undefined;
  }
</script>

<div bind:this={subjectElement} class="default-subject-element subject-element" class:hideSubject>
  subject-origin-0
</div>

<div class="target-container">
  <div bind:this={targetElement} class="target-element {trial.name}">{trial.name}</div>
</div>

<style lang="scss">
  .subject-element {
    transform-origin: top left;
    pointer-events: none;
    width: 6em;
    height: 5em;
  }

  .target-container {
    position: relative;
  }
</style>
