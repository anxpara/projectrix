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

<div class="subject-container" class:hideSubject>
  <div
    bind:this={subjectElement}
    class="default-subject-element subject-element subject-perspective"
  >
    subject-perspective
  </div>
</div>

<div class="target-container">
  <div bind:this={targetElement} class="target-element">{trial.name}</div>
</div>

<style lang="scss">
  .subject-container {
    perspective: 200px;
  }

  .subject-perspective {
    left: 1em;
    top: 1em;
    transform: rotateX(20deg) rotateZ(15deg);
  }

  .target-container {
    perspective: 200px;
  }

  .target-element {
    transform: rotateX(-45deg) rotateY(10deg);
  }
</style>
