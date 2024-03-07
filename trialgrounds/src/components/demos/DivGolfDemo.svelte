<script lang="ts">
  import { onMount, tick } from 'svelte';
  import { mat4, quat, vec3 } from 'gl-matrix';
  import { getActualClientRect } from 'actual-client-rect';
  import { getProjection } from 'projectrix';
  import anime from 'animejs';

  export let log: boolean = false;

  let startingTarget: HTMLElement;
  let currentTarget: HTMLElement | undefined;

  let rotatorModifier: HTMLElement;
  let slider1Modifier: HTMLElement;
  let slider2Modifier: HTMLElement;

  let goal: HTMLElement;
  let winnerTarget: HTMLElement;

  let flasher: HTMLElement;

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

    setCurrentTarget(nextTarget);
    animateFlash(nextTarget);
  }

  const distanceTolerancePx = 10;
  const rotationToleranceDeg = 8;

  function checkWin(): void {
    const win = checkIfTolerancesWin();

    if (win) {
      animateWin();
    } else {
      animateMiss();
    }
  }

  function checkIfTolerancesWin(): boolean {
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

  function animateWin(): void {
    // match winner target to current target
    anime.set(winnerTarget, {
      ...getProjection(currentTarget!, winnerTarget, {
        transformType: 'matrix3d',
      }).toSubject,
    });

    setCurrentTarget(winnerTarget);

    // animate rest of way to goal
    anime({
      targets: winnerTarget,
      duration: 300,
      easing: 'easeOutQuad',

      ...getProjection(goal, winnerTarget, { transformType: 'matrix3d' }).toSubject,

      complete: () => {
        markGoalCompleted(goal);

        animateFlash(winnerTarget);
        setTimeout(() => animateFlash(winnerTarget), 350);
        setTimeout(() => animateFlash(winnerTarget), 700);
      },
    });
  }

  function animateMiss(): void {
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

<button
  bind:this={goal}
  class="modifier goal"
  on:mousedown={(e) => {
    checkWin();
  }}
>
  <div class="golf-target child-target" />
</button>

<div bind:this={startingTarget} class="golf-target starting-target" />
<div bind:this={winnerTarget} class="golf-target winner-target" />

<button
  bind:this={rotatorModifier}
  class="modifier rotator"
  on:mousedown={(e) => moveCurrentTargetToModifier(e.currentTarget)}
>
  <div class="golf-target child-target" />
</button>

<button
  bind:this={slider1Modifier}
  class="modifier slider1"
  on:mousedown={(e) => moveCurrentTargetToModifier(e.currentTarget)}
>
  <div class="golf-target child-target" />
</button>

<button
  bind:this={slider2Modifier}
  class="modifier slider2"
  on:mousedown={(e) => moveCurrentTargetToModifier(e.currentTarget)}
>
  <div class="golf-target child-target" />
</button>

<div bind:this={flasher} class="golf-target flasher" />

<button class="restart" on:mousedown={() => restart()}>
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
