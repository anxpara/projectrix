<script lang="ts">
  import { onMount } from 'svelte';
  import type { TrialProps } from '$lib/trials/trials.svelte';

  let { trial, hideSubject }: TrialProps = $props();

  let container = $state() as HTMLElement;

  let subjectElement = $state() as HTMLElement;
  export function getSubjectElement(): HTMLElement {
    return subjectElement;
  }

  let targetElement = $state() as HTMLElement;
  export function getTargetElement(): HTMLElement {
    return targetElement;
  }

  onMount(() => {
    container.scrollTop = 400;
  });
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
