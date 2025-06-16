<script lang="ts">
  import type { TrialProps } from '$lib/trials/trials.svelte';

  let { trial, hideSubject }: TrialProps = $props();

  let targetElement = $state() as HTMLElement;
  export function getTargetElement(): HTMLElement {
    return targetElement;
  }

  let subjectElement = $state() as HTMLElement;
  export function getSubjectElement(): HTMLElement {
    return subjectElement;
  }
</script>

<div
  bind:this={subjectElement}
  class="default-subject-element subject-element subject-element-3d"
  class:hideSubject
>
  subject-3d
</div>

<div class="target-container outer">
  <div class="target-container inner">
    <div bind:this={targetElement} class="target-element {trial.name}">{trial.name}</div>
  </div>
</div>

<style lang="scss">
  .subject-element-3d {
    left: 1em;
    top: 1em;
    transform: rotateY(25deg);
    pointer-events: none;
  }

  .target-container {
    padding: 1em;
    width: fit-content;
    height: fit-content;

    transform-style: preserve-3d;
    -webkit-transform-style: preserve-3d;
  }
  .outer {
    transform: rotateY(65deg);
  }
  .inner {
    transform: rotateY(253deg);
  }

  .target-element {
    transform: rotateY(25deg);
  }
</style>
