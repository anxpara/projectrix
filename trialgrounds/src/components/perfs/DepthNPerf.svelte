<script lang="ts">
  import type { Options } from '$lib/options';
  import type { Perf, PerfControls } from '$lib/perf/perfs';
  import { onMount } from 'svelte';
  import type { Writable } from 'svelte/store';

  export let perf: Perf;
  export let n: number;
  export let options: Writable<Options>;

  let subjectContainerTemplate: HTMLElement;
  let targetContainerTemplate: HTMLElement;
  let baseSubjectContainer: HTMLElement;
  let baseTargetContainer: HTMLElement;
  let target: HTMLElement;
  let subject: HTMLElement;

  onMount(() => {
    reset();
  });

  function reset(): void {
    subjectContainerTemplate.style.display = '';
    targetContainerTemplate.style.display = '';
    appendElementIntoLayers(subject, baseSubjectContainer, subjectContainerTemplate, -1, n);
    appendElementIntoLayers(target, baseTargetContainer, targetContainerTemplate, 1, n);
    subjectContainerTemplate.style.display = 'none';
    targetContainerTemplate.style.display = 'none';
  }

  function appendElementIntoLayers(
    element: HTMLElement,
    baseContainer: HTMLElement,
    containerTemplate: HTMLElement,
    dir: number,
    depth: number,
  ): void {
    let currentLayer = baseContainer;
    for (let i = 0; i < depth; i++) {
      const nextLayer = containerTemplate.cloneNode();
      currentLayer.append(nextLayer);
      currentLayer = nextLayer as HTMLElement;
      currentLayer.style.transform = `rotate(${(dir * 360) / n}deg)`;
    }
    currentLayer.append(element);
  }

  export function getPerfControls(): PerfControls {
    return {
      getTargetElement: () => target,
      getSubjectElement: () => subject,
    };
  }
</script>

<div class="centerer">
  <div bind:this={baseSubjectContainer} class="container perf-subject-container base"></div>
  <div bind:this={baseTargetContainer} class="container perf-target-container base"></div>
  <div bind:this={target} class="perf-target"></div>
  <div bind:this={subject} class="perf-subject"></div>
  <div bind:this={subjectContainerTemplate} class="container perf-subject-container"></div>
  <div bind:this={targetContainerTemplate} class="container perf-target-container"></div>
</div>

<style lang="scss">
  .centerer {
    position: relative;
    height: 100%;

    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1em;
  }

  .base {
    position: relative;
    top: -1em;
  }

  .container,
  .perf-subject,
  .perf-target {
    width: 2em;
    height: 2em;

    outline: solid 1px;
  }

  .perf-subject-container {
    transform-origin: bottom left;
    color: yellow;
  }
  .perf-target-container {
    transform-origin: bottom right;
    color: lime;
  }

  .perf-target {
    background: lime;
    outline-color: yellow;
  }

  .perf-subject {
    background: yellow;
  }
</style>
