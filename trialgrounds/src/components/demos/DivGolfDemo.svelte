<script lang="ts">
  import anime from 'animejs';
  import { getProjection } from 'projectrix';
  import { onDestroy, onMount, tick } from 'svelte';

  export let log: boolean = false;

  let startingTarget: HTMLElement;
  let currentTarget: HTMLElement | undefined;

  let rotatorModifier: HTMLElement;
  let slider1Modifier: HTMLElement;
  let slider2Modifier: HTMLElement;

  let flasher: HTMLElement;

  onMount(async () => {
    await tick();

    currentTarget = startingTarget;
    startModifiers();
  });

  onDestroy(() => {
    stop();
  });

  function startModifiers(): void {
    anime.set(rotatorModifier, {
      rotate: '0deg',
    });
    anime({
      targets: rotatorModifier,
      duration: 3000,
      easing: 'linear',
      loop: true,

      rotate: '-360deg',
    });

    anime.set(slider1Modifier, {
      rotate: '-45deg',
      translateX: '0px',
    });
    anime.set(slider2Modifier, {
      rotate: '225deg',
      translateX: '0px',
    });
    const sliderAnimProps = {
      easing: 'linear',
      loop: true,
      direction: 'alternate',

      translateX: '170px',
    };
    anime({
      targets: slider1Modifier,
      duration: 1400,
      ...sliderAnimProps,
    });
    anime({
      targets: slider2Modifier,
      duration: 700,
      ...sliderAnimProps,
    });
  }

  function stop(): void {
    anime.remove([rotatorModifier, slider1Modifier, slider2Modifier]);
  }

  function restart(): void {
    setCurrentTarget(startingTarget);
    startModifiers();
  }

  function moveCurrentTargetToModifier(modifier: HTMLElement): void {
    const nextTarget = modifier.firstElementChild as HTMLElement;
    if (currentTarget?.isSameNode(nextTarget)) {
      return;
    }

    // Anime.js v3 takes matrix3d
    const projectionResults = getProjection(currentTarget!, nextTarget, {
      transformType: 'matrix3d',
    });
    const { toSubject } = projectionResults;
    if (log) {
      console.log(projectionResults);
    }

    // match next target to current target's projection
    anime.set(nextTarget, {
      ...toSubject,
    });

    // show next target, hide current target, and animate a flash at the current position
    setCurrentTarget(nextTarget);
    animateFlash(nextTarget);
  }

  function setCurrentTarget(target: HTMLElement): void {
    currentTarget!.style.opacity = '0';
    target.style.opacity = '1';
    currentTarget = target;
  }

  function animateFlash(subject: HTMLElement): void {
    const { toSubject } = getProjection(subject, flasher, {
      transformType: 'matrix3d',
    });

    anime.set(flasher, {
      ...toSubject,
      outlineOffset: '0px',
      outlineColor: 'rgba(50, 205, 50, 1)',
    });
    anime({
      targets: flasher,
      duration: 300,
      easing: 'easeOutQuad',

      outlineOffset: '18px',
      outlineColor: 'rgba(50, 205, 50, 0)',
    });
  }
</script>

<div bind:this={startingTarget} class="golf-target starting-target" />

<button
  class="modifier goal"
  on:click={(e) => {
    moveCurrentTargetToModifier(e.currentTarget);
    stop();
  }}
>
  <div class="golf-target child-target" />
</button>

<button
  bind:this={rotatorModifier}
  class="modifier rotator"
  on:click={(e) => moveCurrentTargetToModifier(e.currentTarget)}
>
  <div class="golf-target child-target" />
</button>

<button
  bind:this={slider1Modifier}
  class="modifier slider1"
  on:click={(e) => moveCurrentTargetToModifier(e.currentTarget)}
>
  <div class="golf-target child-target" />
</button>

<button
  bind:this={slider2Modifier}
  class="modifier slider2"
  on:click={(e) => moveCurrentTargetToModifier(e.currentTarget)}
>
  <div class="golf-target child-target" />
</button>

<div bind:this={flasher} class="golf-target flasher" />

<button class="restart" on:click={() => restart()}>
  <span class="material-symbols-outlined"> replay </span>
</button>

<style lang="scss">
  // not bothering to make responsive for now, not a priority
  button {
    all: unset;
  }

  .modifier:focus-visible,
  .parent:focus-visible,
  .restart:focus-visible {
    outline: solid 2px white;
    outline-offset: 4px;
  }

  .golf-target {
    position: absolute;

    width: 35px;
    height: 35px;
    border: solid 3px limegreen;
    outline: dotted 3px transparent;

    pointer-events: none;
  }

  .starting-target {
    top: 100px;
    left: 50px;
  }

  .child-target {
    opacity: 0;
  }

  .flasher {
    border-color: transparent;
    outline: solid 2px transparent;
  }

  .modifier {
    position: absolute;

    width: 150px;
    height: 150px;
    border: dashed 3px darkmagenta;

    cursor: pointer;
  }

  .rotator {
    top: 110px;
    left: 100px;
  }

  .slider1,
  .slider2 {
    height: 50px;

    border-color: yellow;
  }

  .slider1 {
    top: 200px;
    right: 275px;

    transform: rotate(-45deg);
  }
  .slider2 {
    top: 200px;
    right: 25px;

    transform: rotate(225deg);
  }

  .goal {
    top: 250px;
    left: 455px;

    width: 35px;
    height: 35px;

    border-style: solid;
    border-color: red;

    transform: rotate(45deg);
  }

  .restart {
    position: absolute;
    top: 1em;
    right: 1em;

    cursor: pointer;
  }
</style>
