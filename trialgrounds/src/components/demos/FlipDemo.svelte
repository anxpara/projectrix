<script lang="ts">
  import { onDestroy, onMount, tick } from 'svelte';
  import { getProjection } from 'projectrix';
  import { animate, type AnimationControls } from 'motion';
  import type { Writable } from 'svelte/store';
  import type { Options } from '$lib/options';

  // starting slot is part of demos infrastructure, not specific to this demo
  export let setTargetToStartingSlot: (target: HTMLElement) => void;
  export let revertSlotStyleInPlace: (target: HTMLElement) => void;
  export let options: Writable<Options>;

  let startingTarget: HTMLElement;
  let leftChildTarget: HTMLElement;
  let rightChildTarget: HTMLElement;
  let leftParent: HTMLElement;
  let rightParent: HTMLElement;

  let currentTarget: HTMLElement | undefined;
  let currentAnim: AnimationControls | undefined;
  let currentTimeout: NodeJS.Timeout | undefined;

  onMount(async () => {
    await tick();

    setTimeout(() => {
      setTargetToStartingSlot(startingTarget);
      startingTarget.style.opacity = '1';
      currentTarget = startingTarget;
    }, 50);

    currentTimeout = setTimeout(() => {
      revertSlotStyleInPlace(startingTarget);
      flipToRightTarget();
    }, 1000);
  });

  onDestroy(() => {
    currentTarget = undefined;

    currentAnim?.stop();
    currentAnim = undefined;

    clearTimeout(currentTimeout);
    currentTimeout = undefined;
  });

  function flipToLeftTarget(): void {
    flipToTarget(leftParent, leftChildTarget, 1, flipToRightTarget);
  }
  function flipToRightTarget(): void {
    flipToTarget(rightParent, rightChildTarget, -1, flipToLeftTarget);
  }

  function flipToTarget(
    nextParent: HTMLElement,
    nextTarget: HTMLElement,
    dir: number,
    nextFlip: () => void,
  ): void {
    if (!currentTarget) return;

    const projectionResults = getProjection(currentTarget, nextTarget);
    const { toSubject, toTargetOrigin } = projectionResults;
    if ($options.log) {
      console.log(projectionResults);
    }

    // set next target to current target's projection
    animate(nextTarget, { ...toSubject, opacity: '1' }, { duration: 0 });
    currentTarget.style.opacity = '0';
    currentTarget = nextTarget;

    // FLIP next target back to its origin
    currentAnim = animate(
      nextTarget,
      {
        ...toTargetOrigin,
      },
      {
        duration: 1,
        easing: 'ease-out',
      },
    );

    // play parent animation
    currentAnim.finished.then(() => {
      currentAnim = animate(
        nextParent,
        {
          transform: [
            `skew(${15 * dir}deg)`,
            `skew(${15 * dir}deg) rotate(${-20 * dir}deg)`,
            `skew(${15 * dir}deg) rotate(${20 * dir}deg)`,
            `skew(${15 * dir}deg)`,
          ],
        },
        {
          duration: 1,
          easing: 'ease-in-out',
        },
      );

      // schedule next flip
      currentAnim.finished.then(() => {
        currentTimeout = setTimeout(() => {
          nextFlip();
        }, 1000);
      });
    });
  }
</script>

<div bind:this={leftParent} class="parent left">
  <div bind:this={leftChildTarget} class="demo-target child-target" />
</div>

<div bind:this={rightParent} class="parent right">
  <div bind:this={rightChildTarget} class="demo-target child-target" />
</div>

<div bind:this={startingTarget} class="demo-target" />

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
    position: absolute;
    width: 70px;
    height: 70px;
    border: solid 3px limegreen;

    opacity: 0;
  }
  .child-target {
    position: default;
  }

  .demo-subject {
    position: absolute;
    top: 150px;
    left: 100px;

    width: 100px;
    height: 100px;
    border: dashed 3px yellow;
  }

  .rotated {
    left: 270px;
    transform: rotate(45deg);
  }

  .parent {
    position: absolute;
    top: 125px;

    width: 150px;
    height: 150px;
    border: dashed 3px darkmagenta;

    .child {
      width: 75px;
      height: 75px;

      top: 0px;
      left: 0px;
    }
  }

  .left {
    left: 100px;
    transform: skew(15deg);
  }

  .right {
    left: 440px;
    transform: skew(-15deg);
  }
</style>
