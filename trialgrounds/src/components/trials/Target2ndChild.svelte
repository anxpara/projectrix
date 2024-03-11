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
  <div class="target-element">1st child</div>
  <div bind:this={targetElement} class="target-element {trial.name}">{trial.name}</div>
</div>
