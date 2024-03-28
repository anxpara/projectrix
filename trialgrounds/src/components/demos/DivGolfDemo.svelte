<script lang="ts">
  import { onMount, tick } from 'svelte';
  import { mat4, quat, vec3 } from 'gl-matrix';
  import { getActualClientRect } from 'actual-client-rect';
  import { getProjection, setInlineStyles } from 'projectrix';
  import anime from 'animejs';
  import type { Writable } from 'svelte/store';
  import type { Options } from '$lib/options';

  // options are part of demos infrastructure
  export let options: Writable<Options>;
  $: log = $options.log;

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

    // match next target to current target's projection
    const { toSubject } = getProjection(currentTarget, nextTarget, { log });
    setInlineStyles(nextTarget, toSubject);

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
    const { toSubject } = getProjection(currentTarget!, winnerTarget, { log });
    setInlineStyles(winnerTarget, toSubject);
    setCurrentTarget(winnerTarget);

    // animate winner target rest of way to goal
    winAnim = anime({
      targets: winnerTarget,
      duration: 300,
      easing: 'easeOutQuad',

      // anime.js takes matrix3d
      ...getProjection(goal, winnerTarget, { transformType: 'matrix3d', log }).toSubject,

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
    goal.style.backgroundColor = 'rgba(255, 0, 0, 1)';
    anime({
      targets: goal,
      duration: 300,
      easing: 'easeOutQuad',

      backgroundColor: 'rgba(255, 0, 0, 0)',
    });
  }

  function markGoalCompleted(goal: HTMLElement): void {
    goal.style.borderStyle = 'dotted';
    goal.style.borderColor = '#32cd32';
  }

  function animateClonedpulse(subject: HTMLElement): void {
    const pulseClone = pulseTemplate.cloneNode() as HTMLElement;
    pulseContainer.append(pulseClone);

    const { toSubject } = getProjection(subject, pulseClone, { log });
    setInlineStyles(pulseClone, toSubject);
    pulseClone.style.opacity = '1';

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

  // INPUT

  // prevent holding keys down
  const keysDownBad: Record<string, boolean> = {};
  function liftKey(key: string): void {
    keysDownBad[key] = false;
  }
  // presses key; returns true if key was already down bad
  function pressKeyDownBad(key: string): boolean {
    if (keysDownBad[key]) {
      return true;
    }
    keysDownBad[key] = true;
    return false;
  }

  function isEnterKey(key: string): boolean {
    if (['Enter', ' '].includes(key)) return true;
    return false;
  }

  function handleWindowKeyUp(key: string): void {
    liftKey(key);
  }
  function handleWindowKeyDown(key: string): void {
    if (isEnterKey(key)) {
      return;
    }
    if (pressKeyDownBad(key)) {
      return;
    }

    switch (key) {
      case '1':
        moveCurrentTargetToModifier(spinnerModifier);
        spinnerModifier.focus();
        return;
      case '2':
        moveCurrentTargetToModifier(slider1Modifier);
        slider1Modifier.focus();
        return;
      case '3':
        moveCurrentTargetToModifier(slider2Modifier);
        slider2Modifier.focus();
        return;
      case 'r':
        restart();
        return;
    }
  }

  function handleModifierTap(e: Event): void {
    const modifier = e.currentTarget as HTMLElement;
    moveCurrentTargetToModifier(modifier);
  }
  function handleModifierKeyDown(e: KeyboardEvent): void {
    const key = e.key;
    const modifier = e.currentTarget as HTMLElement;
    if (!isEnterKey(key)) {
      return;
    }
    if (pressKeyDownBad(key)) {
      return;
    }

    moveCurrentTargetToModifier(modifier);
  }

  function handleGoalTap(e: Event): void {
    checkWin(e.currentTarget as HTMLElement);
  }
  function handleGoalKeyDown(e: KeyboardEvent): void {
    const key = e.key;
    const goal = e.currentTarget as HTMLElement;
    if (!isEnterKey(key)) {
      return;
    }
    if (pressKeyDownBad(key)) {
      return;
    }
    checkWin(goal);
  }
</script>

<!-- prettier-ignore -->
<svelte:window 
  on:keyup={(e) => handleWindowKeyUp(e.key)} 
  on:keydown={(e) => handleWindowKeyDown(e.key)}
/>

<div class="centerer prevent-select disable-touch-zoom">
  <div class="course-sizer portrait-size-toggle">
    <div class="course portrait-rotate-toggle">
      <button
        bind:this={goals[0]}
        class="modifier goal goal-0"
        on:mousedown={handleGoalTap}
        on:touchstart|preventDefault={handleGoalTap}
        on:keydown={handleGoalKeyDown}
      >
        <div class="golf-target child-target" />
      </button>

      <button
        bind:this={goals[1]}
        class="modifier goal goal-1"
        on:mousedown={handleGoalTap}
        on:touchstart|preventDefault={handleGoalTap}
        on:keydown={handleGoalKeyDown}
      >
        <div class="golf-target child-target" />
      </button>

      <button
        bind:this={goals[2]}
        class="modifier goal goal-2"
        on:mousedown={handleGoalTap}
        on:touchstart|preventDefault={handleGoalTap}
        on:keydown={handleGoalKeyDown}
      >
        <div class="golf-target child-target" />
      </button>

      <button
        bind:this={goals[3]}
        class="modifier goal goal-3"
        on:mousedown={handleGoalTap}
        on:touchstart|preventDefault={handleGoalTap}
        on:keydown={handleGoalKeyDown}
      >
        <div class="golf-target child-target" />
      </button>

      <button
        bind:this={goals[4]}
        class="modifier goal goal-4"
        on:mousedown={handleGoalTap}
        on:touchstart|preventDefault={handleGoalTap}
        on:keydown={handleGoalKeyDown}
      >
        <div class="golf-target child-target" />
      </button>

      <div bind:this={startingTarget} class="golf-target starting-target" />
      <div bind:this={winnerTarget} class="golf-target winner-target" />

      <button
        bind:this={spinnerModifier}
        class="modifier spinner"
        on:mousedown={handleModifierTap}
        on:touchstart|preventDefault={handleModifierTap}
        on:keydown={handleModifierKeyDown}
      >
        <div class="golf-target child-target" />
      </button>

      <button
        bind:this={slider1Modifier}
        class="modifier slider1"
        on:mousedown={handleModifierTap}
        on:touchstart|preventDefault={handleModifierTap}
        on:keydown={handleModifierKeyDown}
      >
        <div class="golf-target child-target" />
      </button>

      <button
        bind:this={slider2Modifier}
        class="modifier slider2"
        on:mousedown={handleModifierTap}
        on:touchstart|preventDefault={handleModifierTap}
        on:keydown={handleModifierKeyDown}
      >
        <div class="golf-target child-target" />
      </button>
    </div>
  </div>
</div>

<div bind:this={pulseContainer} class="pulse-container">
  <div bind:this={pulseTemplate} class="golf-target pulse-template" />
</div>

<button class="restart" on:click={() => restart()}>
  <span class="material-symbols-outlined"> replay </span>
</button>

<style lang="scss">
  $pxem: 16;

  button {
    all: unset;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
  }

  .spinner:focus-visible {
    background-color: rgba(255, 0, 255, 0.1);
  }
  .slider1:focus-visible,
  .slider2:focus-visible {
    background-color: rgba(255, 255, 0, 0.2);
  }
  .goal:focus-visible,
  .restart:focus-visible {
    outline: solid 2px white;
    outline-offset: 4px;
  }

  .prevent-select {
    -webkit-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }

  .disable-touch-zoom {
    touch-action: manipulation;
  }

  .restart {
    position: absolute;
    top: 1em;
    right: 1em;
  }

  .centerer {
    width: 100%;

    display: flex;
    justify-content: center;

    container-type: inline-size;
  }

  .course-sizer {
    position: relative;
    width: calc(620 / $pxem * 1em);
    height: calc(270 / $pxem * 1em);
  }

  .course {
    width: calc(620 / $pxem * 1em);
    height: calc(270 / $pxem * 1em);
    transform-origin: top left;
  }

  @container (max-width: 613px) {
    .course-sizer.portrait-size-toggle {
      width: calc(270 / $pxem * 1em);
      height: calc(620 / $pxem * 1em);
    }

    .course.portrait-rotate-toggle {
      transform: translateX(calc(270 / $pxem * 1em)) rotate(90deg);
    }
  }

  .golf-target {
    position: absolute;

    width: calc(35 / $pxem * 1em);
    height: calc(35 / $pxem * 1em);
    border: solid 3px #32cd32;
    outline: dotted 3px transparent;

    pointer-events: none;
  }

  .starting-target {
    top: calc(60 / $pxem * 1em);
    left: calc(10 / $pxem * 1em);
  }

  .child-target {
    opacity: 0;
  }

  .winner-target {
    opacity: 0;
    background-color: limegreen;
  }

  .modifier {
    position: absolute;

    width: calc(150 / $pxem * 1em);
    height: calc(150 / $pxem * 1em);
    border: dashed 3px darkmagenta;
  }

  .spinner {
    top: calc(70 / $pxem * 1em);
    left: calc(60 / $pxem * 1em);
  }

  .slider1,
  .slider2 {
    height: calc(50 / $pxem * 1em);

    border-color: yellow;
  }

  .slider1 {
    top: calc(160 / $pxem * 1em);
    left: calc(235 / $pxem * 1em);

    transform: rotate(-45deg);
  }
  .slider2 {
    top: calc(160 / $pxem * 1em);
    left: calc(479 / $pxem * 1em);

    transform: rotate(225deg);
  }

  .goal {
    width: calc(35 / $pxem * 1em);
    height: calc(35 / $pxem * 1em);

    border-style: solid;
    border-color: red;
  }
  .goal-0 {
    top: calc(210 / $pxem * 1em);
    left: calc(415 / $pxem * 1em);
    transform: rotate(45deg);
  }
  .goal-1 {
    top: calc(57 / $pxem * 1em);
    left: calc(223 / $pxem * 1em);
    transform: rotate(24deg);
  }
  .goal-2 {
    top: calc(104 / $pxem * 1em);
    left: calc(564 / $pxem * 1em);
    transform: rotate(20deg);
  }
  .goal-3 {
    top: calc(57 / $pxem * 1em);
    left: calc(559 / $pxem * 1em);
    transform: rotate(14deg);
  }
  .goal-4 {
    top: calc(11 / $pxem * 1em);
    left: calc(551 / $pxem * 1em);
    transform: rotate(9deg);
  }

  .pulse-template {
    border-color: transparent;
    outline: solid 2px transparent;
    outline-offset: 0px;
    outline-color: rgba(50, 205, 50, 1);
    opacity: 0;
  }
</style>
