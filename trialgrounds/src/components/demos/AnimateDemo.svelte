<script lang="ts">
  import { setInlineStyles, getProjection, type PartialProjectionResults } from 'projectrix';
  import { animate } from 'animejs';
  import { onMount, tick } from 'svelte';
  import type { Writable } from 'svelte/store';
  import type DemoStartSlot from '../DemoStartSlot.svelte';
  import type { Options } from '$lib/options';

  
  interface Props {
    // start slot and options are part of demos infrastructure
    startSlot: DemoStartSlot;
    options: Writable<Options>;
  }

  let { startSlot, options }: Props = $props();
  let log = $derived($options.log);

  let target: HTMLElement = $state();

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
    <button class="demo-subject" onclick={subjectClickHandler}></button>
    <button class="demo-subject rotated" onclick={subjectClickHandler}></button>
    <button class="demo-subject parent" onclick={subjectClickHandler}>
      <button class="demo-subject child"></button>
    </button>
  </div>
</div>

<div bind:this={target} class="demo-target"></div>

<style lang="scss">/*$$__STYLE_CONTENT__$$*/</style>
