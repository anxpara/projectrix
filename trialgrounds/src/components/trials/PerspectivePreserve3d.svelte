<script lang="ts">
  import type { Trial, TrialControls } from '$lib/trials/trials';
  import type { ProjectionOptions } from 'projectrix';

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

  function getProjectionOptions(): ProjectionOptions {
    return {
      // use anime.js, since motion one can't handle this perspective animation
      transformType: 'matrix3d',
    };
  }

  export function getTrialControls(): TrialControls {
    return {
      getTargetElement,
      getSubjectElement,
      getProjectionOptions,
    };
  }
</script>

<div class="subject-container" class:hideSubject>
  <div
    bind:this={subjectElement}
    class="default-subject-element subject-element subject-perspective"
    class:hideSubject
  >
    subject-perspective
  </div>
</div>

<div class="target-container outer">
  <div class="target-container inner">
    <div bind:this={targetElement} class="target-element">
      <span>{trial.name}</span>
    </div>
  </div>
</div>

<style lang="scss">
  .subject-container {
    perspective: 200px;
  }

  .subject-perspective {
    top: 1em;
    left: 1em;

    transform: rotateX(20deg) rotateZ(15deg);
  }

  .outer {
    padding: 1em;

    perspective: 200px;

    transform-origin: left;
    transform: rotateY(315deg);
    transform-style: preserve-3d;
  }

  .inner {
    transform-origin: bottom;
    transform: rotateX(47deg);
    transform-style: preserve-3d;
  }

  .target-element {
    transform: translate(1em, 0.6em) rotateX(314deg) rotateY(360deg) translateY(-2em);
  }
</style>
