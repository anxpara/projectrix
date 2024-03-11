<script lang="ts">
  import type { Options } from '$lib/options';
  import { animate, type AnimationControls } from 'motion';
  import { getProjection } from 'projectrix';
  import { onMount, tick } from 'svelte';
  import type { Writable } from 'svelte/store';

  // starting slot is part of demos infrastructure, not specific to this demo
  export let setTargetToStartingSlot: (target: HTMLElement) => void;
  export let revertSlotStyleInPlace: (target: HTMLElement) => void;
  export let options: Writable<Options>;

  let target: HTMLElement;
  let inSlot = false;

  let currentAnim: AnimationControls | undefined;

  onMount(async () => {
    await tick();

    setTimeout(() => {
      setTargetToStartingSlot(target);
      target.style.opacity = '1';
      inSlot = true;
    }, 50);
  });

  function animateDirect(subject: HTMLElement, target: HTMLElement): void {
    if (inSlot) {
      revertSlotStyleInPlace(target);
      inSlot = false;
    }

    // stop current animation; motion one will update target's inline styles to mid-animation values
    if (currentAnim?.currentTime && currentAnim.currentTime < 1) {
      currentAnim.stop();
    }

    const projectionResults = getProjection(subject, target);
    const { toSubject } = projectionResults;

    if ($options.log) {
      console.log(projectionResults);
    }

    currentAnim = animate(
      target,
      { ...toSubject, borderStyle: 'solid' },
      {
        duration: 0.4,
        easing: 'ease-out',
      },
    );
  }

  function subjectClickHandler(subject: HTMLElement): void {
    animateDirect(subject, target);
  }
</script>

<button class="demo-subject" on:click={(e) => subjectClickHandler(e.currentTarget)} />
<button class="demo-subject rotated" on:click={(e) => subjectClickHandler(e.currentTarget)} />
<button class="parent" on:click={(e) => subjectClickHandler(e.currentTarget)}>
  <button
    class="demo-subject child"
    on:click|stopPropagation={(e) => subjectClickHandler(e.currentTarget)}
  />
</button>

<div bind:this={target} class="demo-target" />

<style lang="scss">
  // not bothering to make responsive for now, not a priority
  button {
    all: unset;
  }

  .demo-subject:focus-visible,
  .parent:focus-visible {
    outline: solid 2px white;
    outline-offset: 4px;
  }

  .demo-target {
    position: absolute; // any positioning works with Projectrix

    width: 35px;
    height: 35px;
    border: solid 3px limegreen;

    pointer-events: none;

    opacity: 0;
  }

  .demo-subject {
    position: absolute;
    top: 150px;
    left: 100px;

    width: 100px;
    height: 100px;
    border: dashed 3px yellow;

    cursor: pointer;
  }

  .rotated {
    left: 270px;
    transform: rotate(45deg);
  }

  .parent {
    position: absolute;
    top: 125px;
    left: 440px;

    width: 150px;
    height: 150px;
    border: dashed 3px darkmagenta;

    cursor: pointer;

    transform: skew(-15deg);

    .child {
      width: 75px;
      height: 75px;
      top: 0px;
      left: 0px;
    }
  }
</style>
