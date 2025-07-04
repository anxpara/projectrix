<script lang="ts">
  import { onDestroy, onMount } from 'svelte';
  import { animate, utils, type JSAnimation } from 'animejs';
  import { mat4, quat, vec3 } from 'gl-matrix';
  import {
    getProjection,
    measureSubject,
    setInlineStyles,
    type Measurement,
    type PartialProjectionResults,
  } from 'projectrix';
  import type { DemoProps } from '$lib/demos/demos.svelte';

  // options are part of demos infrastructure
  let { options }: DemoProps = $props();
  const log = $derived(options.value.log);

  const NumGoals = 5;
  let goals: HTMLElement[] = $state([]);

  let startTarget = $state() as HTMLElement;
  let hitTarget = $state() as HTMLElement;
  let spinnerModifier = $state() as HTMLElement;
  let slider1Modifier = $state() as HTMLElement;
  let slider2Modifier = $state() as HTMLElement;
  let pulseContainer = $state() as HTMLElement;
  let pulseTemplate = $state() as HTMLElement;

  /* game state */

  let currentTarget: HTMLElement | null;
  let currentModifier: HTMLElement | null = $state(null);
  let hitAnim: JSAnimation | undefined;

  let startTime = 0;
  let timer = $state(0);
  let timerInterval: NodeJS.Timeout | undefined;

  let moves = $state(0);
  const goalsCompleted = new Set<HTMLElement>();
  let courseCompleted = $state(false);

  onMount(() => {
    reset();
  });

  onDestroy(() => {
    clearTimer();
  });

  /* game state management */

  function reset(): void {
    clearTimer();
    moves = 0;
    courseCompleted = false;
    goals.forEach((goal) => {
      goal.style.borderStyle = 'solid';
      goal.style.borderColor = '#f00';
    });
    goalsCompleted.clear();

    restart();
  }

  function restart(): void {
    currentModifier = null;
    setCurrentTarget(startTarget);
    startModifiers();
  }

  function clearTimer(): void {
    clearInterval(timerInterval);
    timer = 0;
  }

  function startTimer(): void {
    startTime = Date.now();
    timerInterval = setInterval(() => {
      timer = Math.floor((Date.now() - startTime) / 1000);
    }, 1000);
  }

  function countMove(): void {
    if (courseCompleted) {
      return;
    }
    if (moves === 0) {
      startTimer();
    }
    moves++;
  }

  function styleGoalCompleted(goal: HTMLElement): void {
    goal.style.borderStyle = 'dotted';
    goal.style.borderColor = '#32cd32';
  }

  function markGoalCompleted(goal: HTMLElement): void {
    goalsCompleted.add(goal);
    checkCourseCompleted();
  }

  function checkCourseCompleted(): void {
    if (courseCompleted) {
      return;
    }
    if (goalsCompleted.size === NumGoals) {
      markCourseCompleted();
    }
  }

  function markCourseCompleted(): void {
    courseCompleted = true;
    clearInterval(timerInterval);
    timer = (Date.now() - startTime) / 1000;
  }

  function startModifiers(): void {
    utils.set(spinnerModifier, {
      rotate: '0deg',
    });
    animate(spinnerModifier, {
      rotate: '-360deg',

      duration: 3000,
      ease: 'linear',
      loop: true,
    });

    utils.set(slider1Modifier, {
      rotate: '-45deg',
      translateX: '0px',
    });
    utils.set(slider2Modifier, {
      rotate: '225deg',
      translateX: '0px',
    });
    const sliderAnimParams = {
      translateX: '170px',

      ease: 'linear',
      loop: true,
      alternate: true,
    };
    animate(slider1Modifier, {
      ...sliderAnimParams,
      duration: 1400,
    });
    animate(slider2Modifier, {
      ...sliderAnimParams,
      duration: 700,
    });
  }

  function activateModifier(modifier: HTMLElement): void {
    if (hitAnim) return;
    if (!currentTarget) return;

    animateClonedpulse(currentTarget);

    if (modifier.isSameNode(currentModifier)) {
      attemptAllgoals();
      return;
    }

    moveTargetToModifier(currentTarget, modifier);
  }

  function moveTargetToModifier(target: HTMLElement, modifier: HTMLElement): void {
    const nextTarget = modifier.firstElementChild as HTMLElement;
    const { toSubject } = getProjection(target, nextTarget, {
      log,
    }) as PartialProjectionResults;
    delete toSubject.borderStyle;

    setInlineStyles(nextTarget, toSubject);

    setCurrentModifier(modifier);
    setCurrentTarget(nextTarget);
  }

  function setCurrentModifier(modifier: HTMLElement): void {
    currentModifier = modifier;
  }

  function setCurrentTarget(target: HTMLElement): void {
    if (currentTarget) {
      currentTarget.style.opacity = '0';
    }
    target.style.opacity = '1';
    currentTarget = target;
  }

  function attemptAllgoals(): void {
    const subject = measureSubject(currentTarget!);

    // schedule the bulk of the goal checking work till after
    // the next animation frame to minimize hiccups
    requestAnimationFrame(() => {
      goals.forEach((goal) => attemptGoalHit(goal, subject));
    });
  }

  function attemptGoalHit(goal: HTMLElement, subject?: Measurement): void {
    subject = subject ?? measureSubject(currentTarget!);
    const hit = checkIfTolerancesHit(goal, subject);
    if (!hit) return;

    currentModifier = null;
    markGoalCompleted(goal);
    animateHit(goal);
  }

  const distanceTolerancePx = 10;
  const rotationToleranceDeg = 8;

  function checkIfTolerancesHit(goal: HTMLElement, subject: Measurement): boolean {
    const { toSubject, toTargetOrigin } = getProjection(subject, goal, {
      transformType: 'transformMat4',
    });

    const basisToOrigin = toTargetOrigin.transformMat4 as mat4;
    const basisToSubject = toSubject.transformMat4 as mat4;

    const originToBasis = mat4.create();
    mat4.invert(originToBasis, basisToOrigin);

    const originToSubject = mat4.create();
    mat4.multiply(originToSubject, originToBasis, basisToSubject);

    const xPx = originToSubject[12];
    const yPx = originToSubject[13];

    // check distance
    const distancePx = Math.sqrt(xPx * xPx + yPx * yPx);
    if (distancePx > distanceTolerancePx) {
      return false;
    }

    const rotationQuat = quat.create();
    mat4.getRotation(rotationQuat, originToSubject);

    const rotationVec3 = vec3.create();
    const rotationDeg = (quat.getAxisAngle(rotationVec3, rotationQuat) * 180) / Math.PI;

    // check rotation
    const rotationDeltaDeg = 45 - Math.abs((rotationDeg % 90) - 45);
    if (rotationDeltaDeg > rotationToleranceDeg) {
      return false;
    }

    return true;
  }

  /* animations */

  function animateHit(goal: HTMLElement): void {
    // match hit target to current target
    const { toSubject } = getProjection(currentTarget!, hitTarget, { log });
    utils.set(hitTarget, toSubject);
    setCurrentTarget(hitTarget);

    // animate hit target rest of way to goal
    hitAnim = animate(hitTarget, {
      ...getProjection(goal, hitTarget, { log }).toSubject,

      duration: 300,
      ease: 'outQuad',

      onComplete: () => {
        styleGoalCompleted(goal);

        animateClonedpulse(hitTarget);
        setTimeout(() => animateClonedpulse(hitTarget), 350);
        setTimeout(() => animateClonedpulse(hitTarget), 700);

        hitAnim = undefined;
      },
    });
  }

  function animateClonedpulse(subject: HTMLElement): void {
    const pulseClone = pulseTemplate.cloneNode() as HTMLElement;
    pulseContainer.append(pulseClone);

    const { toSubject } = getProjection(subject, pulseClone, { log });
    utils.set(pulseClone, toSubject);
    pulseClone.style.opacity = '1';

    animate(pulseClone, {
      outlineOffset: '18px',
      outlineColor: 'rgba(50, 205, 50, 0)',

      duration: 300,
      easing: 'outQuad',

      onComplete: () => {
        pulseClone.remove();
      },
    });
  }

  /* input handling */

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
        countMove();
        activateModifier(spinnerModifier);
        spinnerModifier.focus();
        return;
      case '2':
        countMove();
        activateModifier(slider1Modifier);
        slider1Modifier.focus();
        return;
      case '3':
        countMove();
        activateModifier(slider2Modifier);
        slider2Modifier.focus();
        return;
      case 'r':
        restart();
        return;
      case 'Delete':
        reset();
        return;
    }
  }

  function handleModifierTap(e: Event): void {
    e.preventDefault();
    countMove();
    const modifier = e.currentTarget as HTMLElement;
    activateModifier(modifier);
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

    countMove();
    activateModifier(modifier);
  }

  function handleRestartClick(): void {
    countMove();
    restart();
  }

  function handleResetClick(): void {
    reset();
  }
