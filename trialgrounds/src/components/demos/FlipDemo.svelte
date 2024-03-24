<script lang="ts">
  import { onDestroy, onMount, tick } from 'svelte';
  import { getProjection } from 'projectrix';
  import { animate, type AnimationControls } from 'motion';
  import type { Writable } from 'svelte/store';
  import type { Options } from '$lib/options';
  import type DemoStartSlot from '../DemoStartSlot.svelte';

  // starting slot is part of demos infrastructure
  export let startSlot: DemoStartSlot;
  export let options: Writable<Options>;

  let leftParent: HTMLElement;
  let rightParent: HTMLElement;
  let leftChildTarget: HTMLElement;
  let rightChildTarget: HTMLElement;

  let currentTarget: HTMLElement | undefined;
  let currentAnim: AnimationControls | undefined;
  let currentTimeout: NodeJS.Timeout | undefined;

  onMount(async () => {
    await tick();
    startSlot.show();

    currentTimeout = setTimeout(() => {
      startSlot.hide();
      currentTarget = startSlot.getSlotSubject();
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
    flipToTarget(leftChildTarget, leftParent, 1, flipToRightTarget);
  }

  function flipToRightTarget(): void {
    flipToTarget(rightChildTarget, rightParent, -1, flipToLeftTarget);
  }

  function flipToTarget(
    nextTarget: HTMLElement,
    nextParent: HTMLElement,
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

    currentAnim.finished.then(() => {
      clearInlineStyles(nextTarget);

      playParentAnimation(nextParent, dir).finished.then(() => {
        currentTimeout = setTimeout(() => {
          nextFlip();
        }, 1000);
      });
    });
  }

  function clearInlineStyles(target: HTMLElement): void {
    target.style.width = '';
    target.style.height = '';
    target.style.transform = '';
    target.style.borderWidth = '';
    target.style.borderStyle = '';
    target.style.borderRadius = '';
    target.style.transformOrigin = '';
  }

  function playParentAnimation(parent: HTMLElement, dir: number): AnimationControls {
    currentAnim = animate(
      parent,
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

    return currentAnim;
  }
</script>

<div class="size-container">
  <div class="parents-container">
    <div bind:this={leftParent} class="parent left">
      <div bind:this={leftChildTarget} class="demo-target child" />
    </div>

    <div bind:this={rightParent} class="parent right">
      <div bind:this={rightChildTarget} class="demo-target child" />
    </div>
  </div>
</div>

<style lang="scss">
  .size-container {
    position: relative;
    width: 100%;
    aspect-ratio: 4 / 1;
    margin-top: 1.5em;

    container-type: size;
  }

  .parents-container {
    width: 100%;
    height: 100%;

    display: flex;
    justify-content: center;
    align-items: center;

    gap: 25cqw;
  }

  .parent {
    width: 21cqw;
    height: 21cqw;
    border: dashed 3px darkmagenta;

    will-change: transform;

    .demo-target {
      position: absolute;
      top: 0px;
      left: 0px;

      width: 10.75cqw;
      height: 10.75cqw;

      // last i checked, safari webkit can't handle non-integer borders on transformed elements,
      // so i always recommend pixels for borders
      border: solid 3px limegreen;

      opacity: 0;
    }
  }
  .left {
    transform: skew(15deg);
  }
  .right {
    transform: skew(-15deg);
  }
</style>
