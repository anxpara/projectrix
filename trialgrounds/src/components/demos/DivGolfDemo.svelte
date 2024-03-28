<script lang="ts">
  import { onDestroy, onMount, tick } from 'svelte';
  import { mat4, quat, vec3 } from 'gl-matrix';
  import { getActualClientRect } from 'actual-client-rect';
  import { getProjection, setInlineStyles } from 'projectrix';
  import anime from 'animejs';
  import type { Writable } from 'svelte/store';
  import type { Options } from '$lib/options';

  // options are part of demos infrastructure
  export let options: Writable<Options>;
  $: log = $options.log;

  let currentTarget: HTMLElement | undefined;
  let startTarget: HTMLElement;
  let hitTarget: HTMLElement;
  let hitAnim: anime.AnimeInstance | undefined;

  let spinnerModifier: HTMLElement;
  let slider1Modifier: HTMLElement;
  let slider2Modifier: HTMLElement;

  let pulseContainer: HTMLElement;
  let pulseTemplate: HTMLElement;

  const NumGoals = 5;
  let goals: HTMLElement[] = [];

  /* game state */
  const goalsCompleted = new Set<HTMLElement>();
  let courseCompleted = false;
  let moves = 0;
  let startTime = 0;
  let timer = 0;
  let timerInterval: NodeJS.Timeout | undefined;

  onMount(async () => {
    await tick();
    reset();
  });

  onDestroy(() => {
    clearInterval(timerInterval);
  });

  function startTimer(): void {
    startTime = Date.now();
    timer = 0;

    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
      timer = Math.floor((Date.now() - startTime) / 1000);
    }, 1000);
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

  /* game state management */

  function reset(): void {
    goals.forEach((goal) => {
      goal.style.borderStyle = 'solid';
      goal.style.borderColor = '#f00';
    });
    goalsCompleted.clear();

    moves = 0;
    startTimer();

    courseCompleted = false;

    restart();
  }

  function restart(): void {
    setCurrentTarget(startTarget);
    startModifiers();
  }

  function countMove(): void {
    if (courseCompleted) {
      return;
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

  function setCurrentTarget(target: HTMLElement): void {
    if (currentTarget) {
      currentTarget.style.opacity = '0';
    }
    target.style.opacity = '1';
    currentTarget = target;
  }

  function activateModifier(modifier: HTMLElement): void {
    if (hitAnim) return;
    if (!currentTarget) return;

    animateClonedpulse(currentTarget);

    const nextTarget = modifier.firstElementChild as HTMLElement;

    if (currentTarget.isSameNode(nextTarget)) {
      attemptAllgoals();
      return;
    }

    moveToModifier(modifier);
  }

  // match modifier's target to current target's projection
  function moveToModifier(modifier: HTMLElement): void {
    const nextTarget = modifier.firstElementChild as HTMLElement;
    const { toSubject } = getProjection(currentTarget!, nextTarget, { log });
    setInlineStyles(nextTarget, toSubject);
    setCurrentTarget(nextTarget);
  }

  function attemptAllgoals(): void {
    goals.forEach((goal) => attemptGoalHit(goal, false));
  }

  function attemptGoalHit(goal: HTMLElement, goalClicked = true): void {
    const hit = checkIfTolerancesHit(goal);

    if (hit) {
      markGoalCompleted(goal);
      animateHit(goal);
    } else if (goalClicked) {
      animateMiss(goal);
    }
  }

  const distanceTolerancePx = 10;
  const rotationToleranceDeg = 8;

  function checkIfTolerancesHit(goal: HTMLElement): boolean {
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

  /* animations */

  function animateHit(goal: HTMLElement): void {
    // match hit target to current target
    const { toSubject } = getProjection(currentTarget!, hitTarget, { log });
    setInlineStyles(hitTarget, toSubject);
    setCurrentTarget(hitTarget);

    // animate hit target rest of way to goal
    hitAnim = anime({
      targets: hitTarget,
      duration: 300,
      easing: 'easeOutQuad',

      // anime.js takes matrix3d
      ...getProjection(goal, hitTarget, { transformType: 'matrix3d', log }).toSubject,

      complete: () => {
        styleGoalCompleted(goal);

        animateClonedpulse(hitTarget);
        setTimeout(() => animateClonedpulse(hitTarget), 350);
        setTimeout(() => animateClonedpulse(hitTarget), 700);

        hitAnim = undefined;
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
    }
  }

  function handleModifierTap(e: Event): void {
    const modifier = e.currentTarget as HTMLElement;
    countMove();
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

  function handleGoalTap(e: Event): void {
    countMove();
    attemptGoalHit(e.currentTarget as HTMLElement);
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
    countMove();
    attemptGoalHit(goal);
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

      <div bind:this={startTarget} class="golf-target start-target" />
      <div bind:this={hitTarget} class="golf-target hit-target" />

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

<button class="restart" on:click={handleRestartClick}>
  <span class="material-symbols-outlined"> replay </span>
</button>
<div class="scores">
  <div class="tracker score" class:courseCompleted>
    <span class="material-symbols-outlined"> sports_score </span>
    <p>{moves}</p>
  </div>
  <div class="tracker clock" class:courseCompleted>
    <span class="material-symbols-outlined"> timer </span>
    <p>{timer}</p>
  </div>

  <button class="reset" on:click={handleResetClick}>
    <span class="material-symbols-outlined"> delete </span>
  </button>
</div>

<style lang="scss">
  $pxem: 16;

  button {
    all: unset;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
  }

  .prevent-select {
    -webkit-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }

  .disable-touch-zoom {
    touch-action: manipulation;
  }

  .spinner:focus-visible {
    background-color: rgba(255, 0, 255, 0.15);
  }
  .slider1:focus-visible,
  .slider2:focus-visible {
    background-color: rgba(255, 255, 0, 0.4);
  }
  .goal:focus-visible,
  .restart:focus-visible {
    outline: solid 2px white;
    outline-offset: 4px;
  }

  .restart {
    position: absolute;
    top: min(4.4em, 16.8cqw);
    left: 0.8em;
  }

  .scores {
    position: absolute;
    top: 0.5em;
    right: 1em;

    display: flex;
    gap: 1.1em;
    font-weight: 700;

    .tracker {
      display: flex;
      align-items: center;
      gap: 0.1em;
      flex-direction: column;

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

  .start-target {
    top: calc(60 / $pxem * 1em);
    left: calc(10 / $pxem * 1em);
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