</script>

<!-- prettier-ignore -->
<svelte:window 
  onkeyup={(e) => handleWindowKeyUp(e.key)} 
  onkeydown={(e) => handleWindowKeyDown(e.key)}
/>

<div class="centerer prevent-select disable-touch-zoom">
  <div class="course-sizer portrait-size-toggle">
    <div class="course portrait-rotate-toggle">
      <div bind:this={goals[0]} class="modifier goal goal-0">
        <div class="golf-target child-target"></div>
      </div>
      <div bind:this={goals[1]} class="modifier goal goal-1">
        <div class="golf-target child-target"></div>
      </div>
      <div bind:this={goals[2]} class="modifier goal goal-2">
        <div class="golf-target child-target"></div>
      </div>
      <div bind:this={goals[3]} class="modifier goal goal-3">
        <div class="golf-target child-target"></div>
      </div>
      <div bind:this={goals[4]} class="modifier goal goal-4">
        <div class="golf-target child-target"></div>
      </div>

      <div bind:this={startTarget} class="golf-target start-target"></div>
      <div bind:this={hitTarget} class="golf-target hit-target"></div>

      <button
        bind:this={spinnerModifier}
        class="modifier spinner"
        class:current={spinnerModifier?.isSameNode(currentModifier)}
        onmousedown={handleModifierTap}
        ontouchstart={handleModifierTap}
        onkeydown={handleModifierKeyDown}
        aria-label="spinner modifier"
      >
        <div class="golf-target child-target"></div>
      </button>

      <button
        bind:this={slider1Modifier}
        class="modifier slider1"
        class:current={slider1Modifier?.isSameNode(currentModifier)}
        onmousedown={handleModifierTap}
        ontouchstart={handleModifierTap}
        onkeydown={handleModifierKeyDown}
        aria-label="slider modifier 1"
      >
        <div class="golf-target child-target"></div>
      </button>

      <button
        bind:this={slider2Modifier}
        class="modifier slider2"
        class:current={slider2Modifier?.isSameNode(currentModifier)}
        onmousedown={handleModifierTap}
        ontouchstart={handleModifierTap}
        onkeydown={handleModifierKeyDown}
        aria-label="slider modifier 2"
      >
        <div class="golf-target child-target"></div>
      </button>
    </div>
  </div>
