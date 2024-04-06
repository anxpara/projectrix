<script lang="ts">
  import { onDestroy, onMount, tick } from 'svelte';
  import { getProjection, clearInlineStyles, setInlineStyles, measureSubject } from 'projectrix';
  import { animate, type AnimationControls } from 'motion';
  import type { Writable } from 'svelte/store';
  import type { Options } from '$lib/options';
  import type DemoStartSlot from '../DemoStartSlot.svelte';

  // start slot and options are part of demos infrastructure
  export let startSlot: DemoStartSlot;
  export let options: Writable<Options>;
  $: log = $options.log;

  let target: HTMLElement;
  let leftParent: HTMLElement;
  let rightParent: HTMLElement;

  let currentParent: HTMLElement | undefined;
  let currentAnim: AnimationControls | undefined;
  let currentTimeout: NodeJS.Timeout | undefined;

  onMount(async () => {
    await tick();
    startSlot.show();
    currentParent = leftParent;

    currentTimeout = setTimeout(() => {
      flipToNextParent();
    }, 1000);
  });

  onDestroy(() => {
    clearTimeout(currentTimeout);
    currentTimeout = undefined;

    currentAnim?.pause();
    currentAnim = undefined;
  });

  function flipToNextParent(): void {
    let subjectEl = startSlot.isShowing() ? startSlot.getSlotSubject() : target;
    const subject = measureSubject(subjectEl);

    const nextParent = currentParent === rightParent ? leftParent : rightParent;
    nextParent.append(target);
    currentParent = nextParent;

    requestAnimationFrame(() => {
      const { toSubject, toTargetOrigin } = getProjection(subject, target, { log });

      setInlineStyles(target, toSubject);
      target.style.opacity = '1';
      startSlot.hide();

      currentAnim = animate(
        target,
        {
          ...toTargetOrigin,
        },
        {
          duration: 1,
          easing: 'ease-out',
        },
      );

      currentAnim.finished.then(() => {
        clearInlineStyles(target);

        playParentAnimation(nextParent).finished.then(() => {
          currentTimeout = setTimeout(() => {
            flipToNextParent();
          }, 1000);
        });
      });
    });
  }

  function playParentAnimation(parent: HTMLElement): AnimationControls {
    const dir = parent === rightParent ? -1 : 1;

    currentAnim = animate(
      parent,
      {
        transform: [
          'skew(' + 15 * dir + 'deg)',
          'skew(' + 15 * dir + 'deg) rotate(' + -20 * dir + 'deg)',
          'skew(' + 15 * dir + 'deg) rotate(' + 20 * dir + 'deg)',
          'skew(' + 15 * dir + 'deg)',
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
      <div bind:this={target} class="demo-target child" />
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

      // last i checked, safari webkit can't handle non-integer borders
      // on transformed elements, so i always recommend pixels for borders
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
