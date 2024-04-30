<script lang="ts">
  import type { Trial, TrialControls } from '$lib/trials/trials';

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
  <div bind:this={targetElement} class="target-element {trial.name}">target-{trial.name}</div>
</div>
