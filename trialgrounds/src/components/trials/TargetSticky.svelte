<script lang="ts">
  import { onMount } from 'svelte';
  import type { Trial, TrialControls } from '$lib/trials/trials';

  export let trial: Trial;
  export let hideSubject: boolean | undefined = undefined;

  let container: HTMLElement;

  onMount(() => {
    container.scrollTop = 400;
  });

  let subjectElement: HTMLElement;
  function getSubjectElement(): HTMLElement {
    return subjectElement;
  }

  let targetElement: HTMLElement;
  function getTargetElement(): HTMLElement {
    return targetElement;
  }

  export function getTrialControls(): TrialControls {
    return {
      getTargetElement,
      getSubjectElement,
    };
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
