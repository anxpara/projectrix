<script lang="ts">
  import { onMount } from 'svelte';

  interface Props {
    target: HTMLElement;
    subject: HTMLElement;
    n: number;
  }
  let { target = $bindable(), subject = $bindable(), n }: Props = $props();

  let subjectContainerTemplate = $state() as HTMLElement;
  let targetContainerTemplate = $state() as HTMLElement;
  let baseSubjectContainer = $state() as HTMLElement;
  let baseTargetContainer = $state() as HTMLElement;

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
    color: yellow;
    transform-origin: bottom left;
  }
  .perf-target-container {
    color: lime;
    transform-origin: bottom right;
  }

  .perf-target {
    background: lime;
    outline-color: yellow;
  }

  .perf-subject {
    background: yellow;
  }
</style>
