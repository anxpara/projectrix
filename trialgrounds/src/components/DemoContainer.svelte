<script lang="ts">
  import type { Demo } from '$lib/demos/demos';
  import type { Options } from '$lib/options';
  import anime from 'animejs';
  import { mat4 } from 'gl-matrix';
  import { getProjection } from 'projectrix';
  import { getContext } from 'svelte';
  import type { Writable } from 'svelte/store';

  export let demo: Demo;
  export let href: string;

  const options = getContext<Writable<Options>>('options');

  let targetSlots: HTMLElement[] = [];

  // maybe Projectrix should expose the transform utils
  function convertMat4ToCssMatrix3dSubstring(mat: mat4): string {
    let str = mat4.str(mat);
    str = str.split('(')[1];
    str = str.split(')')[0];
    return str;
  }

  // get a pixel-perfect match to the slot using top and left,
  // since offset positions and translations sometimes differ by suppixels
  function setTargetToStartingSlot(target: HTMLElement): void {
    const { toSubject } = getProjection(targetSlots[0], target, {
      transformType: 'transformMat4',
    });

    const left = toSubject.transformMat4[12];
    const top = toSubject.transformMat4[13];
    toSubject.transformMat4[12] = 0;
    toSubject.transformMat4[13] = 0;
    toSubject.matrix3d = convertMat4ToCssMatrix3dSubstring(toSubject.transformMat4);
    delete toSubject.transformMat4;

    anime.set(target, {
      ...toSubject,
      top: `${top}px`,
      left: `${left}px`,
    });
  }

  // revert pixel-perfect top and left
  function revertSlotStyleInPlace(target: HTMLElement): void {
    target.style.left = '0px';
    target.style.top = '0px';

    const { toSubject } = getProjection(targetSlots[0], target, {
      transformType: 'matrix3d',
    });

    anime.set(target, {
      ...toSubject,
    });
  }
</script>

<div class="demo-container">
  <div class="corner left" />
  <a {href} class="title-link">
    <div class="title">
      <div class="corner-right-container">
        <div class="corner right" />
      </div>
      <div bind:this={targetSlots[0]} class="corner right target-slot slot-1" />
      <h1>/demos/{demo.name}</h1>
    </div>
  </a>

  <div class="summary">
    <p>{demo.summary}</p>
  </div>

  <svelte:component
    this={demo.demoType}
    bind:this={demo.demoComponent}
    {setTargetToStartingSlot}
    {revertSlotStyleInPlace}
    {options}
  />
</div>

<style lang="scss">
  .demo-container {
    position: relative;
    display: block;
    margin-bottom: 1.5em;

    width: 700px;
    height: 400px;

    border: solid 1px coral;
  }

  .title-link {
    position: absolute;
    top: 0;
    left: 0;

    height: 3.5em;
    padding-inline: 0em;

    color: #111521;
    text-underline-offset: 0.3em;
    text-decoration-thickness: 3px;

    .title {
      position: relative;

      top: 0;
      left: 0em;

      padding-left: 3em;
      padding-top: 0.4em;
      padding-right: 1em;
      padding-bottom: 0.7em;

      z-index: 2;

      background: coral;

      h1 {
        font-family: 'Rubik', sans-serif;
        font-size: 2.1em;
        font-weight: 600;
        font-style: italic;

        margin-block: 0;
      }
    }
  }

  .corner-right-container {
    position: absolute;
    top: 0;
    right: -2.5em;
    z-index: -1;

    width: 7em;
    height: calc(100%);

    overflow: hidden;
  }

  .corner {
    position: absolute;

    width: 3em;
    height: 3.55em;

    transform: skew(-34deg);
  }
  .left {
    top: -1px;
    left: -1.9em;

    z-index: 3;

    color: #111521;
    background-color: #111521;

    cursor: default;
  }
  .right {
    height: calc(100% + 4px);
    left: unset;
    right: 1.2em;
    bottom: -1px;

    color: coral;
    background-color: coral;
  }
  .target-slot {
    color: transparent;
    background-color: transparent;
    width: calc(2em - 6px);

    cursor: default;
  }
  .slot-1 {
    right: calc(-3.6em + 4px);
  }

  .summary {
    position: absolute;
    bottom: 0;

    width: 100%;

    display: grid;
    justify-content: center;

    p {
      font-size: 1.8em;
      padding-inline: 1em;
    }
  }
</style>
