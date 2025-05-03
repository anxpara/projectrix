<script lang="ts">
  import { getProjection, clearInlineStyles } from 'projectrix';
  import { animate, utils, type JSAnimation } from 'animejs';
  import { onDestroy, onMount, tick } from 'svelte';
  import type { Writable } from 'svelte/store';
  import type DemoStartSlot from '../DemoStartSlot.svelte';
  import type { Options } from '$lib/options';

  // start slot and options are part of demos infrastructure
  export let startSlot: DemoStartSlot;
  export let options: Writable<Options>;
  $: log = $options.log;

  let leftParent: HTMLElement;
  let leftChildTarget: HTMLElement;
  let rightParent: HTMLElement;
  let rightChildTarget: HTMLElement;

  let currentAnim: JSAnimation | undefined;
  let currentTimeout: NodeJS.Timeout | undefined;

  onMount(async () => {
    await tick();
    startSlot.show();

    currentTimeout = setTimeout(() => {
      const currentTarget: HTMLElement = startSlot.getSlotSubject();
      flipToNextTarget(currentTarget, rightChildTarget);
      startSlot.hide();
    }, 1000);
  });

  onDestroy(() => {
    currentAnim?.cancel();
    clearTimeout(currentTimeout);
  });

  function flipToNextTarget(currentTarget: HTMLElement, nextTarget: HTMLElement): void {
    currentAnim = fauxFlip(currentTarget, nextTarget);
    currentAnim.then(() => {
      currentAnim = animateParent(getNextParent(nextTarget));
      currentAnim.then(() => {
        currentTimeout = setTimeout(() => {
          currentTarget = nextTarget;
          flipToNextTarget(currentTarget, getNextTarget(currentTarget));
        }, 1000);
      });
    });
  }

  function fauxFlip(currentTarget: HTMLElement, nextTarget: HTMLElement): JSAnimation {
    const { toSubject, toTargetOrigin } = getProjection(currentTarget, nextTarget, { log });

    utils.set(nextTarget, toSubject);
    currentTarget.style.opacity = '0';
    nextTarget.style.opacity = '1';

    return animate(nextTarget, {
      ...toTargetOrigin,

      duration: 1000,
      ease: 'outQuad',

      onComplete: () => clearInlineStyles(nextTarget),
    });
  }

  function animateParent(parent: HTMLElement): JSAnimation {
    const dir = parent === rightParent ? -1 : 1;

    return animate(parent, {
      transform: [
        'skew(' + 15 * dir + 'deg)',
        'skew(' + 15 * dir + 'deg) rotate(' + -20 * dir + 'deg)',
        'skew(' + 15 * dir + 'deg) rotate(' + 20 * dir + 'deg)',
        'skew(' + 15 * dir + 'deg)',
      ],

      duration: 1000,
      ease: 'inOutQuad',
    });
  }

  function getNextParent(nextTarget: HTMLElement): HTMLElement {
    return nextTarget === rightChildTarget ? rightParent : leftParent;
  }

  function getNextTarget(currentTarget: HTMLElement): HTMLElement {
    return currentTarget === rightChildTarget ? leftChildTarget : rightChildTarget;
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
