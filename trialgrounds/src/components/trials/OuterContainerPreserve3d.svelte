<script lang="ts">
  import type { Trial, TrialControls } from '$lib/trials/trials';

  interface Props {
    trial: Trial;
    hideSubject?: boolean | undefined;
  }

  let { trial, hideSubject = undefined }: Props = $props();

  let targetElement: HTMLElement = $state();
  function getTargetElement(): HTMLElement {
    return targetElement;
  }

  let subjectElement: HTMLElement = $state();
  function getSubjectElement(): HTMLElement {
    return subjectElement;
  }

  export function getTrialControls(): TrialControls {
    return {
      getTargetElement,
      getSubjectElement,
    };
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
    top: 1em;
    left: 1em;
    pointer-events: none;
    transform: rotateY(25deg);
  }

  .target-container {
    width: fit-content;
    height: fit-content;
    padding: 1em;
  }
  .outer {
    transform-style: preserve-3d;
    -webkit-transform-style: preserve-3d;
    transform: rotateY(65deg);
  }
  .inner {
    transform: rotateY(253deg);
  }

  .target-element {
    transform: rotateY(25deg);
  }
</style>
