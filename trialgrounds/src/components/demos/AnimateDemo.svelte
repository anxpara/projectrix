<script lang="ts">
  import { setInlineStyles, getProjection, type PartialProjectionResults } from 'projectrix';
  import { animate } from 'animejs';
  import { onMount, tick } from 'svelte';
  import type { Writable } from 'svelte/store';
  import type DemoStartSlot from '../DemoStartSlot.svelte';
  import type { Options } from '$lib/options';

  // start slot and options are part of demos infrastructure
  export let startSlot: DemoStartSlot;
  export let options: Writable<Options>;
  $: log = $options.log;

  let target: HTMLElement;

  onMount(async () => {
    await tick();
    startSlot.show();
  });

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
    <button class="demo-subject" on:click={subjectClickHandler} />
    <button class="demo-subject rotated" on:click={subjectClickHandler} />
    <button class="demo-subject parent" on:click={subjectClickHandler}>
      <button class="demo-subject child" />
    </button>
  </div>
</div>

<div bind:this={target} class="demo-target" />

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
    width: 100%;
    aspect-ratio: 4 / 1;
    margin-top: 1.5em;

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
    width: 14.25cqw;
    height: 14.25cqw;
    border: dashed 3px yellow;

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
      top: 0px;
      left: 0px;

      width: 10.75cqw;
      height: 10.75cqw;
    }
  }
</style>
