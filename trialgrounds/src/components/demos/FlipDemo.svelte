<script lang="ts">
  import { measureSubject, getProjection, clearInlineStyles } from 'projectrix';
  import { animate, utils, type JSAnimation } from 'animejs';
  import { onDestroy, onMount, tick } from 'svelte';
  import type { Writable } from 'svelte/store';
  import type { Options } from '$lib/options';
  import type DemoStartSlot from '../DemoStartSlot.svelte';

  // start slot and options are part of demos infrastructure
  interface Props {
    startSlot: DemoStartSlot;
    options: Writable<Options>;
  }

  let { startSlot, options }: Props = $props();
  let log = $derived($options.log);

  let target: HTMLElement = $state();
  let leftParent: HTMLElement = $state();
  let rightParent: HTMLElement = $state();

  let currentAnim: JSAnimation | undefined;
  let currentTimeout: NodeJS.Timeout | undefined;

  onMount(async () => {
    await tick();
    startSlot.show();

    currentTimeout = setTimeout(() => {
      flipTargetToNextParent(target, rightParent);
    }, 1000);
  });

  onDestroy(() => {
    currentAnim?.cancel();
    clearTimeout(currentTimeout);
  });

  function swapSlotForTarget(target: HTMLElement): void {
    startSlot.hide();
    target.style.opacity = '1';
  }

  function flipTargetToNextParent(target: HTMLElement, nextParent: HTMLElement): void {
    let subjectEl = startSlot.isShowing() ? startSlot.getSlotSubject() : target;
    const subject = measureSubject(subjectEl);

    nextParent.append(target);

    requestAnimationFrame(() => {
      if (startSlot.isShowing()) swapSlotForTarget(target);

      const { toSubject, toTargetOrigin } = getProjection(subject, target, { log });

      utils.set(target, toSubject);

      currentAnim = animate(target, {
        ...toTargetOrigin,

        duration: 1000,
        easing: 'outQuad',

        onComplete: () => {
          clearInlineStyles(target);

          animateParent(nextParent).then(() => {
            currentTimeout = setTimeout(() => {
              flipTargetToNextParent(target, getNextParent(nextParent));
            }, 1000);
          });
        },
      });
    });
  }

  function animateParent(parent: HTMLElement): JSAnimation {
    const dir = parent === rightParent ? -1 : 1;

    currentAnim = animate(parent, {
      transform: [
        'skew(' + 15 * dir + 'deg)',
        'skew(' + 15 * dir + 'deg) rotate(' + -20 * dir + 'deg)',
        'skew(' + 15 * dir + 'deg) rotate(' + 20 * dir + 'deg)',
        'skew(' + 15 * dir + 'deg)',
      ],

      duration: 1000,
      ease: 'inOutQuad',
    });

    return currentAnim;
  }

  function getNextParent(currentParent: HTMLElement): HTMLElement {
    return currentParent === rightParent ? leftParent : rightParent;
  }
</script>

<div class="size-container">
  <div class="parents-container">
    <div bind:this={leftParent} class="parent left">
      <div bind:this={target} class="demo-target child"></div>
    </div>

    <div bind:this={rightParent} class="parent right"></div>
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
