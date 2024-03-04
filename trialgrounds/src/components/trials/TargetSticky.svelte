<script lang="ts">
  import { onMount } from 'svelte';
  import type { Trial } from '$lib/trials';
  import type { ProjectionOptions } from 'projectrix';

  export let trial: Trial;
  export let hideSubject: boolean | undefined;

  let container: HTMLElement;
  let subjectElement: HTMLElement;

  onMount(() => {
    container.scrollTop = 400;
  });

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

<div class="container-container">
  <div bind:this={subjectElement} class="subject-element default-subject-element" class:hideSubject>
    subject
  </div>
  <div bind:this={container} class="target-container">
    <div class="spacer" />
    <div bind:this={targetElement} class="target-element {trial.name}">{trial.name}</div>
    <div class="spacer" />
  </div>
</div>

<style lang="scss">
  .container-container {
    position: relative;
  }

  .target-container {
    overflow: scroll;
  }

  .spacer {
    outline: dotted 2px purple;
    width: 4em;
    height: 8em;
  }

  .target-element {
    position: sticky;
    top: 0;
  }

  .subject-element {
    position: absolute;
    bottom: 0em;
    right: 0em;
  }
</style>
