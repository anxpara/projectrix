<script lang="ts">
  import { animate } from 'animejs';
  import { getProjection, setInlineStyles, type PartialProjectionResults } from 'projectrix';
  import type { DemoProps } from '$lib/demos/demos.svelte';

  // startSlot and options are part of demos infrastructure
  let { startSlot, options }: DemoProps = $props();
  const log = $derived(options.value.log);

  let target = $state() as HTMLElement;

  function swapSlotForTarget(target: HTMLElement): void {
    const { toSubject } = getProjection(startSlot.getSlotSubject(), target);
    setInlineStyles(target, toSubject);

    startSlot.hide();
    target.style.opacity = '1';
  }

  function animateTargetToSubject(target: HTMLElement, subject: HTMLElement): void {
    const { toSubject } = getProjection(subject, target, { log }) as PartialProjectionResults;
    delete toSubject.borderStyle;

    animate(target, {
      ...toSubject,

      duration: 400,
      ease: 'outQuad',
    });
  }

  function subjectClickHandler(e: MouseEvent): void {
    if (startSlot.isShowing()) swapSlotForTarget(target);
    const subject = e.target as HTMLElement;
    animateTargetToSubject(target, subject);
  }
</script>

<div class="size-container">
  <div class="subject-flex">
    <button class="demo-subject" onclick={subjectClickHandler} aria-label="demo basic subject"
    ></button>
    <button
      class="demo-subject rotated"
      onclick={subjectClickHandler}
      aria-label="demo rotated subject"
    ></button>
    <button
      class="demo-subject parent"
      onclick={subjectClickHandler}
      aria-label="demo parent subject"
    >
      <div class="demo-subject child" aria-label="demo child subject"></div>
    </button>
  </div>
</div>

<div bind:this={target} class="demo-target"></div>

<style lang="scss">
  button {
    all: unset;
    -webkit-tap-highlight-color: transparent;
  }

  .demo-subject:focus-visible,
  .parent:focus-visible {
    outline: solid 2px white;
    outline-offset: 4px;
  }

  .demo-target {
    position: absolute; // any positioning works with Projectrix
    border: solid 3px limegreen;

    opacity: 0;
    pointer-events: none;
  }

  .size-container {
    position: relative;
    margin-top: 1.5em;
    width: 100%;
    aspect-ratio: 4 / 1;

    container-type: size;
  }

  .subject-flex {
    width: 100%;
    height: 100%;

    display: flex;
    justify-content: center;
    align-items: center;

    gap: 10cqw;
  }

  .demo-subject {
    border: dashed 3px yellow;
    width: 14.25cqw;
    height: 14.25cqw;

    cursor: pointer;
  }

  .rotated {
    transform: rotate(45deg);
  }

  .parent {
    width: 21cqw;
    height: 21cqw;
    border-color: darkmagenta;

    transform: skew(-15deg);

    .child {
      position: absolute;
      left: 0px;
      top: 0px;

      width: 10.75cqw;
      height: 10.75cqw;
    }
  }
</style>
