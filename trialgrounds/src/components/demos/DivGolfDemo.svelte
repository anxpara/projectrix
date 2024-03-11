<script lang="ts">
  import { onMount, tick } from 'svelte';
  import { mat4, quat, vec3 } from 'gl-matrix';
  import { getActualClientRect } from 'actual-client-rect';
  import { getProjection } from 'projectrix';
  import anime from 'animejs';
  import type { Writable } from 'svelte/store';
  import type { Options } from '$lib/options';

  export let options: Writable<Options>;

  let startingTarget: HTMLElement;
  let currentTarget: HTMLElement | undefined;

  let spinnerModifier: HTMLElement;
  let slider1Modifier: HTMLElement;
  let slider2Modifier: HTMLElement;

  let goals: HTMLElement[] = [];
  let winnerTarget: HTMLElement;
  let winAnim: anime.AnimeInstance | undefined;

  let pulseContainer: HTMLElement;
  let pulseTemplate: HTMLElement;

  onMount(async () => {
    await tick();
    restart();
  });

  function restart(): void {
    setCurrentTarget(startingTarget);
    startModifiers();
  }

  function setCurrentTarget(target: HTMLElement): void {
    if (currentTarget) {
      currentTarget.style.opacity = '0';
    }
    target.style.opacity = '1';
    currentTarget = target;
  }

  function startModifiers(): void {
    anime.set(spinnerModifier, {
      rotate: '0deg',
    });
    anime({
      targets: spinnerModifier,
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
    const sliderAnimParams = {
      easing: 'linear',
      loop: true,
      direction: 'alternate',

      translateX: '170px',
    };
    anime({
      targets: slider1Modifier,
      duration: 1400,

      ...sliderAnimParams,
    });
    anime({
      targets: slider2Modifier,
      duration: 700,

      ...sliderAnimParams,
    });
  }

  function moveCurrentTargetToModifier(modifier: HTMLElement): void {
    if (winAnim) return;

    const nextTarget = modifier.firstElementChild as HTMLElement;
    if (!currentTarget) return;
    if (currentTarget.isSameNode(nextTarget)) {
      animateClonedpulse(currentTarget);
      goals.forEach((goal) => checkWin(goal, false));
      return;
    }

    // Anime.js v3 takes matrix3d
    const projectionResults = getProjection(currentTarget, nextTarget, {
      transformType: 'matrix3d',
    });
    const { toSubject } = projectionResults;
    if ($options.log) {
      console.log(projectionResults);
    }

    // match next target to current target's projection
    anime.set(nextTarget, {
      ...toSubject,
    });

    setCurrentTarget(nextTarget);
    animateClonedpulse(nextTarget);
  }

  const distanceTolerancePx = 10;
  const rotationToleranceDeg = 8;

  function checkWin(goal: HTMLElement, goalClicked = true): void {
    const win = checkIfTolerancesWin(goal);

    if (win) {
      animateWin(goal);
      return;
    }

    if (goalClicked) {
      animateMiss(goal);
    }
  }

  function checkIfTolerancesWin(goal: HTMLElement): boolean {
    const goalAcr = getActualClientRect(goal, {
      bakePositionIntoTransform: true,
    });
    const currentAcr = getActualClientRect(currentTarget!, {
      bakePositionIntoTransform: true,
    });

    const Mvc = currentAcr.transformMat4;
    const Mcv = mat4.create();
    mat4.invert(Mcv, Mvc);

    const Mvg = goalAcr.transformMat4;

    const Mcg = mat4.create();
    mat4.multiply(Mcg, Mcv, Mvg);

    // check distance
    const distancePx = Math.sqrt(Mcg[12] * Mcg[12] + Mcg[13] * Mcg[13]);
    if (distancePx > distanceTolerancePx) {
      return false;
    }

    const rotationQuat = quat.create();
    mat4.getRotation(rotationQuat, Mcg);

    const rotationVec3 = vec3.create();
    const rotationDeg = (quat.getAxisAngle(rotationVec3, rotationQuat) * 180) / Math.PI;
    const rotationDiff = 45 - Math.abs((rotationDeg % 90) - 45);

    // check rotation
    if (rotationDiff > rotationToleranceDeg) {
      return false;
    }

    return true;
  }

  function animateWin(goal: HTMLElement): void {
    // match winner target to current target
    anime.set(winnerTarget, {
      ...getProjection(currentTarget!, winnerTarget, {
        transformType: 'matrix3d',
      }).toSubject,
    });

    setCurrentTarget(winnerTarget);

    // animate rest of way to goal
    winAnim = anime({
      targets: winnerTarget,
      duration: 300,
      easing: 'easeOutQuad',

      ...getProjection(goal, winnerTarget, { transformType: 'matrix3d' }).toSubject,

      complete: () => {
        markGoalCompleted(goal);

        animateClonedpulse(winnerTarget);
        setTimeout(() => animateClonedpulse(winnerTarget), 350);
        setTimeout(() => animateClonedpulse(winnerTarget), 700);

        winAnim = undefined;
      },
    });
  }

  function animateMiss(goal: HTMLElement): void {
    anime.set(goal, {
      backgroundColor: 'rgba(255, 0, 0, 1)',
    });
    anime({
      targets: goal,
      duration: 300,
      easing: 'easeOutQuad',

      backgroundColor: 'rgba(255, 0, 0, 0)',
    });
  }

  function markGoalCompleted(goal: HTMLElement): void {
    anime.set(goal, {
      borderStyle: 'dotted',
      borderColor: '#32cd32',
    });
  }

  function animateClonedpulse(subject: HTMLElement): void {
    const pulseClone = <HTMLElement>pulseTemplate.cloneNode();
    pulseContainer.append(pulseClone);

    const { toSubject } = getProjection(subject, pulseClone, {
      transformType: 'matrix3d',
    });

    anime.set(pulseClone, {
      ...toSubject,
      outlineOffset: '0px',
      outlineColor: 'rgba(50, 205, 50, 1)',
    });
    anime({
      targets: pulseClone,
      duration: 300,
      easing: 'easeOutQuad',

      outlineOffset: '18px',
      outlineColor: 'rgba(50, 205, 50, 0)',

      complete: () => {
        pulseClone.remove();
      },
    });
  }

  function isEnterKey(key: string): boolean {
    const SpaceKey = ' '; // wut
    if (['Enter', SpaceKey].includes(key)) return true;
    return false;
  }
</script>

<button
  bind:this={goals[0]}
  class="modifier goal goal-0"
  on:mousedown={(e) => {
    checkWin(e.currentTarget);
  }}
  on:keydown={(e) => {
    if (isEnterKey(e.key)) checkWin(e.currentTarget);
  }}
>
  <div class="golf-target child-target" />
</button>

<button
  bind:this={goals[1]}
  class="modifier goal goal-1"
  on:mousedown={(e) => {
    checkWin(e.currentTarget);
  }}
  on:keydown={(e) => {
    if (isEnterKey(e.key)) checkWin(e.currentTarget);
  }}
>
  <div class="golf-target child-target" />
</button>

<button
  bind:this={goals[2]}
  class="modifier goal goal-2"
  on:mousedown={(e) => {
    checkWin(e.currentTarget);
  }}
  on:keydown={(e) => {
    if (isEnterKey(e.key)) checkWin(e.currentTarget);
  }}
>
  <div class="golf-target child-target" />
</button>

<button
  bind:this={goals[3]}
  class="modifier goal goal-3"
  on:mousedown={(e) => {
    checkWin(e.currentTarget);
  }}
  on:keydown={(e) => {
    if (isEnterKey(e.key)) checkWin(e.currentTarget);
  }}
>
  <div class="golf-target child-target" />
</button>

<button
  bind:this={goals[4]}
  class="modifier goal goal-4"
  on:mousedown={(e) => {
    checkWin(e.currentTarget);
  }}
  on:keydown={(e) => {
    if (isEnterKey(e.key)) checkWin(e.currentTarget);
  }}
>
  <div class="golf-target child-target" />
</button>

<div bind:this={startingTarget} class="golf-target starting-target" />
<div bind:this={winnerTarget} class="golf-target winner-target" />

<button
  bind:this={spinnerModifier}
  class="modifier spinner"
  on:mousedown={(e) => moveCurrentTargetToModifier(e.currentTarget)}
  on:keydown={(e) => {
    if (isEnterKey(e.key)) moveCurrentTargetToModifier(e.currentTarget);
  }}
>
  <div class="golf-target child-target" />
</button>

<button
  bind:this={slider1Modifier}
  class="modifier slider1"
  on:mousedown={(e) => moveCurrentTargetToModifier(e.currentTarget)}
  on:keydown={(e) => {
    if (isEnterKey(e.key)) moveCurrentTargetToModifier(e.currentTarget);
  }}
>
  <div class="golf-target child-target" />
</button>

<button
  bind:this={slider2Modifier}
  class="modifier slider2"
  on:mousedown={(e) => moveCurrentTargetToModifier(e.currentTarget)}
  on:keydown={(e) => {
    if (isEnterKey(e.key)) moveCurrentTargetToModifier(e.currentTarget);
  }}
>
  <div class="golf-target child-target" />
</button>

<div bind:this={pulseContainer} class="pulse-container">
  <div bind:this={pulseTemplate} class="golf-target pulse-template" />
</div>

<button class="restart" on:click={() => restart()}>
  <span class="material-symbols-outlined"> replay </span>
</button>

<style lang="scss">
  // not bothering to make responsive for now, not a priority
  button {
    all: unset;
  }

  .modifier:focus-visible,
  .restart:focus-visible {
    outline: solid 2px white;
    outline-offset: 4px;
    cursor: pointer;
  }

  .restart {
    position: absolute;
    top: 1em;
    right: 1em;
  }

  .golf-target {
    position: absolute;

    width: 35px;
    height: 35px;
    border: solid 3px #32cd32;
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

  .winner-target {
    opacity: 0;
    background-color: limegreen;
  }

  .pulse-template {
    border-color: transparent;
    outline: solid 2px transparent;
  }

  .modifier {
    position: absolute;

    width: 150px;
    height: 150px;
    border: dashed 3px darkmagenta;
  }

  .spinner {
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
    width: 35px;
    height: 35px;

    border-style: solid;
    border-color: red;
  }
  .goal-0 {
    top: 250px;
    left: 455px;
    transform: rotate(45deg);
  }
  .goal-1 {
    top: 97px;
    left: 263px;
    transform: rotate(24deg);
  }
  .goal-2 {
    top: 144px;
    left: 604px;
    transform: rotate(20deg);
  }
  .goal-3 {
    top: 97px;
    left: 599px;
    transform: rotate(14deg);
  }
  .goal-4 {
    top: 51px;
    left: 591px;
    transform: rotate(9deg);
  }
</style>
