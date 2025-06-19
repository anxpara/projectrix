<script lang="ts">
  import type { ProjectionOptions } from 'projectrix';
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

  export function getProjectionOptions(): ProjectionOptions {
    return {
      useBorder: 'zero',
    };
  }
</script>

<div bind:this={subjectElement} class="default-subject-element subject-element" class:hideSubject>
  subject-bordered
</div>

<div class="target-container">
  <div bind:this={targetElement} class="target-element {trial.name}">{trial.name}</div>
</div>

<style lang="scss">
  .subject-element {
    border-width: 1px 4px 8px 12px;
    border-style: dashed;
    border-radius: 25px 10px 7px 3px;
    outline: none;
    pointer-events: none;
  }

  .target-container {
    position: relative;
  }

  .target-element {
    border-width: 1px 4px 8px 12px;
    border-style: solid;
    border-radius: 25px 10px 7px 3px;
    outline: none;
  }
</style>
