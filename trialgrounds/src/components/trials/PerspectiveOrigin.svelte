<script lang="ts">
  import type { Trial, TrialControls } from '$lib/trials/trials';

  export let trial: Trial;
  export let hideSubject: boolean | undefined = undefined;

  let targetElement: HTMLElement;
  function getTargetElement(): HTMLElement {
    return targetElement;
  }

  let subjectElement: HTMLElement;
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

<div class="subject-container" class:hideSubject>
  <div
    bind:this={subjectElement}
    class="default-subject-element subject-element subject-perspective"
  >
    subject-perspective-origin
  </div>
</div>

<div class="target-container">
  <div bind:this={targetElement} class="target-element">{trial.name}</div>
</div>

<style lang="scss">
  .subject-container {
    perspective-origin: bottom right;
    perspective: 200px;
  }

  .subject-perspective {
    top: 1em;
    left: 1em;
    transform: rotateX(20deg) rotateZ(15deg);
  }

  .target-container {
    perspective-origin: bottom left;
    perspective: 200px;
  }

  .target-element {
    transform: rotateX(-45deg) rotateY(10deg);
  }
</style>
