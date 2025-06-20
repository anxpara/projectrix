<script lang="ts">
  import { getProjection, setInlineStyles } from 'projectrix';
  import type { DemoProps } from '$lib/demos/demos.svelte';

  // startSlot and options are part of demos infrastructure
  let { startSlot, options }: DemoProps = $props();
  const log = $derived(options.value.log);

  let target = $state() as HTMLElement;

  function swapSlotForTarget(target: HTMLElement): void {
    startSlot.hide();
    target.style.opacity = '1';
  }

  function match(target: HTMLElement, subject: HTMLElement): void {
    setInlineStyles(target, getProjection(subject, target, { log }).toSubject);
  }

  function subjectClickHandler(e: MouseEvent): void {
    if (startSlot.isShowing()) swapSlotForTarget(target);
    const subject = e.target as HTMLElement;
    match(target, subject);
  }
</script>

<div class="size-container">
  <div class="subject-flex">
    <button class="demo-subject" onclick={subjectClickHandler} aria-label="basic subject"></button>
    <button class="demo-subject rotated" onclick={subjectClickHandler} aria-label="rotated subject"
    ></button>
    <button class="demo-subject parent" onclick={subjectClickHandler} aria-label="parent subject">
      <div class="demo-subject child" aria-label="child subject"></div>
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
    border-style: solid;
    transform: rotate(45deg);
  }

  .parent {
    width: 21cqw;
    height: 21cqw;
    border-style: dashed;
    border-color: darkmagenta;

    transform: skew(-15deg);

    .child {
      position: absolute;
      left: 0px;
      top: 0px;

      width: 10.75cqw;
      height: 10.75cqw;
      border-style: dotted;
    }
  }
</style>
