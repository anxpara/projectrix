<script lang="ts">
  import { onMount, onDestroy, tick } from 'svelte';
  import type { Writable } from 'svelte/store';
  import type { Options } from '$lib/options';
  import { getProjection, setInlineStyles, clearInlineStyles } from 'projectrix';
  import { animate, type AnimationControls, type AnimationOptionsWithOverrides } from 'motion';

  // options are part of demos infrastructure
  export let options: Writable<Options>;
  $: log = $options.log;

  let leftOuter: HTMLElement;
  let rightOuter: HTMLElement;

  let leftInner: HTMLElement;
  let rightInner: HTMLElement;

  let leftTarget: HTMLElement;
  let rightTarget: HTMLElement;

  type Side = 'left' | 'right';
  let currentSide: Side = 'left';
  function isLeft(side: Side): boolean {
    return side === 'left';
  }
  function otherSide(side: Side): Side {
    return isLeft(side) ? 'right' : 'left';
  }

  let currentAnim: AnimationControls | undefined = undefined;

  const ToNeutralDurationS = 2;
  const ToFlipAnglesDurationS = 2;
  const FlipDurationS = 0.75;

  onMount(async () => {
    await tick();
    toNeutral();
  });

  onDestroy(() => {
    currentAnim?.pause();
    currentAnim = undefined;
  });

  function toNeutral(): void {
    currentAnim = animate(
      [leftOuter, rightOuter],
      { transform: 'rotateY(0deg)' },
      { duration: ToNeutralDurationS, easing: 'linear' },
    );

    raiseCurrentSideInner(ToNeutralDurationS);

    currentAnim.finished.then(() => {
      toFlipAnglesForCurrentSide();
    });
  }

  function toFlipAnglesForCurrentSide(): void {
    // switch outers' pivot sides
    leftOuter.style.transformOrigin = otherSide(currentSide);
    rightOuter.style.transformOrigin = currentSide;

    currentAnim = animate(
      leftOuter,
      { transform: isLeft(currentSide) ? 'rotateY(-66deg)' : 'rotateY(66deg)' },
      { duration: ToFlipAnglesDurationS, easing: 'linear' },
    );
    animate(
      rightOuter,
      { transform: isLeft(currentSide) ? 'rotateY(66deg)' : 'rotateY(-66deg)' },
      { duration: ToFlipAnglesDurationS, easing: 'linear' },
    );

    lowerCurrentSideInner(ToFlipAnglesDurationS);

    currentAnim.finished.then(() => {
      flipFromCurrentSide();
    });
  }

  function flipFromCurrentSide(): void {
    const subject = isLeft(currentSide) ? leftTarget : rightTarget;
    const target = isLeft(currentSide) ? rightTarget : leftTarget;
    const { toSubject, toTargetOrigin } = getProjection(subject, target, {
      log,
    });

    setInlineStyles(target, toSubject);
    subject.style.opacity = '0';
    target.style.opacity = '1';

    currentAnim = animate(
      target,
      { ...toTargetOrigin },
      { duration: FlipDurationS, easing: 'ease-in-out' },
    );

    currentAnim.finished.then(() => {
      clearInlineStyles(target);
      currentSide = otherSide(currentSide);
      toNeutral();
    });
  }

  function raiseCurrentSideInner(durationS: number): void {
    const inner = isLeft(currentSide) ? leftInner : rightInner;
    const target = isLeft(currentSide) ? leftTarget : rightTarget;

    const animOptions: AnimationOptionsWithOverrides = {
      delay: durationS * 0.25,
      duration: durationS * 0.5,
      easing: 'linear',
    };
    animate(inner, { transform: 'rotateX(47deg)' }, animOptions);
    animate(
      target,
      { transform: 'translateY(1em) rotateX(314deg) rotateY(360deg) translateY(-4em)' },
      animOptions,
    );
  }

  function lowerCurrentSideInner(durationS: number): void {
    const inner = isLeft(currentSide) ? leftInner : rightInner;
    const target = isLeft(currentSide) ? leftTarget : rightTarget;

    const animOptions: AnimationOptionsWithOverrides = {
      delay: durationS * 0.25,
      duration: durationS * 0.75,
      easing: 'linear',
    };
    animate(inner, { transform: 'rotateX(80deg)' }, animOptions);
    animate(
      target,
      { transform: 'translateY(-4em) rotateX(280deg) rotateY(360deg) translateY(-4em)' },
      animOptions,
    );
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
    container-type: size;

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
