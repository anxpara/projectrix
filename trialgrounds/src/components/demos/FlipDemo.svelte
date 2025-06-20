<script lang="ts">
  import { onDestroy, onMount } from 'svelte';
  import { animate, utils, type JSAnimation } from 'animejs';
  import { clearInlineStyles, getProjection, measureSubject } from 'projectrix';
  import { type DemoProps } from '$lib/demos/demos.svelte';

  // startSlot and options are part of demos infrastructure
  let { startSlot, options }: DemoProps = $props();
  const log = $derived(options.value.log);

  let target = $state() as HTMLElement;
  let leftParent = $state() as HTMLElement;
  let rightParent = $state() as HTMLElement;

  let currentAnim: JSAnimation | undefined;
  let currentTimeout: NodeJS.Timeout | undefined;

  onMount(() => {
    currentTimeout = setTimeout(() => {
      swapSlotForTarget(target);
      flipTargetToNextParent(target, rightParent);
    }, 1000);
  });

  onDestroy(() => {
    currentAnim?.cancel();
    clearTimeout(currentTimeout);
  });

  function swapSlotForTarget(target: HTMLElement): void {
    const toSlot = getProjection(startSlot.getSlotSubject(), target).toSubject;
    utils.set(target, {
      ...toSlot,
      opacity: 1,
    });
    startSlot.hide();
  }

  function flipTargetToNextParent(target: HTMLElement, nextParent: HTMLElement): void {
    const subject = measureSubject(target); // include any slot projection styles in the measurement...

    nextParent.append(target);
    clearInlineStyles(target); // set to proper origin under nextParent by removing slot projection styles

    requestAnimationFrame(() => {
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
    margin-top: 1.5em;
    width: 100%;
    aspect-ratio: 4 / 1;

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
    border: dashed 3px darkmagenta;
    width: 21cqw;
    height: 21cqw;

    will-change: transform;

    .demo-target {
      position: absolute;
      left: 0px;
      top: 0px;
      border: solid 3px limegreen;
      width: 10.75cqw;
      height: 10.75cqw;

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
