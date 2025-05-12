<script lang="ts">
  import { setInlineStyles, getProjection, clearInlineStyles } from 'projectrix';
  import { waapi, type WAAPIAnimation } from 'animejs';
  import { onMount, onDestroy, tick } from 'svelte';
  import type { Writable } from 'svelte/store';
  import type { Options } from '$lib/options';

  // options are part of demos infrastructure
  interface Props {
    options: Writable<Options>;
  }

  let { options }: Props = $props();
  let log = $derived($options.log);

  let leftOuter: HTMLElement = $state();
  let leftInner: HTMLElement = $state();
  let leftTarget: HTMLElement = $state();
  let rightOuter: HTMLElement = $state();
  let rightInner: HTMLElement = $state();
  let rightTarget: HTMLElement = $state();

  type Side = 'left' | 'right';
  const InitialSide = 'left';
  function isLeft(side: Side): boolean {
    return side === 'left';
  }
  function otherSide(side: Side): Side {
    return isLeft(side) ? 'right' : 'left';
  }

  let currentAnim: WAAPIAnimation | undefined = undefined;

  const ToNeutralDurationMs = 2000;
  const ToFlipAnglesDurationMs = 2000;
  const FlipDurationMs = 750;

  onMount(async () => {
    await tick();
    toNeutralForSide(InitialSide);
  });

  onDestroy(() => {
    currentAnim?.cancel();
  });

  function toNeutralForSide(side: Side): void {
    raiseInnerForSide(side, ToNeutralDurationMs);

    // using waapi so initial transforms from stylesheet are respected
    currentAnim = waapi.animate([leftOuter, rightOuter], {
      transform: 'rotateY(0deg)',

      duration: ToNeutralDurationMs,
      ease: 'linear',

      onComplete: () => toFlipAnglesForSide(side),
    });
  }

  function toFlipAnglesForSide(side: Side): void {
    lowerInnerForSide(side, ToFlipAnglesDurationMs);

    // switch which side the outer divs pivot on
    leftOuter.style.transformOrigin = otherSide(side);
    rightOuter.style.transformOrigin = side;

    waapi.animate(leftOuter, {
      transform: isLeft(side) ? 'rotateY(-66deg)' : 'rotateY(66deg)',

      duration: ToFlipAnglesDurationMs,
      ease: 'linear',
    });
    currentAnim = waapi.animate(rightOuter, {
      transform: isLeft(side) ? 'rotateY(66deg)' : 'rotateY(-66deg)',

      duration: ToFlipAnglesDurationMs,
      ease: 'linear',

      onComplete: () => flipFromSide(side),
    });
  }

  function flipFromSide(side: Side): void {
    const currentTarget = isLeft(side) ? leftTarget : rightTarget;
    const nextTarget = isLeft(side) ? rightTarget : leftTarget;

    currentAnim = fauxFlip(currentTarget, nextTarget);
    currentAnim.then(() => {
      toNeutralForSide(otherSide(side));
    });
  }

  function fauxFlip(currentTarget: HTMLElement, nextTarget: HTMLElement): WAAPIAnimation {
    const { toSubject, toTargetOrigin } = getProjection(currentTarget, nextTarget, { log });

    setInlineStyles(nextTarget, toSubject);
    currentTarget.style.opacity = '0';
    nextTarget.style.opacity = '1';

    return waapi.animate(nextTarget, {
      ...toTargetOrigin,

      duration: FlipDurationMs,
      ease: 'inOutQuad',

      onComplete: () => {
        clearInlineStyles(nextTarget);
      },
    });
  }

  function raiseInnerForSide(side: Side, durationMs: number): void {
    const inner = isLeft(side) ? leftInner : rightInner;
    const target = isLeft(side) ? leftTarget : rightTarget;

    const animParams = {
      delay: durationMs * 0.25,
      duration: durationMs * 0.5,
      ease: 'linear',
    };
    waapi.animate(inner, {
      transform: 'rotateX(47deg)',
      ...animParams,
    });
    waapi.animate(target, {
      transform: 'translateY(1em) rotateX(314deg) rotateY(360deg) translateY(-4em)',
      ...animParams,
    });
  }

  function lowerInnerForSide(side: Side, durationMs: number): void {
    const inner = isLeft(side) ? leftInner : rightInner;
    const target = isLeft(side) ? leftTarget : rightTarget;

    const animParams = {
      delay: durationMs * 0.25,
      duration: durationMs * 0.75,
      ease: 'linear',
    };
    waapi.animate(inner, {
      transform: 'rotateX(80deg)',
      ...animParams,
    });
    waapi.animate(target, {
      transform: 'translateY(-4em) rotateX(280deg) rotateY(360deg) translateY(-4em)',
      ...animParams,
    });
  }
</script>

<div class="two-sided-flex">
  <div bind:this={leftOuter} class="perspective-container left outer">
    <div bind:this={leftInner} class="perspective-container left inner">
      <div bind:this={leftTarget} class="target left">
        <span>css is awesome</span>
      </div>
    </div>
  </div>
  <div bind:this={rightOuter} class="perspective-container right outer">
    <div bind:this={rightInner} class="perspective-container right inner">
      <div bind:this={rightTarget} class="target right">
        <span>css is awesome</span>
      </div>
    </div>
  </div>
</div>

<style lang="scss">
  .two-sided-flex {
    position: relative;
    margin-top: 1.5em;

    width: 100%;
    aspect-ratio: 3.6 / 1;
    container-type: inline-size;

    display: flex;
    justify-content: space-around;
    align-items: center;
  }

  .perspective-container {
    font-size: 1.6cqw;

    border: solid 3px purple;
    width: 15em;
    height: 15em;

    color: purple;
  }

  .outer {
    position: relative;
    padding: 1em;

    display: flex;
    justify-content: center;
    align-items: center;

    perspective: 200px;
    transform-style: preserve-3d;
  }
  .left.outer {
    transform-origin: left;
    transform: rotateY(66deg);
  }
  .right.outer {
    transform-origin: right;
    transform: rotateY(-66deg);
  }

  .inner {
    width: 14em;
    height: 14em;

    display: flex;
    justify-content: center;
    align-items: center;

    transform-origin: bottom;
    transform: rotateX(80deg);
    transform-style: preserve-3d;
  }

  .target {
    border: solid 3px limegreen;
    padding: 0.4em;
    width: 9.4em;
    height: 12em;

    transform: translateY(-4em) rotateX(280deg) rotateY(360deg) translateY(-4em);

    font-weight: 300;
    color: limegreen;
    background-color: #12415a55;

    span {
      font-size: 3.6em;
    }
  }
  .right.target {
    opacity: 0;
  }
</style>
