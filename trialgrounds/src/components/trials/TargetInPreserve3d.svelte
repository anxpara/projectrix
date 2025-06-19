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

<div class="target-container">
  <div bind:this={targetElement} class="target-element {trial.name}">{trial.name}</div>
</div>

<style lang="scss">
  .subject-element-3d {
    left: 1em;
    top: 1em;
    transform: rotateX(20deg) rotateZ(15deg);
    pointer-events: none;
  }

  .target-container {
    position: relative;
    transform: rotateX(-30deg) rotateZ(-30deg);
    transform-style: preserve-3d;
    -webkit-transform-style: preserve-3d;
  }

  .target-element {
    transform: rotateX(-20deg) rotateZ(-15deg);
  }
</style>