</div>

<div bind:this={pulseContainer} class="pulse-container">
  <div bind:this={pulseTemplate} class="golf-target pulse-template"></div>
</div>

<button class="restart" onclick={handleRestartClick}>
  <span class="material-symbols-outlined"> replay </span>
</button>
<div class="scores">
  <div class="tracker score" class:courseCompleted>
    <span class="material-symbols-outlined"> sports_score </span>
    <p>{moves}</p>
  </div>
  <div class="tracker clock" class:courseCompleted>
    <span class="material-symbols-outlined"> timer </span>
    <p>{timer}s</p>
  </div>

  <button class="reset" onclick={handleResetClick}>
    <span class="material-symbols-outlined"> delete </span>
  </button>
</div>

<style lang="scss">
  $pxem: 16;

  button {
    all: unset;
    -webkit-tap-highlight-color: transparent;
    cursor: pointer;
  }

  .prevent-select {
    -webkit-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }

  .disable-touch-zoom {
    touch-action: manipulation;
  }

  .spinner.current {
    background-color: rgba(255, 0, 255, 0.15);
  }
  .slider1.current,
  .slider2.current {
    background-color: rgba(255, 255, 0, 0.4);
  }
  .goal:focus-visible,
  .restart:focus-visible {
    outline: solid 2px white;
    outline-offset: 4px;
  }

  .restart {
    position: absolute;
    left: 0.8em;
    top: min(4.4em, 16.8cqw);
  }

  .scores {
    position: absolute;
    right: 1em;
    top: 0.5em;

    display: flex;
    gap: 1.1em;
    font-weight: 700;

    .tracker {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.1em;

      p {
        margin: 0;
      }
    }
    .tracker.courseCompleted {
      color: limeGreen;
    }
  }

  .centerer {
    width: 100%;

    container-type: inline-size;

    display: flex;
    justify-content: center;
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

    will-change: transform;
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
    border: solid 3px #32cd32;

    width: calc(35 / $pxem * 1em);
    height: calc(35 / $pxem * 1em);
    outline: dotted 3px transparent;

    pointer-events: none;
  }

  .start-target {
    left: calc(10 / $pxem * 1em);
    top: calc(60 / $pxem * 1em);
  }

  .child-target {
    opacity: 0;
  }

  .hit-target {
    opacity: 0;
    background-color: limegreen;
  }

  .modifier {
    position: absolute;
    border: dashed 3px darkmagenta;

    width: calc(150 / $pxem * 1em);
    height: calc(150 / $pxem * 1em);

    will-change: transform;
  }
  .modifier:focus-visible {
    outline: solid 2px white;
    outline-offset: 3px;
  }

  .spinner {
    left: calc(60 / $pxem * 1em);
    top: calc(70 / $pxem * 1em);
  }

  .slider1,
  .slider2 {
    height: calc(50 / $pxem * 1em);

    border-color: yellow;
  }

  .slider1 {
    left: calc(235 / $pxem * 1em);
    top: calc(160 / $pxem * 1em);

    transform: rotate(-45deg);
  }
  .slider2 {
    left: calc(479 / $pxem * 1em);
    top: calc(160 / $pxem * 1em);

    transform: rotate(225deg);
  }

  .goal {
    width: calc(35 / $pxem * 1em);
    height: calc(35 / $pxem * 1em);

    border-style: solid;
    border-color: red;
  }
  .goal-0 {
    left: calc(415 / $pxem * 1em);
    top: calc(210 / $pxem * 1em);
    transform: rotate(45deg);
  }
  .goal-1 {
    left: calc(223 / $pxem * 1em);
    top: calc(57 / $pxem * 1em);
    transform: rotate(24deg);
  }
  .goal-2 {
    left: calc(564 / $pxem * 1em);
    top: calc(104 / $pxem * 1em);
    transform: rotate(20deg);
  }
  .goal-3 {
    left: calc(559 / $pxem * 1em);
    top: calc(57 / $pxem * 1em);
    transform: rotate(14deg);
  }
  .goal-4 {
    left: calc(551 / $pxem * 1em);
    top: calc(11 / $pxem * 1em);
    transform: rotate(9deg);
  }

  .pulse-container {
    will-change: transform;
  }

  .pulse-template {
    opacity: 0;
    border-color: transparent;
    outline: solid 2px transparent;
    outline-offset: 0px;
    outline-color: rgba(50, 205, 50, 1);
  }
</style>
