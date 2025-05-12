<script lang="ts">
  import { onMount } from 'svelte';
  import type { Trial, TrialControls } from '$lib/trials/trials';

  interface Props {
    trial: Trial;
    hideSubject?: boolean | undefined;
  }

  let { trial, hideSubject = undefined }: Props = $props();

  let container: HTMLElement = $state();

  onMount(() => {
    container.scrollTop = 400;
  });

  let subjectElement: HTMLElement = $state();
  function getSubjectElement(): HTMLElement {
    return subjectElement;
  }

  let targetElement: HTMLElement = $state();
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
    <div class="spacer"></div>
    <div bind:this={targetElement} class="target-element {trial.name}">{trial.name}</div>
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
  }

  .subject-element {
    position: absolute;
    bottom: 0em;
    right: 0em;
  }
</style>
