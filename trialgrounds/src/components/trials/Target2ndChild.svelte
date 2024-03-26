<script lang="ts">
  import type { Trial, TrialControls } from '$lib/trials';

  export let trial: Trial;
  export let hideSubject: boolean | undefined = undefined;

  let targetElement: HTMLElement;
  function getTargetElement(): HTMLElement {
    return targetElement;
  }

  export function getTrialControls(): TrialControls {
    return {
      getTargetElement,
    };
  }
</script>

<div class="target-container">
  <div class="target-element">1st child</div>
  <div bind:this={targetElement} class="target-element {trial.name}">{trial.name}</div>
</div>
