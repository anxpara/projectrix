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

<div class="target-container">
  <div bind:this={targetElement} class="target-element {trial.name}">{trial.name}</div>
</div>

<style lang="scss">
  .subject-element-3d {
    top: 1em;
    left: 1em;
    pointer-events: none;
    transform: rotateX(20deg) rotateZ(15deg);
  }

  .target-container {
    position: relative;
    transform-style: preserve-3d;
    -webkit-transform-style: preserve-3d;
    transform: rotateX(-30deg) rotateZ(-30deg);
  }

  .target-element {
    transform: rotateX(-20deg) rotateZ(-15deg);
  }
</style>
