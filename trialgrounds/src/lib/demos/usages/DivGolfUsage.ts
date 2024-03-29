export const DivGolfUsage = `import { getProjection, setInlineStyles } from 'projectrix';
import anime from 'animejs';

let currentTarget: HTMLElement;

// each modifier contains a unique green target. match the next target to
// the current target and swap their opacities to create the illusion of
// a single green target being passed between the modifiers
function moveCurrentTargetToModifier(modifier: HTMLElement): void {
  const nextTarget = modifier.firstElementChild as HTMLElement;
  if (currentTarget.isSameNode(nextTarget)) return;

  // match next target to current target's projection
  const { toSubject } = getProjection(currentTarget, nextTarget);
  setInlineStyles(nextTarget, toSubject);

  // swap targets
  currentTarget.style.opacity = '0';
  target.style.opacity = '1';
  currentTarget = target;
}`;

export const DivGolfCode = `<script lang="ts">
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
</style>`;

export const DivGolfUsageHL = `<pre class="shiki one-dark-pro" style="background-color:#282c34;color:#abb2bf" tabindex="0"><code><span class="line"><span style="color:#C678DD">import</span><span style="color:#ABB2BF"> { </span><span style="color:#E06C75">getProjection</span><span style="color:#ABB2BF">, </span><span style="color:#E06C75">setInlineStyles</span><span style="color:#ABB2BF"> } </span><span style="color:#C678DD">from</span><span style="color:#98C379"> 'projectrix'</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#C678DD">import</span><span style="color:#E06C75"> anime</span><span style="color:#C678DD"> from</span><span style="color:#98C379"> 'animejs'</span><span style="color:#ABB2BF">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD">let</span><span style="color:#E06C75"> currentTarget</span><span style="color:#ABB2BF">: </span><span style="color:#E5C07B">HTMLElement</span><span style="color:#ABB2BF">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic">// each modifier contains a unique green target. match the next target to</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic">// the current target and swap their opacities to create the illusion of</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic">// a single green target being passed between the modifiers</span></span>
<span class="line"><span style="color:#C678DD">function</span><span style="color:#61AFEF"> moveCurrentTargetToModifier</span><span style="color:#ABB2BF">(</span><span style="color:#E06C75;font-style:italic">modifier</span><span style="color:#ABB2BF">: </span><span style="color:#E5C07B">HTMLElement</span><span style="color:#ABB2BF">): </span><span style="color:#E5C07B">void</span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#C678DD">  const</span><span style="color:#E5C07B"> nextTarget</span><span style="color:#56B6C2"> =</span><span style="color:#E5C07B"> modifier</span><span style="color:#ABB2BF">.</span><span style="color:#E06C75">firstElementChild</span><span style="color:#C678DD"> as</span><span style="color:#E5C07B"> HTMLElement</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#C678DD">  if</span><span style="color:#ABB2BF"> (</span><span style="color:#E5C07B">currentTarget</span><span style="color:#ABB2BF">.</span><span style="color:#61AFEF">isSameNode</span><span style="color:#ABB2BF">(</span><span style="color:#E06C75">nextTarget</span><span style="color:#ABB2BF">)) </span><span style="color:#C678DD">return</span><span style="color:#ABB2BF">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic">  // match next target to current target's projection</span></span>
<span class="line"><span style="color:#C678DD">  const</span><span style="color:#ABB2BF"> { </span><span style="color:#E5C07B">toSubject</span><span style="color:#ABB2BF"> } </span><span style="color:#56B6C2">=</span><span style="color:#61AFEF"> getProjection</span><span style="color:#ABB2BF">(</span><span style="color:#E06C75">currentTarget</span><span style="color:#ABB2BF">, </span><span style="color:#E06C75">nextTarget</span><span style="color:#ABB2BF">);</span></span>
<span class="line"><span style="color:#61AFEF">  setInlineStyles</span><span style="color:#ABB2BF">(</span><span style="color:#E06C75">nextTarget</span><span style="color:#ABB2BF">, </span><span style="color:#E06C75">toSubject</span><span style="color:#ABB2BF">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic">  // swap targets</span></span>
<span class="line"><span style="color:#E5C07B">  currentTarget</span><span style="color:#ABB2BF">.</span><span style="color:#E5C07B">style</span><span style="color:#ABB2BF">.</span><span style="color:#E06C75">opacity</span><span style="color:#56B6C2"> =</span><span style="color:#98C379"> '0'</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#E5C07B">  target</span><span style="color:#ABB2BF">.</span><span style="color:#E5C07B">style</span><span style="color:#ABB2BF">.</span><span style="color:#E06C75">opacity</span><span style="color:#56B6C2"> =</span><span style="color:#98C379"> '1'</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#E06C75">  currentTarget</span><span style="color:#56B6C2"> =</span><span style="color:#E06C75"> target</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">}</span></span></code></pre>`;

export const DivGolfCodeHL = `<pre class="shiki one-dark-pro" style="background-color:#282c34;color:#abb2bf" tabindex="0"><code><span class="line"><span style="color:#ABB2BF">&#x3C;</span><span style="color:#E06C75">script</span><span style="color:#D19A66"> lang</span><span style="color:#ABB2BF">=</span><span style="color:#98C379">"ts"</span><span style="color:#ABB2BF">></span></span>
<span class="line"><span style="color:#C678DD">  import</span><span style="color:#ABB2BF"> { </span><span style="color:#E06C75">onDestroy</span><span style="color:#ABB2BF">, </span><span style="color:#E06C75">onMount</span><span style="color:#ABB2BF">, </span><span style="color:#E06C75">tick</span><span style="color:#ABB2BF"> } </span><span style="color:#C678DD">from</span><span style="color:#98C379"> 'svelte'</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#C678DD">  import</span><span style="color:#ABB2BF"> { </span><span style="color:#E06C75">mat4</span><span style="color:#ABB2BF">, </span><span style="color:#E06C75">quat</span><span style="color:#ABB2BF">, </span><span style="color:#E06C75">vec3</span><span style="color:#ABB2BF"> } </span><span style="color:#C678DD">from</span><span style="color:#98C379"> 'gl-matrix'</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#C678DD">  import</span><span style="color:#ABB2BF"> { </span><span style="color:#E06C75">getActualClientRect</span><span style="color:#ABB2BF"> } </span><span style="color:#C678DD">from</span><span style="color:#98C379"> 'actual-client-rect'</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#C678DD">  import</span><span style="color:#ABB2BF"> { </span><span style="color:#E06C75">getProjection</span><span style="color:#ABB2BF">, </span><span style="color:#E06C75">setInlineStyles</span><span style="color:#ABB2BF"> } </span><span style="color:#C678DD">from</span><span style="color:#98C379"> 'projectrix'</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#C678DD">  import</span><span style="color:#E06C75"> anime</span><span style="color:#C678DD"> from</span><span style="color:#98C379"> 'animejs'</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#C678DD">  import</span><span style="color:#C678DD"> type</span><span style="color:#ABB2BF"> { </span><span style="color:#E06C75">Writable</span><span style="color:#ABB2BF"> } </span><span style="color:#C678DD">from</span><span style="color:#98C379"> 'svelte/store'</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#C678DD">  import</span><span style="color:#C678DD"> type</span><span style="color:#ABB2BF"> { </span><span style="color:#E06C75">Options</span><span style="color:#ABB2BF"> } </span><span style="color:#C678DD">from</span><span style="color:#98C379"> '$lib/options'</span><span style="color:#ABB2BF">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic">  // options are part of demos infrastructure</span></span>
<span class="line"><span style="color:#C678DD">  export</span><span style="color:#C678DD"> let</span><span style="color:#E06C75"> options</span><span style="color:#ABB2BF">: </span><span style="color:#E5C07B">Writable</span><span style="color:#ABB2BF">&#x3C;</span><span style="color:#E5C07B">Options</span><span style="color:#ABB2BF">>;</span></span>
<span class="line"><span style="color:#E06C75">  $</span><span style="color:#ABB2BF">: </span><span style="color:#E06C75">log</span><span style="color:#56B6C2"> =</span><span style="color:#ABB2BF"> $</span><span style="color:#E5C07B">options</span><span style="color:#ABB2BF">.</span><span style="color:#E06C75">log</span><span style="color:#ABB2BF">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD">  let</span><span style="color:#E06C75"> currentTarget</span><span style="color:#ABB2BF">: </span><span style="color:#E5C07B">HTMLElement</span><span style="color:#ABB2BF"> | </span><span style="color:#E5C07B">undefined</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#C678DD">  let</span><span style="color:#E06C75"> startTarget</span><span style="color:#ABB2BF">: </span><span style="color:#E5C07B">HTMLElement</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#C678DD">  let</span><span style="color:#E06C75"> hitTarget</span><span style="color:#ABB2BF">: </span><span style="color:#E5C07B">HTMLElement</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#C678DD">  let</span><span style="color:#E06C75"> hitAnim</span><span style="color:#ABB2BF">: </span><span style="color:#E5C07B">anime</span><span style="color:#ABB2BF">.</span><span style="color:#E5C07B">AnimeInstance</span><span style="color:#ABB2BF"> | </span><span style="color:#E5C07B">undefined</span><span style="color:#ABB2BF">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD">  let</span><span style="color:#E06C75"> spinnerModifier</span><span style="color:#ABB2BF">: </span><span style="color:#E5C07B">HTMLElement</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#C678DD">  let</span><span style="color:#E06C75"> slider1Modifier</span><span style="color:#ABB2BF">: </span><span style="color:#E5C07B">HTMLElement</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#C678DD">  let</span><span style="color:#E06C75"> slider2Modifier</span><span style="color:#ABB2BF">: </span><span style="color:#E5C07B">HTMLElement</span><span style="color:#ABB2BF">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD">  let</span><span style="color:#E06C75"> pulseContainer</span><span style="color:#ABB2BF">: </span><span style="color:#E5C07B">HTMLElement</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#C678DD">  let</span><span style="color:#E06C75"> pulseTemplate</span><span style="color:#ABB2BF">: </span><span style="color:#E5C07B">HTMLElement</span><span style="color:#ABB2BF">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD">  const</span><span style="color:#E5C07B"> NumGoals</span><span style="color:#56B6C2"> =</span><span style="color:#D19A66"> 5</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#C678DD">  let</span><span style="color:#E06C75"> goals</span><span style="color:#ABB2BF">: </span><span style="color:#E5C07B">HTMLElement</span><span style="color:#ABB2BF">[] </span><span style="color:#56B6C2">=</span><span style="color:#ABB2BF"> [];</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic">  /* game state */</span></span>
<span class="line"><span style="color:#C678DD">  const</span><span style="color:#E5C07B"> goalsCompleted</span><span style="color:#56B6C2"> =</span><span style="color:#C678DD"> new</span><span style="color:#61AFEF"> Set</span><span style="color:#ABB2BF">&#x3C;</span><span style="color:#E5C07B">HTMLElement</span><span style="color:#ABB2BF">>();</span></span>
<span class="line"><span style="color:#C678DD">  let</span><span style="color:#E06C75"> courseCompleted</span><span style="color:#56B6C2"> =</span><span style="color:#D19A66"> false</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#C678DD">  let</span><span style="color:#E06C75"> moves</span><span style="color:#56B6C2"> =</span><span style="color:#D19A66"> 0</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#C678DD">  let</span><span style="color:#E06C75"> startTime</span><span style="color:#56B6C2"> =</span><span style="color:#D19A66"> 0</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#C678DD">  let</span><span style="color:#E06C75"> timer</span><span style="color:#56B6C2"> =</span><span style="color:#D19A66"> 0</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#C678DD">  let</span><span style="color:#E06C75"> timerInterval</span><span style="color:#ABB2BF">: </span><span style="color:#E5C07B">NodeJS</span><span style="color:#ABB2BF">.</span><span style="color:#E5C07B">Timeout</span><span style="color:#ABB2BF"> | </span><span style="color:#E5C07B">undefined</span><span style="color:#ABB2BF">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#61AFEF">  onMount</span><span style="color:#ABB2BF">(</span><span style="color:#C678DD">async</span><span style="color:#ABB2BF"> () </span><span style="color:#C678DD">=></span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#C678DD">    await</span><span style="color:#61AFEF"> tick</span><span style="color:#ABB2BF">();</span></span>
<span class="line"><span style="color:#61AFEF">    reset</span><span style="color:#ABB2BF">();</span></span>
<span class="line"><span style="color:#ABB2BF">  });</span></span>
<span class="line"></span>
<span class="line"><span style="color:#61AFEF">  onDestroy</span><span style="color:#ABB2BF">(() </span><span style="color:#C678DD">=></span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#61AFEF">    clearInterval</span><span style="color:#ABB2BF">(</span><span style="color:#E06C75">timerInterval</span><span style="color:#ABB2BF">);</span></span>
<span class="line"><span style="color:#ABB2BF">  });</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD">  function</span><span style="color:#61AFEF"> startTimer</span><span style="color:#ABB2BF">(): </span><span style="color:#E5C07B">void</span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#E06C75">    startTime</span><span style="color:#56B6C2"> =</span><span style="color:#E5C07B"> Date</span><span style="color:#ABB2BF">.</span><span style="color:#61AFEF">now</span><span style="color:#ABB2BF">();</span></span>
<span class="line"><span style="color:#E06C75">    timer</span><span style="color:#56B6C2"> =</span><span style="color:#D19A66"> 0</span><span style="color:#ABB2BF">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#61AFEF">    clearInterval</span><span style="color:#ABB2BF">(</span><span style="color:#E06C75">timerInterval</span><span style="color:#ABB2BF">);</span></span>
<span class="line"><span style="color:#E06C75">    timerInterval</span><span style="color:#56B6C2"> =</span><span style="color:#61AFEF"> setInterval</span><span style="color:#ABB2BF">(() </span><span style="color:#C678DD">=></span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#E06C75">      timer</span><span style="color:#56B6C2"> =</span><span style="color:#E5C07B"> Math</span><span style="color:#ABB2BF">.</span><span style="color:#61AFEF">floor</span><span style="color:#ABB2BF">((</span><span style="color:#E5C07B">Date</span><span style="color:#ABB2BF">.</span><span style="color:#61AFEF">now</span><span style="color:#ABB2BF">() </span><span style="color:#56B6C2">-</span><span style="color:#E06C75"> startTime</span><span style="color:#ABB2BF">) </span><span style="color:#56B6C2">/</span><span style="color:#D19A66"> 1000</span><span style="color:#ABB2BF">);</span></span>
<span class="line"><span style="color:#ABB2BF">    }, </span><span style="color:#D19A66">1000</span><span style="color:#ABB2BF">);</span></span>
<span class="line"><span style="color:#ABB2BF">  }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD">  function</span><span style="color:#61AFEF"> startModifiers</span><span style="color:#ABB2BF">(): </span><span style="color:#E5C07B">void</span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#E5C07B">    anime</span><span style="color:#ABB2BF">.</span><span style="color:#61AFEF">set</span><span style="color:#ABB2BF">(</span><span style="color:#E06C75">spinnerModifier</span><span style="color:#ABB2BF">, {</span></span>
<span class="line"><span style="color:#E06C75">      rotate</span><span style="color:#ABB2BF">: </span><span style="color:#98C379">'0deg'</span><span style="color:#ABB2BF">,</span></span>
<span class="line"><span style="color:#ABB2BF">    });</span></span>
<span class="line"><span style="color:#61AFEF">    anime</span><span style="color:#ABB2BF">({</span></span>
<span class="line"><span style="color:#E06C75">      targets</span><span style="color:#ABB2BF">: </span><span style="color:#E06C75">spinnerModifier</span><span style="color:#ABB2BF">,</span></span>
<span class="line"><span style="color:#E06C75">      duration</span><span style="color:#ABB2BF">: </span><span style="color:#D19A66">3000</span><span style="color:#ABB2BF">,</span></span>
<span class="line"><span style="color:#E06C75">      easing</span><span style="color:#ABB2BF">: </span><span style="color:#98C379">'linear'</span><span style="color:#ABB2BF">,</span></span>
<span class="line"><span style="color:#E06C75">      loop</span><span style="color:#ABB2BF">: </span><span style="color:#D19A66">true</span><span style="color:#ABB2BF">,</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75">      rotate</span><span style="color:#ABB2BF">: </span><span style="color:#98C379">'-360deg'</span><span style="color:#ABB2BF">,</span></span>
<span class="line"><span style="color:#ABB2BF">    });</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E5C07B">    anime</span><span style="color:#ABB2BF">.</span><span style="color:#61AFEF">set</span><span style="color:#ABB2BF">(</span><span style="color:#E06C75">slider1Modifier</span><span style="color:#ABB2BF">, {</span></span>
<span class="line"><span style="color:#E06C75">      rotate</span><span style="color:#ABB2BF">: </span><span style="color:#98C379">'-45deg'</span><span style="color:#ABB2BF">,</span></span>
<span class="line"><span style="color:#E06C75">      translateX</span><span style="color:#ABB2BF">: </span><span style="color:#98C379">'0px'</span><span style="color:#ABB2BF">,</span></span>
<span class="line"><span style="color:#ABB2BF">    });</span></span>
<span class="line"><span style="color:#E5C07B">    anime</span><span style="color:#ABB2BF">.</span><span style="color:#61AFEF">set</span><span style="color:#ABB2BF">(</span><span style="color:#E06C75">slider2Modifier</span><span style="color:#ABB2BF">, {</span></span>
<span class="line"><span style="color:#E06C75">      rotate</span><span style="color:#ABB2BF">: </span><span style="color:#98C379">'225deg'</span><span style="color:#ABB2BF">,</span></span>
<span class="line"><span style="color:#E06C75">      translateX</span><span style="color:#ABB2BF">: </span><span style="color:#98C379">'0px'</span><span style="color:#ABB2BF">,</span></span>
<span class="line"><span style="color:#ABB2BF">    });</span></span>
<span class="line"><span style="color:#C678DD">    const</span><span style="color:#E5C07B"> sliderAnimParams</span><span style="color:#56B6C2"> =</span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#E06C75">      easing</span><span style="color:#ABB2BF">: </span><span style="color:#98C379">'linear'</span><span style="color:#ABB2BF">,</span></span>
<span class="line"><span style="color:#E06C75">      loop</span><span style="color:#ABB2BF">: </span><span style="color:#D19A66">true</span><span style="color:#ABB2BF">,</span></span>
<span class="line"><span style="color:#E06C75">      direction</span><span style="color:#ABB2BF">: </span><span style="color:#98C379">'alternate'</span><span style="color:#ABB2BF">,</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75">      translateX</span><span style="color:#ABB2BF">: </span><span style="color:#98C379">'170px'</span><span style="color:#ABB2BF">,</span></span>
<span class="line"><span style="color:#ABB2BF">    };</span></span>
<span class="line"><span style="color:#61AFEF">    anime</span><span style="color:#ABB2BF">({</span></span>
<span class="line"><span style="color:#E06C75">      targets</span><span style="color:#ABB2BF">: </span><span style="color:#E06C75">slider1Modifier</span><span style="color:#ABB2BF">,</span></span>
<span class="line"><span style="color:#E06C75">      duration</span><span style="color:#ABB2BF">: </span><span style="color:#D19A66">1400</span><span style="color:#ABB2BF">,</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF">      ...</span><span style="color:#E06C75">sliderAnimParams</span><span style="color:#ABB2BF">,</span></span>
<span class="line"><span style="color:#ABB2BF">    });</span></span>
<span class="line"><span style="color:#61AFEF">    anime</span><span style="color:#ABB2BF">({</span></span>
<span class="line"><span style="color:#E06C75">      targets</span><span style="color:#ABB2BF">: </span><span style="color:#E06C75">slider2Modifier</span><span style="color:#ABB2BF">,</span></span>
<span class="line"><span style="color:#E06C75">      duration</span><span style="color:#ABB2BF">: </span><span style="color:#D19A66">700</span><span style="color:#ABB2BF">,</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF">      ...</span><span style="color:#E06C75">sliderAnimParams</span><span style="color:#ABB2BF">,</span></span>
<span class="line"><span style="color:#ABB2BF">    });</span></span>
<span class="line"><span style="color:#ABB2BF">  }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic">  /* game state management */</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD">  function</span><span style="color:#61AFEF"> reset</span><span style="color:#ABB2BF">(): </span><span style="color:#E5C07B">void</span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#E5C07B">    goals</span><span style="color:#ABB2BF">.</span><span style="color:#61AFEF">forEach</span><span style="color:#ABB2BF">((</span><span style="color:#E06C75;font-style:italic">goal</span><span style="color:#ABB2BF">) </span><span style="color:#C678DD">=></span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#E5C07B">      goal</span><span style="color:#ABB2BF">.</span><span style="color:#E5C07B">style</span><span style="color:#ABB2BF">.</span><span style="color:#E06C75">borderStyle</span><span style="color:#56B6C2"> =</span><span style="color:#98C379"> 'solid'</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#E5C07B">      goal</span><span style="color:#ABB2BF">.</span><span style="color:#E5C07B">style</span><span style="color:#ABB2BF">.</span><span style="color:#E06C75">borderColor</span><span style="color:#56B6C2"> =</span><span style="color:#98C379"> '#f00'</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">    });</span></span>
<span class="line"><span style="color:#E5C07B">    goalsCompleted</span><span style="color:#ABB2BF">.</span><span style="color:#61AFEF">clear</span><span style="color:#ABB2BF">();</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75">    moves</span><span style="color:#56B6C2"> =</span><span style="color:#D19A66"> 0</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#61AFEF">    startTimer</span><span style="color:#ABB2BF">();</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75">    courseCompleted</span><span style="color:#56B6C2"> =</span><span style="color:#D19A66"> false</span><span style="color:#ABB2BF">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#61AFEF">    restart</span><span style="color:#ABB2BF">();</span></span>
<span class="line"><span style="color:#ABB2BF">  }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD">  function</span><span style="color:#61AFEF"> restart</span><span style="color:#ABB2BF">(): </span><span style="color:#E5C07B">void</span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#61AFEF">    setCurrentTarget</span><span style="color:#ABB2BF">(</span><span style="color:#E06C75">startTarget</span><span style="color:#ABB2BF">);</span></span>
<span class="line"><span style="color:#61AFEF">    startModifiers</span><span style="color:#ABB2BF">();</span></span>
<span class="line"><span style="color:#ABB2BF">  }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD">  function</span><span style="color:#61AFEF"> countMove</span><span style="color:#ABB2BF">(): </span><span style="color:#E5C07B">void</span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#C678DD">    if</span><span style="color:#ABB2BF"> (</span><span style="color:#E06C75">courseCompleted</span><span style="color:#ABB2BF">) {</span></span>
<span class="line"><span style="color:#C678DD">      return</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">    }</span></span>
<span class="line"><span style="color:#E06C75">    moves</span><span style="color:#56B6C2">++</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">  }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD">  function</span><span style="color:#61AFEF"> styleGoalCompleted</span><span style="color:#ABB2BF">(</span><span style="color:#E06C75;font-style:italic">goal</span><span style="color:#ABB2BF">: </span><span style="color:#E5C07B">HTMLElement</span><span style="color:#ABB2BF">): </span><span style="color:#E5C07B">void</span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#E5C07B">    goal</span><span style="color:#ABB2BF">.</span><span style="color:#E5C07B">style</span><span style="color:#ABB2BF">.</span><span style="color:#E06C75">borderStyle</span><span style="color:#56B6C2"> =</span><span style="color:#98C379"> 'dotted'</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#E5C07B">    goal</span><span style="color:#ABB2BF">.</span><span style="color:#E5C07B">style</span><span style="color:#ABB2BF">.</span><span style="color:#E06C75">borderColor</span><span style="color:#56B6C2"> =</span><span style="color:#98C379"> '#32cd32'</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">  }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD">  function</span><span style="color:#61AFEF"> markGoalCompleted</span><span style="color:#ABB2BF">(</span><span style="color:#E06C75;font-style:italic">goal</span><span style="color:#ABB2BF">: </span><span style="color:#E5C07B">HTMLElement</span><span style="color:#ABB2BF">): </span><span style="color:#E5C07B">void</span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#E5C07B">    goalsCompleted</span><span style="color:#ABB2BF">.</span><span style="color:#61AFEF">add</span><span style="color:#ABB2BF">(</span><span style="color:#E06C75">goal</span><span style="color:#ABB2BF">);</span></span>
<span class="line"><span style="color:#61AFEF">    checkCourseCompleted</span><span style="color:#ABB2BF">();</span></span>
<span class="line"><span style="color:#ABB2BF">  }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD">  function</span><span style="color:#61AFEF"> checkCourseCompleted</span><span style="color:#ABB2BF">(): </span><span style="color:#E5C07B">void</span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#C678DD">    if</span><span style="color:#ABB2BF"> (</span><span style="color:#E06C75">courseCompleted</span><span style="color:#ABB2BF">) {</span></span>
<span class="line"><span style="color:#C678DD">      return</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">    }</span></span>
<span class="line"><span style="color:#C678DD">    if</span><span style="color:#ABB2BF"> (</span><span style="color:#E5C07B">goalsCompleted</span><span style="color:#ABB2BF">.</span><span style="color:#E06C75">size</span><span style="color:#56B6C2"> ===</span><span style="color:#E06C75"> NumGoals</span><span style="color:#ABB2BF">) {</span></span>
<span class="line"><span style="color:#61AFEF">      markCourseCompleted</span><span style="color:#ABB2BF">();</span></span>
<span class="line"><span style="color:#ABB2BF">    }</span></span>
<span class="line"><span style="color:#ABB2BF">  }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD">  function</span><span style="color:#61AFEF"> markCourseCompleted</span><span style="color:#ABB2BF">(): </span><span style="color:#E5C07B">void</span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#E06C75">    courseCompleted</span><span style="color:#56B6C2"> =</span><span style="color:#D19A66"> true</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#61AFEF">    clearInterval</span><span style="color:#ABB2BF">(</span><span style="color:#E06C75">timerInterval</span><span style="color:#ABB2BF">);</span></span>
<span class="line"><span style="color:#E06C75">    timer</span><span style="color:#56B6C2"> =</span><span style="color:#ABB2BF"> (</span><span style="color:#E5C07B">Date</span><span style="color:#ABB2BF">.</span><span style="color:#61AFEF">now</span><span style="color:#ABB2BF">() </span><span style="color:#56B6C2">-</span><span style="color:#E06C75"> startTime</span><span style="color:#ABB2BF">) </span><span style="color:#56B6C2">/</span><span style="color:#D19A66"> 1000</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">  }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD">  function</span><span style="color:#61AFEF"> setCurrentTarget</span><span style="color:#ABB2BF">(</span><span style="color:#E06C75;font-style:italic">target</span><span style="color:#ABB2BF">: </span><span style="color:#E5C07B">HTMLElement</span><span style="color:#ABB2BF">): </span><span style="color:#E5C07B">void</span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#C678DD">    if</span><span style="color:#ABB2BF"> (</span><span style="color:#E06C75">currentTarget</span><span style="color:#ABB2BF">) {</span></span>
<span class="line"><span style="color:#E5C07B">      currentTarget</span><span style="color:#ABB2BF">.</span><span style="color:#E5C07B">style</span><span style="color:#ABB2BF">.</span><span style="color:#E06C75">opacity</span><span style="color:#56B6C2"> =</span><span style="color:#98C379"> '0'</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">    }</span></span>
<span class="line"><span style="color:#E5C07B">    target</span><span style="color:#ABB2BF">.</span><span style="color:#E5C07B">style</span><span style="color:#ABB2BF">.</span><span style="color:#E06C75">opacity</span><span style="color:#56B6C2"> =</span><span style="color:#98C379"> '1'</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#E06C75">    currentTarget</span><span style="color:#56B6C2"> =</span><span style="color:#E06C75"> target</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">  }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD">  function</span><span style="color:#61AFEF"> activateModifier</span><span style="color:#ABB2BF">(</span><span style="color:#E06C75;font-style:italic">modifier</span><span style="color:#ABB2BF">: </span><span style="color:#E5C07B">HTMLElement</span><span style="color:#ABB2BF">): </span><span style="color:#E5C07B">void</span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#C678DD">    if</span><span style="color:#ABB2BF"> (</span><span style="color:#E06C75">hitAnim</span><span style="color:#ABB2BF">) </span><span style="color:#C678DD">return</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#C678DD">    if</span><span style="color:#ABB2BF"> (</span><span style="color:#56B6C2">!</span><span style="color:#E06C75">currentTarget</span><span style="color:#ABB2BF">) </span><span style="color:#C678DD">return</span><span style="color:#ABB2BF">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#61AFEF">    animateClonedpulse</span><span style="color:#ABB2BF">(</span><span style="color:#E06C75">currentTarget</span><span style="color:#ABB2BF">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD">    const</span><span style="color:#E5C07B"> nextTarget</span><span style="color:#56B6C2"> =</span><span style="color:#E5C07B"> modifier</span><span style="color:#ABB2BF">.</span><span style="color:#E06C75">firstElementChild</span><span style="color:#C678DD"> as</span><span style="color:#E5C07B"> HTMLElement</span><span style="color:#ABB2BF">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD">    if</span><span style="color:#ABB2BF"> (</span><span style="color:#E5C07B">currentTarget</span><span style="color:#ABB2BF">.</span><span style="color:#61AFEF">isSameNode</span><span style="color:#ABB2BF">(</span><span style="color:#E06C75">nextTarget</span><span style="color:#ABB2BF">)) {</span></span>
<span class="line"><span style="color:#61AFEF">      attemptAllgoals</span><span style="color:#ABB2BF">();</span></span>
<span class="line"><span style="color:#C678DD">      return</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#61AFEF">    moveToModifier</span><span style="color:#ABB2BF">(</span><span style="color:#E06C75">modifier</span><span style="color:#ABB2BF">);</span></span>
<span class="line"><span style="color:#ABB2BF">  }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic">  // match modifier's target to current target's projection</span></span>
<span class="line"><span style="color:#C678DD">  function</span><span style="color:#61AFEF"> moveToModifier</span><span style="color:#ABB2BF">(</span><span style="color:#E06C75;font-style:italic">modifier</span><span style="color:#ABB2BF">: </span><span style="color:#E5C07B">HTMLElement</span><span style="color:#ABB2BF">): </span><span style="color:#E5C07B">void</span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#C678DD">    const</span><span style="color:#E5C07B"> nextTarget</span><span style="color:#56B6C2"> =</span><span style="color:#E5C07B"> modifier</span><span style="color:#ABB2BF">.</span><span style="color:#E06C75">firstElementChild</span><span style="color:#C678DD"> as</span><span style="color:#E5C07B"> HTMLElement</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#C678DD">    const</span><span style="color:#ABB2BF"> { </span><span style="color:#E5C07B">toSubject</span><span style="color:#ABB2BF"> } </span><span style="color:#56B6C2">=</span><span style="color:#61AFEF"> getProjection</span><span style="color:#ABB2BF">(</span><span style="color:#E06C75">currentTarget</span><span style="color:#56B6C2">!</span><span style="color:#ABB2BF">, </span><span style="color:#E06C75">nextTarget</span><span style="color:#ABB2BF">, { </span><span style="color:#E06C75">log</span><span style="color:#ABB2BF"> });</span></span>
<span class="line"><span style="color:#61AFEF">    setInlineStyles</span><span style="color:#ABB2BF">(</span><span style="color:#E06C75">nextTarget</span><span style="color:#ABB2BF">, </span><span style="color:#E06C75">toSubject</span><span style="color:#ABB2BF">);</span></span>
<span class="line"><span style="color:#61AFEF">    setCurrentTarget</span><span style="color:#ABB2BF">(</span><span style="color:#E06C75">nextTarget</span><span style="color:#ABB2BF">);</span></span>
<span class="line"><span style="color:#ABB2BF">  }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD">  function</span><span style="color:#61AFEF"> attemptAllgoals</span><span style="color:#ABB2BF">(): </span><span style="color:#E5C07B">void</span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#E5C07B">    goals</span><span style="color:#ABB2BF">.</span><span style="color:#61AFEF">forEach</span><span style="color:#ABB2BF">((</span><span style="color:#E06C75;font-style:italic">goal</span><span style="color:#ABB2BF">) </span><span style="color:#C678DD">=></span><span style="color:#61AFEF"> attemptGoalHit</span><span style="color:#ABB2BF">(</span><span style="color:#E06C75">goal</span><span style="color:#ABB2BF">, </span><span style="color:#D19A66">false</span><span style="color:#ABB2BF">));</span></span>
<span class="line"><span style="color:#ABB2BF">  }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD">  function</span><span style="color:#61AFEF"> attemptGoalHit</span><span style="color:#ABB2BF">(</span><span style="color:#E06C75;font-style:italic">goal</span><span style="color:#ABB2BF">: </span><span style="color:#E5C07B">HTMLElement</span><span style="color:#ABB2BF">, </span><span style="color:#E06C75;font-style:italic">goalClicked</span><span style="color:#56B6C2"> =</span><span style="color:#D19A66"> true</span><span style="color:#ABB2BF">): </span><span style="color:#E5C07B">void</span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#C678DD">    const</span><span style="color:#E5C07B"> hit</span><span style="color:#56B6C2"> =</span><span style="color:#61AFEF"> checkIfTolerancesHit</span><span style="color:#ABB2BF">(</span><span style="color:#E06C75">goal</span><span style="color:#ABB2BF">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD">    if</span><span style="color:#ABB2BF"> (</span><span style="color:#E06C75">hit</span><span style="color:#ABB2BF">) {</span></span>
<span class="line"><span style="color:#61AFEF">      markGoalCompleted</span><span style="color:#ABB2BF">(</span><span style="color:#E06C75">goal</span><span style="color:#ABB2BF">);</span></span>
<span class="line"><span style="color:#61AFEF">      animateHit</span><span style="color:#ABB2BF">(</span><span style="color:#E06C75">goal</span><span style="color:#ABB2BF">);</span></span>
<span class="line"><span style="color:#ABB2BF">    } </span><span style="color:#C678DD">else</span><span style="color:#C678DD"> if</span><span style="color:#ABB2BF"> (</span><span style="color:#E06C75">goalClicked</span><span style="color:#ABB2BF">) {</span></span>
<span class="line"><span style="color:#61AFEF">      animateMiss</span><span style="color:#ABB2BF">(</span><span style="color:#E06C75">goal</span><span style="color:#ABB2BF">);</span></span>
<span class="line"><span style="color:#ABB2BF">    }</span></span>
<span class="line"><span style="color:#ABB2BF">  }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD">  const</span><span style="color:#E5C07B"> distanceTolerancePx</span><span style="color:#56B6C2"> =</span><span style="color:#D19A66"> 10</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#C678DD">  const</span><span style="color:#E5C07B"> rotationToleranceDeg</span><span style="color:#56B6C2"> =</span><span style="color:#D19A66"> 8</span><span style="color:#ABB2BF">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD">  function</span><span style="color:#61AFEF"> checkIfTolerancesHit</span><span style="color:#ABB2BF">(</span><span style="color:#E06C75;font-style:italic">goal</span><span style="color:#ABB2BF">: </span><span style="color:#E5C07B">HTMLElement</span><span style="color:#ABB2BF">): </span><span style="color:#E5C07B">boolean</span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#C678DD">    const</span><span style="color:#E5C07B"> goalAcr</span><span style="color:#56B6C2"> =</span><span style="color:#61AFEF"> getActualClientRect</span><span style="color:#ABB2BF">(</span><span style="color:#E06C75">goal</span><span style="color:#ABB2BF">, {</span></span>
<span class="line"><span style="color:#E06C75">      bakePositionIntoTransform</span><span style="color:#ABB2BF">: </span><span style="color:#D19A66">true</span><span style="color:#ABB2BF">,</span></span>
<span class="line"><span style="color:#ABB2BF">    });</span></span>
<span class="line"><span style="color:#C678DD">    const</span><span style="color:#E5C07B"> currentAcr</span><span style="color:#56B6C2"> =</span><span style="color:#61AFEF"> getActualClientRect</span><span style="color:#ABB2BF">(</span><span style="color:#E06C75">currentTarget</span><span style="color:#56B6C2">!</span><span style="color:#ABB2BF">, {</span></span>
<span class="line"><span style="color:#E06C75">      bakePositionIntoTransform</span><span style="color:#ABB2BF">: </span><span style="color:#D19A66">true</span><span style="color:#ABB2BF">,</span></span>
<span class="line"><span style="color:#ABB2BF">    });</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD">    const</span><span style="color:#E5C07B"> Mvc</span><span style="color:#56B6C2"> =</span><span style="color:#E5C07B"> currentAcr</span><span style="color:#ABB2BF">.</span><span style="color:#E06C75">transformMat4</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#C678DD">    const</span><span style="color:#E5C07B"> Mcv</span><span style="color:#56B6C2"> =</span><span style="color:#E5C07B"> mat4</span><span style="color:#ABB2BF">.</span><span style="color:#61AFEF">create</span><span style="color:#ABB2BF">();</span></span>
<span class="line"><span style="color:#E5C07B">    mat4</span><span style="color:#ABB2BF">.</span><span style="color:#61AFEF">invert</span><span style="color:#ABB2BF">(</span><span style="color:#E06C75">Mcv</span><span style="color:#ABB2BF">, </span><span style="color:#E06C75">Mvc</span><span style="color:#ABB2BF">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD">    const</span><span style="color:#E5C07B"> Mvg</span><span style="color:#56B6C2"> =</span><span style="color:#E5C07B"> goalAcr</span><span style="color:#ABB2BF">.</span><span style="color:#E06C75">transformMat4</span><span style="color:#ABB2BF">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD">    const</span><span style="color:#E5C07B"> Mcg</span><span style="color:#56B6C2"> =</span><span style="color:#E5C07B"> mat4</span><span style="color:#ABB2BF">.</span><span style="color:#61AFEF">create</span><span style="color:#ABB2BF">();</span></span>
<span class="line"><span style="color:#E5C07B">    mat4</span><span style="color:#ABB2BF">.</span><span style="color:#61AFEF">multiply</span><span style="color:#ABB2BF">(</span><span style="color:#E06C75">Mcg</span><span style="color:#ABB2BF">, </span><span style="color:#E06C75">Mcv</span><span style="color:#ABB2BF">, </span><span style="color:#E06C75">Mvg</span><span style="color:#ABB2BF">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic">    // check distance</span></span>
<span class="line"><span style="color:#C678DD">    const</span><span style="color:#E5C07B"> distancePx</span><span style="color:#56B6C2"> =</span><span style="color:#E5C07B"> Math</span><span style="color:#ABB2BF">.</span><span style="color:#61AFEF">sqrt</span><span style="color:#ABB2BF">(</span><span style="color:#E06C75">Mcg</span><span style="color:#ABB2BF">[</span><span style="color:#D19A66">12</span><span style="color:#ABB2BF">] </span><span style="color:#56B6C2">*</span><span style="color:#E06C75"> Mcg</span><span style="color:#ABB2BF">[</span><span style="color:#D19A66">12</span><span style="color:#ABB2BF">] </span><span style="color:#56B6C2">+</span><span style="color:#E06C75"> Mcg</span><span style="color:#ABB2BF">[</span><span style="color:#D19A66">13</span><span style="color:#ABB2BF">] </span><span style="color:#56B6C2">*</span><span style="color:#E06C75"> Mcg</span><span style="color:#ABB2BF">[</span><span style="color:#D19A66">13</span><span style="color:#ABB2BF">]);</span></span>
<span class="line"><span style="color:#C678DD">    if</span><span style="color:#ABB2BF"> (</span><span style="color:#E06C75">distancePx</span><span style="color:#56B6C2"> ></span><span style="color:#E06C75"> distanceTolerancePx</span><span style="color:#ABB2BF">) {</span></span>
<span class="line"><span style="color:#C678DD">      return</span><span style="color:#D19A66"> false</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD">    const</span><span style="color:#E5C07B"> rotationQuat</span><span style="color:#56B6C2"> =</span><span style="color:#E5C07B"> quat</span><span style="color:#ABB2BF">.</span><span style="color:#61AFEF">create</span><span style="color:#ABB2BF">();</span></span>
<span class="line"><span style="color:#E5C07B">    mat4</span><span style="color:#ABB2BF">.</span><span style="color:#61AFEF">getRotation</span><span style="color:#ABB2BF">(</span><span style="color:#E06C75">rotationQuat</span><span style="color:#ABB2BF">, </span><span style="color:#E06C75">Mcg</span><span style="color:#ABB2BF">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD">    const</span><span style="color:#E5C07B"> rotationVec3</span><span style="color:#56B6C2"> =</span><span style="color:#E5C07B"> vec3</span><span style="color:#ABB2BF">.</span><span style="color:#61AFEF">create</span><span style="color:#ABB2BF">();</span></span>
<span class="line"><span style="color:#C678DD">    const</span><span style="color:#E5C07B"> rotationDeg</span><span style="color:#56B6C2"> =</span><span style="color:#ABB2BF"> (</span><span style="color:#E5C07B">quat</span><span style="color:#ABB2BF">.</span><span style="color:#61AFEF">getAxisAngle</span><span style="color:#ABB2BF">(</span><span style="color:#E06C75">rotationVec3</span><span style="color:#ABB2BF">, </span><span style="color:#E06C75">rotationQuat</span><span style="color:#ABB2BF">) </span><span style="color:#56B6C2">*</span><span style="color:#D19A66"> 180</span><span style="color:#ABB2BF">) </span><span style="color:#56B6C2">/</span><span style="color:#E5C07B"> Math</span><span style="color:#ABB2BF">.</span><span style="color:#E06C75">PI</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#C678DD">    const</span><span style="color:#E5C07B"> rotationDiff</span><span style="color:#56B6C2"> =</span><span style="color:#D19A66"> 45</span><span style="color:#56B6C2"> -</span><span style="color:#E5C07B"> Math</span><span style="color:#ABB2BF">.</span><span style="color:#61AFEF">abs</span><span style="color:#ABB2BF">((</span><span style="color:#E06C75">rotationDeg</span><span style="color:#56B6C2"> %</span><span style="color:#D19A66"> 90</span><span style="color:#ABB2BF">) </span><span style="color:#56B6C2">-</span><span style="color:#D19A66"> 45</span><span style="color:#ABB2BF">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic">    // check rotation</span></span>
<span class="line"><span style="color:#C678DD">    if</span><span style="color:#ABB2BF"> (</span><span style="color:#E06C75">rotationDiff</span><span style="color:#56B6C2"> ></span><span style="color:#E06C75"> rotationToleranceDeg</span><span style="color:#ABB2BF">) {</span></span>
<span class="line"><span style="color:#C678DD">      return</span><span style="color:#D19A66"> false</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD">    return</span><span style="color:#D19A66"> true</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">  }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic">  /* animations */</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD">  function</span><span style="color:#61AFEF"> animateHit</span><span style="color:#ABB2BF">(</span><span style="color:#E06C75;font-style:italic">goal</span><span style="color:#ABB2BF">: </span><span style="color:#E5C07B">HTMLElement</span><span style="color:#ABB2BF">): </span><span style="color:#E5C07B">void</span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic">    // match hit target to current target</span></span>
<span class="line"><span style="color:#C678DD">    const</span><span style="color:#ABB2BF"> { </span><span style="color:#E5C07B">toSubject</span><span style="color:#ABB2BF"> } </span><span style="color:#56B6C2">=</span><span style="color:#61AFEF"> getProjection</span><span style="color:#ABB2BF">(</span><span style="color:#E06C75">currentTarget</span><span style="color:#56B6C2">!</span><span style="color:#ABB2BF">, </span><span style="color:#E06C75">hitTarget</span><span style="color:#ABB2BF">, { </span><span style="color:#E06C75">log</span><span style="color:#ABB2BF"> });</span></span>
<span class="line"><span style="color:#61AFEF">    setInlineStyles</span><span style="color:#ABB2BF">(</span><span style="color:#E06C75">hitTarget</span><span style="color:#ABB2BF">, </span><span style="color:#E06C75">toSubject</span><span style="color:#ABB2BF">);</span></span>
<span class="line"><span style="color:#61AFEF">    setCurrentTarget</span><span style="color:#ABB2BF">(</span><span style="color:#E06C75">hitTarget</span><span style="color:#ABB2BF">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic">    // animate hit target rest of way to goal</span></span>
<span class="line"><span style="color:#E06C75">    hitAnim</span><span style="color:#56B6C2"> =</span><span style="color:#61AFEF"> anime</span><span style="color:#ABB2BF">({</span></span>
<span class="line"><span style="color:#E06C75">      targets</span><span style="color:#ABB2BF">: </span><span style="color:#E06C75">hitTarget</span><span style="color:#ABB2BF">,</span></span>
<span class="line"><span style="color:#E06C75">      duration</span><span style="color:#ABB2BF">: </span><span style="color:#D19A66">300</span><span style="color:#ABB2BF">,</span></span>
<span class="line"><span style="color:#E06C75">      easing</span><span style="color:#ABB2BF">: </span><span style="color:#98C379">'easeOutQuad'</span><span style="color:#ABB2BF">,</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic">      // anime.js takes matrix3d</span></span>
<span class="line"><span style="color:#ABB2BF">      ...</span><span style="color:#61AFEF">getProjection</span><span style="color:#ABB2BF">(</span><span style="color:#E06C75">goal</span><span style="color:#ABB2BF">, </span><span style="color:#E06C75">hitTarget</span><span style="color:#ABB2BF">, { </span><span style="color:#E06C75">transformType</span><span style="color:#ABB2BF">: </span><span style="color:#98C379">'matrix3d'</span><span style="color:#ABB2BF">, </span><span style="color:#E06C75">log</span><span style="color:#ABB2BF"> }).</span><span style="color:#E06C75">toSubject</span><span style="color:#ABB2BF">,</span></span>
<span class="line"></span>
<span class="line"><span style="color:#61AFEF">      complete</span><span style="color:#ABB2BF">: () </span><span style="color:#C678DD">=></span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#61AFEF">        styleGoalCompleted</span><span style="color:#ABB2BF">(</span><span style="color:#E06C75">goal</span><span style="color:#ABB2BF">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#61AFEF">        animateClonedpulse</span><span style="color:#ABB2BF">(</span><span style="color:#E06C75">hitTarget</span><span style="color:#ABB2BF">);</span></span>
<span class="line"><span style="color:#61AFEF">        setTimeout</span><span style="color:#ABB2BF">(() </span><span style="color:#C678DD">=></span><span style="color:#61AFEF"> animateClonedpulse</span><span style="color:#ABB2BF">(</span><span style="color:#E06C75">hitTarget</span><span style="color:#ABB2BF">), </span><span style="color:#D19A66">350</span><span style="color:#ABB2BF">);</span></span>
<span class="line"><span style="color:#61AFEF">        setTimeout</span><span style="color:#ABB2BF">(() </span><span style="color:#C678DD">=></span><span style="color:#61AFEF"> animateClonedpulse</span><span style="color:#ABB2BF">(</span><span style="color:#E06C75">hitTarget</span><span style="color:#ABB2BF">), </span><span style="color:#D19A66">700</span><span style="color:#ABB2BF">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75">        hitAnim</span><span style="color:#56B6C2"> =</span><span style="color:#D19A66"> undefined</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">      },</span></span>
<span class="line"><span style="color:#ABB2BF">    });</span></span>
<span class="line"><span style="color:#ABB2BF">  }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD">  function</span><span style="color:#61AFEF"> animateMiss</span><span style="color:#ABB2BF">(</span><span style="color:#E06C75;font-style:italic">goal</span><span style="color:#ABB2BF">: </span><span style="color:#E5C07B">HTMLElement</span><span style="color:#ABB2BF">): </span><span style="color:#E5C07B">void</span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#E5C07B">    goal</span><span style="color:#ABB2BF">.</span><span style="color:#E5C07B">style</span><span style="color:#ABB2BF">.</span><span style="color:#E06C75">backgroundColor</span><span style="color:#56B6C2"> =</span><span style="color:#98C379"> 'rgba(255, 0, 0, 1)'</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#61AFEF">    anime</span><span style="color:#ABB2BF">({</span></span>
<span class="line"><span style="color:#E06C75">      targets</span><span style="color:#ABB2BF">: </span><span style="color:#E06C75">goal</span><span style="color:#ABB2BF">,</span></span>
<span class="line"><span style="color:#E06C75">      duration</span><span style="color:#ABB2BF">: </span><span style="color:#D19A66">300</span><span style="color:#ABB2BF">,</span></span>
<span class="line"><span style="color:#E06C75">      easing</span><span style="color:#ABB2BF">: </span><span style="color:#98C379">'easeOutQuad'</span><span style="color:#ABB2BF">,</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75">      backgroundColor</span><span style="color:#ABB2BF">: </span><span style="color:#98C379">'rgba(255, 0, 0, 0)'</span><span style="color:#ABB2BF">,</span></span>
<span class="line"><span style="color:#ABB2BF">    });</span></span>
<span class="line"><span style="color:#ABB2BF">  }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD">  function</span><span style="color:#61AFEF"> animateClonedpulse</span><span style="color:#ABB2BF">(</span><span style="color:#E06C75;font-style:italic">subject</span><span style="color:#ABB2BF">: </span><span style="color:#E5C07B">HTMLElement</span><span style="color:#ABB2BF">): </span><span style="color:#E5C07B">void</span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#C678DD">    const</span><span style="color:#E5C07B"> pulseClone</span><span style="color:#56B6C2"> =</span><span style="color:#E5C07B"> pulseTemplate</span><span style="color:#ABB2BF">.</span><span style="color:#61AFEF">cloneNode</span><span style="color:#ABB2BF">() </span><span style="color:#C678DD">as</span><span style="color:#E5C07B"> HTMLElement</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#E5C07B">    pulseContainer</span><span style="color:#ABB2BF">.</span><span style="color:#61AFEF">append</span><span style="color:#ABB2BF">(</span><span style="color:#E06C75">pulseClone</span><span style="color:#ABB2BF">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD">    const</span><span style="color:#ABB2BF"> { </span><span style="color:#E5C07B">toSubject</span><span style="color:#ABB2BF"> } </span><span style="color:#56B6C2">=</span><span style="color:#61AFEF"> getProjection</span><span style="color:#ABB2BF">(</span><span style="color:#E06C75">subject</span><span style="color:#ABB2BF">, </span><span style="color:#E06C75">pulseClone</span><span style="color:#ABB2BF">, { </span><span style="color:#E06C75">log</span><span style="color:#ABB2BF"> });</span></span>
<span class="line"><span style="color:#61AFEF">    setInlineStyles</span><span style="color:#ABB2BF">(</span><span style="color:#E06C75">pulseClone</span><span style="color:#ABB2BF">, </span><span style="color:#E06C75">toSubject</span><span style="color:#ABB2BF">);</span></span>
<span class="line"><span style="color:#E5C07B">    pulseClone</span><span style="color:#ABB2BF">.</span><span style="color:#E5C07B">style</span><span style="color:#ABB2BF">.</span><span style="color:#E06C75">opacity</span><span style="color:#56B6C2"> =</span><span style="color:#98C379"> '1'</span><span style="color:#ABB2BF">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#61AFEF">    anime</span><span style="color:#ABB2BF">({</span></span>
<span class="line"><span style="color:#E06C75">      targets</span><span style="color:#ABB2BF">: </span><span style="color:#E06C75">pulseClone</span><span style="color:#ABB2BF">,</span></span>
<span class="line"><span style="color:#E06C75">      duration</span><span style="color:#ABB2BF">: </span><span style="color:#D19A66">300</span><span style="color:#ABB2BF">,</span></span>
<span class="line"><span style="color:#E06C75">      easing</span><span style="color:#ABB2BF">: </span><span style="color:#98C379">'easeOutQuad'</span><span style="color:#ABB2BF">,</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75">      outlineOffset</span><span style="color:#ABB2BF">: </span><span style="color:#98C379">'18px'</span><span style="color:#ABB2BF">,</span></span>
<span class="line"><span style="color:#E06C75">      outlineColor</span><span style="color:#ABB2BF">: </span><span style="color:#98C379">'rgba(50, 205, 50, 0)'</span><span style="color:#ABB2BF">,</span></span>
<span class="line"></span>
<span class="line"><span style="color:#61AFEF">      complete</span><span style="color:#ABB2BF">: () </span><span style="color:#C678DD">=></span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#E5C07B">        pulseClone</span><span style="color:#ABB2BF">.</span><span style="color:#61AFEF">remove</span><span style="color:#ABB2BF">();</span></span>
<span class="line"><span style="color:#ABB2BF">      },</span></span>
<span class="line"><span style="color:#ABB2BF">    });</span></span>
<span class="line"><span style="color:#ABB2BF">  }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic">  /* input handling */</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic">  // prevent holding keys down</span></span>
<span class="line"><span style="color:#C678DD">  const</span><span style="color:#E5C07B"> keysDownBad</span><span style="color:#ABB2BF">: </span><span style="color:#E5C07B">Record</span><span style="color:#ABB2BF">&#x3C;</span><span style="color:#E5C07B">string</span><span style="color:#ABB2BF">, </span><span style="color:#E5C07B">boolean</span><span style="color:#ABB2BF">> </span><span style="color:#56B6C2">=</span><span style="color:#ABB2BF"> {};</span></span>
<span class="line"><span style="color:#C678DD">  function</span><span style="color:#61AFEF"> liftKey</span><span style="color:#ABB2BF">(</span><span style="color:#E06C75;font-style:italic">key</span><span style="color:#ABB2BF">: </span><span style="color:#E5C07B">string</span><span style="color:#ABB2BF">): </span><span style="color:#E5C07B">void</span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#E06C75">    keysDownBad</span><span style="color:#ABB2BF">[</span><span style="color:#E06C75">key</span><span style="color:#ABB2BF">] </span><span style="color:#56B6C2">=</span><span style="color:#D19A66"> false</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">  }</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic">  // presses key; returns true if key was already down bad</span></span>
<span class="line"><span style="color:#C678DD">  function</span><span style="color:#61AFEF"> pressKeyDownBad</span><span style="color:#ABB2BF">(</span><span style="color:#E06C75;font-style:italic">key</span><span style="color:#ABB2BF">: </span><span style="color:#E5C07B">string</span><span style="color:#ABB2BF">): </span><span style="color:#E5C07B">boolean</span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#C678DD">    if</span><span style="color:#ABB2BF"> (</span><span style="color:#E06C75">keysDownBad</span><span style="color:#ABB2BF">[</span><span style="color:#E06C75">key</span><span style="color:#ABB2BF">]) {</span></span>
<span class="line"><span style="color:#C678DD">      return</span><span style="color:#D19A66"> true</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">    }</span></span>
<span class="line"><span style="color:#E06C75">    keysDownBad</span><span style="color:#ABB2BF">[</span><span style="color:#E06C75">key</span><span style="color:#ABB2BF">] </span><span style="color:#56B6C2">=</span><span style="color:#D19A66"> true</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#C678DD">    return</span><span style="color:#D19A66"> false</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">  }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD">  function</span><span style="color:#61AFEF"> isEnterKey</span><span style="color:#ABB2BF">(</span><span style="color:#E06C75;font-style:italic">key</span><span style="color:#ABB2BF">: </span><span style="color:#E5C07B">string</span><span style="color:#ABB2BF">): </span><span style="color:#E5C07B">boolean</span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#C678DD">    if</span><span style="color:#ABB2BF"> ([</span><span style="color:#98C379">'Enter'</span><span style="color:#ABB2BF">, </span><span style="color:#98C379">' '</span><span style="color:#ABB2BF">].</span><span style="color:#61AFEF">includes</span><span style="color:#ABB2BF">(</span><span style="color:#E06C75">key</span><span style="color:#ABB2BF">)) </span><span style="color:#C678DD">return</span><span style="color:#D19A66"> true</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#C678DD">    return</span><span style="color:#D19A66"> false</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">  }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD">  function</span><span style="color:#61AFEF"> handleWindowKeyUp</span><span style="color:#ABB2BF">(</span><span style="color:#E06C75;font-style:italic">key</span><span style="color:#ABB2BF">: </span><span style="color:#E5C07B">string</span><span style="color:#ABB2BF">): </span><span style="color:#E5C07B">void</span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#61AFEF">    liftKey</span><span style="color:#ABB2BF">(</span><span style="color:#E06C75">key</span><span style="color:#ABB2BF">);</span></span>
<span class="line"><span style="color:#ABB2BF">  }</span></span>
<span class="line"><span style="color:#C678DD">  function</span><span style="color:#61AFEF"> handleWindowKeyDown</span><span style="color:#ABB2BF">(</span><span style="color:#E06C75;font-style:italic">key</span><span style="color:#ABB2BF">: </span><span style="color:#E5C07B">string</span><span style="color:#ABB2BF">): </span><span style="color:#E5C07B">void</span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#C678DD">    if</span><span style="color:#ABB2BF"> (</span><span style="color:#61AFEF">isEnterKey</span><span style="color:#ABB2BF">(</span><span style="color:#E06C75">key</span><span style="color:#ABB2BF">)) {</span></span>
<span class="line"><span style="color:#C678DD">      return</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">    }</span></span>
<span class="line"><span style="color:#C678DD">    if</span><span style="color:#ABB2BF"> (</span><span style="color:#61AFEF">pressKeyDownBad</span><span style="color:#ABB2BF">(</span><span style="color:#E06C75">key</span><span style="color:#ABB2BF">)) {</span></span>
<span class="line"><span style="color:#C678DD">      return</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD">    switch</span><span style="color:#ABB2BF"> (</span><span style="color:#E06C75">key</span><span style="color:#ABB2BF">) {</span></span>
<span class="line"><span style="color:#C678DD">      case</span><span style="color:#98C379"> '1'</span><span style="color:#ABB2BF">:</span></span>
<span class="line"><span style="color:#61AFEF">        countMove</span><span style="color:#ABB2BF">();</span></span>
<span class="line"><span style="color:#61AFEF">        activateModifier</span><span style="color:#ABB2BF">(</span><span style="color:#E06C75">spinnerModifier</span><span style="color:#ABB2BF">);</span></span>
<span class="line"><span style="color:#E5C07B">        spinnerModifier</span><span style="color:#ABB2BF">.</span><span style="color:#61AFEF">focus</span><span style="color:#ABB2BF">();</span></span>
<span class="line"><span style="color:#C678DD">        return</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#C678DD">      case</span><span style="color:#98C379"> '2'</span><span style="color:#ABB2BF">:</span></span>
<span class="line"><span style="color:#61AFEF">        countMove</span><span style="color:#ABB2BF">();</span></span>
<span class="line"><span style="color:#61AFEF">        activateModifier</span><span style="color:#ABB2BF">(</span><span style="color:#E06C75">slider1Modifier</span><span style="color:#ABB2BF">);</span></span>
<span class="line"><span style="color:#E5C07B">        slider1Modifier</span><span style="color:#ABB2BF">.</span><span style="color:#61AFEF">focus</span><span style="color:#ABB2BF">();</span></span>
<span class="line"><span style="color:#C678DD">        return</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#C678DD">      case</span><span style="color:#98C379"> '3'</span><span style="color:#ABB2BF">:</span></span>
<span class="line"><span style="color:#61AFEF">        countMove</span><span style="color:#ABB2BF">();</span></span>
<span class="line"><span style="color:#61AFEF">        activateModifier</span><span style="color:#ABB2BF">(</span><span style="color:#E06C75">slider2Modifier</span><span style="color:#ABB2BF">);</span></span>
<span class="line"><span style="color:#E5C07B">        slider2Modifier</span><span style="color:#ABB2BF">.</span><span style="color:#61AFEF">focus</span><span style="color:#ABB2BF">();</span></span>
<span class="line"><span style="color:#C678DD">        return</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#C678DD">      case</span><span style="color:#98C379"> 'r'</span><span style="color:#ABB2BF">:</span></span>
<span class="line"><span style="color:#61AFEF">        restart</span><span style="color:#ABB2BF">();</span></span>
<span class="line"><span style="color:#C678DD">        return</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">    }</span></span>
<span class="line"><span style="color:#ABB2BF">  }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD">  function</span><span style="color:#61AFEF"> handleModifierTap</span><span style="color:#ABB2BF">(</span><span style="color:#E06C75;font-style:italic">e</span><span style="color:#ABB2BF">: </span><span style="color:#E5C07B">Event</span><span style="color:#ABB2BF">): </span><span style="color:#E5C07B">void</span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#C678DD">    const</span><span style="color:#E5C07B"> modifier</span><span style="color:#56B6C2"> =</span><span style="color:#E5C07B"> e</span><span style="color:#ABB2BF">.</span><span style="color:#E06C75">currentTarget</span><span style="color:#C678DD"> as</span><span style="color:#E5C07B"> HTMLElement</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#61AFEF">    countMove</span><span style="color:#ABB2BF">();</span></span>
<span class="line"><span style="color:#61AFEF">    activateModifier</span><span style="color:#ABB2BF">(</span><span style="color:#E06C75">modifier</span><span style="color:#ABB2BF">);</span></span>
<span class="line"><span style="color:#ABB2BF">  }</span></span>
<span class="line"><span style="color:#C678DD">  function</span><span style="color:#61AFEF"> handleModifierKeyDown</span><span style="color:#ABB2BF">(</span><span style="color:#E06C75;font-style:italic">e</span><span style="color:#ABB2BF">: </span><span style="color:#E5C07B">KeyboardEvent</span><span style="color:#ABB2BF">): </span><span style="color:#E5C07B">void</span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#C678DD">    const</span><span style="color:#E5C07B"> key</span><span style="color:#56B6C2"> =</span><span style="color:#E5C07B"> e</span><span style="color:#ABB2BF">.</span><span style="color:#E06C75">key</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#C678DD">    const</span><span style="color:#E5C07B"> modifier</span><span style="color:#56B6C2"> =</span><span style="color:#E5C07B"> e</span><span style="color:#ABB2BF">.</span><span style="color:#E06C75">currentTarget</span><span style="color:#C678DD"> as</span><span style="color:#E5C07B"> HTMLElement</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#C678DD">    if</span><span style="color:#ABB2BF"> (</span><span style="color:#56B6C2">!</span><span style="color:#61AFEF">isEnterKey</span><span style="color:#ABB2BF">(</span><span style="color:#E06C75">key</span><span style="color:#ABB2BF">)) {</span></span>
<span class="line"><span style="color:#C678DD">      return</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">    }</span></span>
<span class="line"><span style="color:#C678DD">    if</span><span style="color:#ABB2BF"> (</span><span style="color:#61AFEF">pressKeyDownBad</span><span style="color:#ABB2BF">(</span><span style="color:#E06C75">key</span><span style="color:#ABB2BF">)) {</span></span>
<span class="line"><span style="color:#C678DD">      return</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#61AFEF">    countMove</span><span style="color:#ABB2BF">();</span></span>
<span class="line"><span style="color:#61AFEF">    activateModifier</span><span style="color:#ABB2BF">(</span><span style="color:#E06C75">modifier</span><span style="color:#ABB2BF">);</span></span>
<span class="line"><span style="color:#ABB2BF">  }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD">  function</span><span style="color:#61AFEF"> handleGoalTap</span><span style="color:#ABB2BF">(</span><span style="color:#E06C75;font-style:italic">e</span><span style="color:#ABB2BF">: </span><span style="color:#E5C07B">Event</span><span style="color:#ABB2BF">): </span><span style="color:#E5C07B">void</span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#61AFEF">    countMove</span><span style="color:#ABB2BF">();</span></span>
<span class="line"><span style="color:#61AFEF">    attemptGoalHit</span><span style="color:#ABB2BF">(</span><span style="color:#E5C07B">e</span><span style="color:#ABB2BF">.</span><span style="color:#E06C75">currentTarget</span><span style="color:#C678DD"> as</span><span style="color:#E5C07B"> HTMLElement</span><span style="color:#ABB2BF">);</span></span>
<span class="line"><span style="color:#ABB2BF">  }</span></span>
<span class="line"><span style="color:#C678DD">  function</span><span style="color:#61AFEF"> handleGoalKeyDown</span><span style="color:#ABB2BF">(</span><span style="color:#E06C75;font-style:italic">e</span><span style="color:#ABB2BF">: </span><span style="color:#E5C07B">KeyboardEvent</span><span style="color:#ABB2BF">): </span><span style="color:#E5C07B">void</span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#C678DD">    const</span><span style="color:#E5C07B"> key</span><span style="color:#56B6C2"> =</span><span style="color:#E5C07B"> e</span><span style="color:#ABB2BF">.</span><span style="color:#E06C75">key</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#C678DD">    const</span><span style="color:#E5C07B"> goal</span><span style="color:#56B6C2"> =</span><span style="color:#E5C07B"> e</span><span style="color:#ABB2BF">.</span><span style="color:#E06C75">currentTarget</span><span style="color:#C678DD"> as</span><span style="color:#E5C07B"> HTMLElement</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#C678DD">    if</span><span style="color:#ABB2BF"> (</span><span style="color:#56B6C2">!</span><span style="color:#61AFEF">isEnterKey</span><span style="color:#ABB2BF">(</span><span style="color:#E06C75">key</span><span style="color:#ABB2BF">)) {</span></span>
<span class="line"><span style="color:#C678DD">      return</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">    }</span></span>
<span class="line"><span style="color:#C678DD">    if</span><span style="color:#ABB2BF"> (</span><span style="color:#61AFEF">pressKeyDownBad</span><span style="color:#ABB2BF">(</span><span style="color:#E06C75">key</span><span style="color:#ABB2BF">)) {</span></span>
<span class="line"><span style="color:#C678DD">      return</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">    }</span></span>
<span class="line"><span style="color:#61AFEF">    countMove</span><span style="color:#ABB2BF">();</span></span>
<span class="line"><span style="color:#61AFEF">    attemptGoalHit</span><span style="color:#ABB2BF">(</span><span style="color:#E06C75">goal</span><span style="color:#ABB2BF">);</span></span>
<span class="line"><span style="color:#ABB2BF">  }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD">  function</span><span style="color:#61AFEF"> handleRestartClick</span><span style="color:#ABB2BF">(): </span><span style="color:#E5C07B">void</span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#61AFEF">    countMove</span><span style="color:#ABB2BF">();</span></span>
<span class="line"><span style="color:#61AFEF">    restart</span><span style="color:#ABB2BF">();</span></span>
<span class="line"><span style="color:#ABB2BF">  }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD">  function</span><span style="color:#61AFEF"> handleResetClick</span><span style="color:#ABB2BF">(): </span><span style="color:#E5C07B">void</span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#61AFEF">    reset</span><span style="color:#ABB2BF">();</span></span>
<span class="line"><span style="color:#ABB2BF">  }</span></span>
<span class="line"><span style="color:#ABB2BF">&#x3C;/</span><span style="color:#E06C75">script</span><span style="color:#ABB2BF">></span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF">&#x3C;</span><span style="color:#C678DD">svelte</span><span style="color:#ABB2BF">:</span><span style="color:#E06C75">window</span><span style="color:#ABB2BF"> </span></span>
<span class="line"><span style="color:#C678DD">  on</span><span style="color:#ABB2BF">:</span><span style="color:#E5C07B">keyup</span><span style="color:#ABB2BF">=</span><span style="color:#C678DD">{</span><span style="color:#ABB2BF">(</span><span style="color:#E06C75;font-style:italic">e</span><span style="color:#ABB2BF">) </span><span style="color:#C678DD">=></span><span style="color:#61AFEF"> handleWindowKeyUp</span><span style="color:#ABB2BF">(</span><span style="color:#E5C07B">e</span><span style="color:#ABB2BF">.</span><span style="color:#E06C75">key</span><span style="color:#ABB2BF">)</span><span style="color:#C678DD">}</span><span style="color:#ABB2BF"> </span></span>
<span class="line"><span style="color:#C678DD">  on</span><span style="color:#ABB2BF">:</span><span style="color:#E5C07B">keydown</span><span style="color:#ABB2BF">=</span><span style="color:#C678DD">{</span><span style="color:#ABB2BF">(</span><span style="color:#E06C75;font-style:italic">e</span><span style="color:#ABB2BF">) </span><span style="color:#C678DD">=></span><span style="color:#61AFEF"> handleWindowKeyDown</span><span style="color:#ABB2BF">(</span><span style="color:#E5C07B">e</span><span style="color:#ABB2BF">.</span><span style="color:#E06C75">key</span><span style="color:#ABB2BF">)</span><span style="color:#C678DD">}</span></span>
<span class="line"><span style="color:#ABB2BF">/></span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF">&#x3C;</span><span style="color:#E06C75">div</span><span style="color:#D19A66"> class</span><span style="color:#ABB2BF">=</span><span style="color:#98C379">"centerer prevent-select disable-touch-zoom"</span><span style="color:#ABB2BF">></span></span>
<span class="line"><span style="color:#ABB2BF">  &#x3C;</span><span style="color:#E06C75">div</span><span style="color:#D19A66"> class</span><span style="color:#ABB2BF">=</span><span style="color:#98C379">"course-sizer portrait-size-toggle"</span><span style="color:#ABB2BF">></span></span>
<span class="line"><span style="color:#ABB2BF">    &#x3C;</span><span style="color:#E06C75">div</span><span style="color:#D19A66"> class</span><span style="color:#ABB2BF">=</span><span style="color:#98C379">"course portrait-rotate-toggle"</span><span style="color:#ABB2BF">></span></span>
<span class="line"><span style="color:#ABB2BF">      &#x3C;</span><span style="color:#E06C75">button</span></span>
<span class="line"><span style="color:#C678DD">        bind</span><span style="color:#ABB2BF">:</span><span style="color:#E5C07B">this</span><span style="color:#ABB2BF">=</span><span style="color:#C678DD">{</span><span style="color:#E06C75">goals</span><span style="color:#ABB2BF">[</span><span style="color:#D19A66">0</span><span style="color:#ABB2BF">]</span><span style="color:#C678DD">}</span></span>
<span class="line"><span style="color:#D19A66">        class</span><span style="color:#ABB2BF">=</span><span style="color:#98C379">"modifier goal goal-0"</span></span>
<span class="line"><span style="color:#C678DD">        on</span><span style="color:#ABB2BF">:</span><span style="color:#E5C07B">mousedown</span><span style="color:#ABB2BF">=</span><span style="color:#C678DD">{</span><span style="color:#E06C75">handleGoalTap</span><span style="color:#C678DD">}</span></span>
<span class="line"><span style="color:#C678DD">        on</span><span style="color:#ABB2BF">:</span><span style="color:#E5C07B">touchstart</span><span style="color:#ABB2BF">|</span><span style="color:#56B6C2">preventDefault</span><span style="color:#ABB2BF">=</span><span style="color:#C678DD">{</span><span style="color:#E06C75">handleGoalTap</span><span style="color:#C678DD">}</span></span>
<span class="line"><span style="color:#C678DD">        on</span><span style="color:#ABB2BF">:</span><span style="color:#E5C07B">keydown</span><span style="color:#ABB2BF">=</span><span style="color:#C678DD">{</span><span style="color:#E06C75">handleGoalKeyDown</span><span style="color:#C678DD">}</span></span>
<span class="line"><span style="color:#ABB2BF">      ></span></span>
<span class="line"><span style="color:#ABB2BF">        &#x3C;</span><span style="color:#E06C75">div</span><span style="color:#D19A66"> class</span><span style="color:#ABB2BF">=</span><span style="color:#98C379">"golf-target child-target"</span><span style="color:#ABB2BF"> /></span></span>
<span class="line"><span style="color:#ABB2BF">      &#x3C;/</span><span style="color:#E06C75">button</span><span style="color:#ABB2BF">></span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF">      &#x3C;</span><span style="color:#E06C75">button</span></span>
<span class="line"><span style="color:#C678DD">        bind</span><span style="color:#ABB2BF">:</span><span style="color:#E5C07B">this</span><span style="color:#ABB2BF">=</span><span style="color:#C678DD">{</span><span style="color:#E06C75">goals</span><span style="color:#ABB2BF">[</span><span style="color:#D19A66">1</span><span style="color:#ABB2BF">]</span><span style="color:#C678DD">}</span></span>
<span class="line"><span style="color:#D19A66">        class</span><span style="color:#ABB2BF">=</span><span style="color:#98C379">"modifier goal goal-1"</span></span>
<span class="line"><span style="color:#C678DD">        on</span><span style="color:#ABB2BF">:</span><span style="color:#E5C07B">mousedown</span><span style="color:#ABB2BF">=</span><span style="color:#C678DD">{</span><span style="color:#E06C75">handleGoalTap</span><span style="color:#C678DD">}</span></span>
<span class="line"><span style="color:#C678DD">        on</span><span style="color:#ABB2BF">:</span><span style="color:#E5C07B">touchstart</span><span style="color:#ABB2BF">|</span><span style="color:#56B6C2">preventDefault</span><span style="color:#ABB2BF">=</span><span style="color:#C678DD">{</span><span style="color:#E06C75">handleGoalTap</span><span style="color:#C678DD">}</span></span>
<span class="line"><span style="color:#C678DD">        on</span><span style="color:#ABB2BF">:</span><span style="color:#E5C07B">keydown</span><span style="color:#ABB2BF">=</span><span style="color:#C678DD">{</span><span style="color:#E06C75">handleGoalKeyDown</span><span style="color:#C678DD">}</span></span>
<span class="line"><span style="color:#ABB2BF">      ></span></span>
<span class="line"><span style="color:#ABB2BF">        &#x3C;</span><span style="color:#E06C75">div</span><span style="color:#D19A66"> class</span><span style="color:#ABB2BF">=</span><span style="color:#98C379">"golf-target child-target"</span><span style="color:#ABB2BF"> /></span></span>
<span class="line"><span style="color:#ABB2BF">      &#x3C;/</span><span style="color:#E06C75">button</span><span style="color:#ABB2BF">></span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF">      &#x3C;</span><span style="color:#E06C75">button</span></span>
<span class="line"><span style="color:#C678DD">        bind</span><span style="color:#ABB2BF">:</span><span style="color:#E5C07B">this</span><span style="color:#ABB2BF">=</span><span style="color:#C678DD">{</span><span style="color:#E06C75">goals</span><span style="color:#ABB2BF">[</span><span style="color:#D19A66">2</span><span style="color:#ABB2BF">]</span><span style="color:#C678DD">}</span></span>
<span class="line"><span style="color:#D19A66">        class</span><span style="color:#ABB2BF">=</span><span style="color:#98C379">"modifier goal goal-2"</span></span>
<span class="line"><span style="color:#C678DD">        on</span><span style="color:#ABB2BF">:</span><span style="color:#E5C07B">mousedown</span><span style="color:#ABB2BF">=</span><span style="color:#C678DD">{</span><span style="color:#E06C75">handleGoalTap</span><span style="color:#C678DD">}</span></span>
<span class="line"><span style="color:#C678DD">        on</span><span style="color:#ABB2BF">:</span><span style="color:#E5C07B">touchstart</span><span style="color:#ABB2BF">|</span><span style="color:#56B6C2">preventDefault</span><span style="color:#ABB2BF">=</span><span style="color:#C678DD">{</span><span style="color:#E06C75">handleGoalTap</span><span style="color:#C678DD">}</span></span>
<span class="line"><span style="color:#C678DD">        on</span><span style="color:#ABB2BF">:</span><span style="color:#E5C07B">keydown</span><span style="color:#ABB2BF">=</span><span style="color:#C678DD">{</span><span style="color:#E06C75">handleGoalKeyDown</span><span style="color:#C678DD">}</span></span>
<span class="line"><span style="color:#ABB2BF">      ></span></span>
<span class="line"><span style="color:#ABB2BF">        &#x3C;</span><span style="color:#E06C75">div</span><span style="color:#D19A66"> class</span><span style="color:#ABB2BF">=</span><span style="color:#98C379">"golf-target child-target"</span><span style="color:#ABB2BF"> /></span></span>
<span class="line"><span style="color:#ABB2BF">      &#x3C;/</span><span style="color:#E06C75">button</span><span style="color:#ABB2BF">></span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF">      &#x3C;</span><span style="color:#E06C75">button</span></span>
<span class="line"><span style="color:#C678DD">        bind</span><span style="color:#ABB2BF">:</span><span style="color:#E5C07B">this</span><span style="color:#ABB2BF">=</span><span style="color:#C678DD">{</span><span style="color:#E06C75">goals</span><span style="color:#ABB2BF">[</span><span style="color:#D19A66">3</span><span style="color:#ABB2BF">]</span><span style="color:#C678DD">}</span></span>
<span class="line"><span style="color:#D19A66">        class</span><span style="color:#ABB2BF">=</span><span style="color:#98C379">"modifier goal goal-3"</span></span>
<span class="line"><span style="color:#C678DD">        on</span><span style="color:#ABB2BF">:</span><span style="color:#E5C07B">mousedown</span><span style="color:#ABB2BF">=</span><span style="color:#C678DD">{</span><span style="color:#E06C75">handleGoalTap</span><span style="color:#C678DD">}</span></span>
<span class="line"><span style="color:#C678DD">        on</span><span style="color:#ABB2BF">:</span><span style="color:#E5C07B">touchstart</span><span style="color:#ABB2BF">|</span><span style="color:#56B6C2">preventDefault</span><span style="color:#ABB2BF">=</span><span style="color:#C678DD">{</span><span style="color:#E06C75">handleGoalTap</span><span style="color:#C678DD">}</span></span>
<span class="line"><span style="color:#C678DD">        on</span><span style="color:#ABB2BF">:</span><span style="color:#E5C07B">keydown</span><span style="color:#ABB2BF">=</span><span style="color:#C678DD">{</span><span style="color:#E06C75">handleGoalKeyDown</span><span style="color:#C678DD">}</span></span>
<span class="line"><span style="color:#ABB2BF">      ></span></span>
<span class="line"><span style="color:#ABB2BF">        &#x3C;</span><span style="color:#E06C75">div</span><span style="color:#D19A66"> class</span><span style="color:#ABB2BF">=</span><span style="color:#98C379">"golf-target child-target"</span><span style="color:#ABB2BF"> /></span></span>
<span class="line"><span style="color:#ABB2BF">      &#x3C;/</span><span style="color:#E06C75">button</span><span style="color:#ABB2BF">></span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF">      &#x3C;</span><span style="color:#E06C75">button</span></span>
<span class="line"><span style="color:#C678DD">        bind</span><span style="color:#ABB2BF">:</span><span style="color:#E5C07B">this</span><span style="color:#ABB2BF">=</span><span style="color:#C678DD">{</span><span style="color:#E06C75">goals</span><span style="color:#ABB2BF">[</span><span style="color:#D19A66">4</span><span style="color:#ABB2BF">]</span><span style="color:#C678DD">}</span></span>
<span class="line"><span style="color:#D19A66">        class</span><span style="color:#ABB2BF">=</span><span style="color:#98C379">"modifier goal goal-4"</span></span>
<span class="line"><span style="color:#C678DD">        on</span><span style="color:#ABB2BF">:</span><span style="color:#E5C07B">mousedown</span><span style="color:#ABB2BF">=</span><span style="color:#C678DD">{</span><span style="color:#E06C75">handleGoalTap</span><span style="color:#C678DD">}</span></span>
<span class="line"><span style="color:#C678DD">        on</span><span style="color:#ABB2BF">:</span><span style="color:#E5C07B">touchstart</span><span style="color:#ABB2BF">|</span><span style="color:#56B6C2">preventDefault</span><span style="color:#ABB2BF">=</span><span style="color:#C678DD">{</span><span style="color:#E06C75">handleGoalTap</span><span style="color:#C678DD">}</span></span>
<span class="line"><span style="color:#C678DD">        on</span><span style="color:#ABB2BF">:</span><span style="color:#E5C07B">keydown</span><span style="color:#ABB2BF">=</span><span style="color:#C678DD">{</span><span style="color:#E06C75">handleGoalKeyDown</span><span style="color:#C678DD">}</span></span>
<span class="line"><span style="color:#ABB2BF">      ></span></span>
<span class="line"><span style="color:#ABB2BF">        &#x3C;</span><span style="color:#E06C75">div</span><span style="color:#D19A66"> class</span><span style="color:#ABB2BF">=</span><span style="color:#98C379">"golf-target child-target"</span><span style="color:#ABB2BF"> /></span></span>
<span class="line"><span style="color:#ABB2BF">      &#x3C;/</span><span style="color:#E06C75">button</span><span style="color:#ABB2BF">></span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF">      &#x3C;</span><span style="color:#E06C75">div</span><span style="color:#C678DD"> bind</span><span style="color:#ABB2BF">:</span><span style="color:#E5C07B">this</span><span style="color:#ABB2BF">=</span><span style="color:#C678DD">{</span><span style="color:#E06C75">startTarget</span><span style="color:#C678DD">}</span><span style="color:#D19A66"> class</span><span style="color:#ABB2BF">=</span><span style="color:#98C379">"golf-target start-target"</span><span style="color:#ABB2BF"> /></span></span>
<span class="line"><span style="color:#ABB2BF">      &#x3C;</span><span style="color:#E06C75">div</span><span style="color:#C678DD"> bind</span><span style="color:#ABB2BF">:</span><span style="color:#E5C07B">this</span><span style="color:#ABB2BF">=</span><span style="color:#C678DD">{</span><span style="color:#E06C75">hitTarget</span><span style="color:#C678DD">}</span><span style="color:#D19A66"> class</span><span style="color:#ABB2BF">=</span><span style="color:#98C379">"golf-target hit-target"</span><span style="color:#ABB2BF"> /></span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF">      &#x3C;</span><span style="color:#E06C75">button</span></span>
<span class="line"><span style="color:#C678DD">        bind</span><span style="color:#ABB2BF">:</span><span style="color:#E5C07B">this</span><span style="color:#ABB2BF">=</span><span style="color:#C678DD">{</span><span style="color:#E06C75">spinnerModifier</span><span style="color:#C678DD">}</span></span>
<span class="line"><span style="color:#D19A66">        class</span><span style="color:#ABB2BF">=</span><span style="color:#98C379">"modifier spinner"</span></span>
<span class="line"><span style="color:#C678DD">        on</span><span style="color:#ABB2BF">:</span><span style="color:#E5C07B">mousedown</span><span style="color:#ABB2BF">=</span><span style="color:#C678DD">{</span><span style="color:#E06C75">handleModifierTap</span><span style="color:#C678DD">}</span></span>
<span class="line"><span style="color:#C678DD">        on</span><span style="color:#ABB2BF">:</span><span style="color:#E5C07B">touchstart</span><span style="color:#ABB2BF">|</span><span style="color:#56B6C2">preventDefault</span><span style="color:#ABB2BF">=</span><span style="color:#C678DD">{</span><span style="color:#E06C75">handleModifierTap</span><span style="color:#C678DD">}</span></span>
<span class="line"><span style="color:#C678DD">        on</span><span style="color:#ABB2BF">:</span><span style="color:#E5C07B">keydown</span><span style="color:#ABB2BF">=</span><span style="color:#C678DD">{</span><span style="color:#E06C75">handleModifierKeyDown</span><span style="color:#C678DD">}</span></span>
<span class="line"><span style="color:#ABB2BF">      ></span></span>
<span class="line"><span style="color:#ABB2BF">        &#x3C;</span><span style="color:#E06C75">div</span><span style="color:#D19A66"> class</span><span style="color:#ABB2BF">=</span><span style="color:#98C379">"golf-target child-target"</span><span style="color:#ABB2BF"> /></span></span>
<span class="line"><span style="color:#ABB2BF">      &#x3C;/</span><span style="color:#E06C75">button</span><span style="color:#ABB2BF">></span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF">      &#x3C;</span><span style="color:#E06C75">button</span></span>
<span class="line"><span style="color:#C678DD">        bind</span><span style="color:#ABB2BF">:</span><span style="color:#E5C07B">this</span><span style="color:#ABB2BF">=</span><span style="color:#C678DD">{</span><span style="color:#E06C75">slider1Modifier</span><span style="color:#C678DD">}</span></span>
<span class="line"><span style="color:#D19A66">        class</span><span style="color:#ABB2BF">=</span><span style="color:#98C379">"modifier slider1"</span></span>
<span class="line"><span style="color:#C678DD">        on</span><span style="color:#ABB2BF">:</span><span style="color:#E5C07B">mousedown</span><span style="color:#ABB2BF">=</span><span style="color:#C678DD">{</span><span style="color:#E06C75">handleModifierTap</span><span style="color:#C678DD">}</span></span>
<span class="line"><span style="color:#C678DD">        on</span><span style="color:#ABB2BF">:</span><span style="color:#E5C07B">touchstart</span><span style="color:#ABB2BF">|</span><span style="color:#56B6C2">preventDefault</span><span style="color:#ABB2BF">=</span><span style="color:#C678DD">{</span><span style="color:#E06C75">handleModifierTap</span><span style="color:#C678DD">}</span></span>
<span class="line"><span style="color:#C678DD">        on</span><span style="color:#ABB2BF">:</span><span style="color:#E5C07B">keydown</span><span style="color:#ABB2BF">=</span><span style="color:#C678DD">{</span><span style="color:#E06C75">handleModifierKeyDown</span><span style="color:#C678DD">}</span></span>
<span class="line"><span style="color:#ABB2BF">      ></span></span>
<span class="line"><span style="color:#ABB2BF">        &#x3C;</span><span style="color:#E06C75">div</span><span style="color:#D19A66"> class</span><span style="color:#ABB2BF">=</span><span style="color:#98C379">"golf-target child-target"</span><span style="color:#ABB2BF"> /></span></span>
<span class="line"><span style="color:#ABB2BF">      &#x3C;/</span><span style="color:#E06C75">button</span><span style="color:#ABB2BF">></span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF">      &#x3C;</span><span style="color:#E06C75">button</span></span>
<span class="line"><span style="color:#C678DD">        bind</span><span style="color:#ABB2BF">:</span><span style="color:#E5C07B">this</span><span style="color:#ABB2BF">=</span><span style="color:#C678DD">{</span><span style="color:#E06C75">slider2Modifier</span><span style="color:#C678DD">}</span></span>
<span class="line"><span style="color:#D19A66">        class</span><span style="color:#ABB2BF">=</span><span style="color:#98C379">"modifier slider2"</span></span>
<span class="line"><span style="color:#C678DD">        on</span><span style="color:#ABB2BF">:</span><span style="color:#E5C07B">mousedown</span><span style="color:#ABB2BF">=</span><span style="color:#C678DD">{</span><span style="color:#E06C75">handleModifierTap</span><span style="color:#C678DD">}</span></span>
<span class="line"><span style="color:#C678DD">        on</span><span style="color:#ABB2BF">:</span><span style="color:#E5C07B">touchstart</span><span style="color:#ABB2BF">|</span><span style="color:#56B6C2">preventDefault</span><span style="color:#ABB2BF">=</span><span style="color:#C678DD">{</span><span style="color:#E06C75">handleModifierTap</span><span style="color:#C678DD">}</span></span>
<span class="line"><span style="color:#C678DD">        on</span><span style="color:#ABB2BF">:</span><span style="color:#E5C07B">keydown</span><span style="color:#ABB2BF">=</span><span style="color:#C678DD">{</span><span style="color:#E06C75">handleModifierKeyDown</span><span style="color:#C678DD">}</span></span>
<span class="line"><span style="color:#ABB2BF">      ></span></span>
<span class="line"><span style="color:#ABB2BF">        &#x3C;</span><span style="color:#E06C75">div</span><span style="color:#D19A66"> class</span><span style="color:#ABB2BF">=</span><span style="color:#98C379">"golf-target child-target"</span><span style="color:#ABB2BF"> /></span></span>
<span class="line"><span style="color:#ABB2BF">      &#x3C;/</span><span style="color:#E06C75">button</span><span style="color:#ABB2BF">></span></span>
<span class="line"><span style="color:#ABB2BF">    &#x3C;/</span><span style="color:#E06C75">div</span><span style="color:#ABB2BF">></span></span>
<span class="line"><span style="color:#ABB2BF">  &#x3C;/</span><span style="color:#E06C75">div</span><span style="color:#ABB2BF">></span></span>
<span class="line"><span style="color:#ABB2BF">&#x3C;/</span><span style="color:#E06C75">div</span><span style="color:#ABB2BF">></span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF">&#x3C;</span><span style="color:#E06C75">div</span><span style="color:#C678DD"> bind</span><span style="color:#ABB2BF">:</span><span style="color:#E5C07B">this</span><span style="color:#ABB2BF">=</span><span style="color:#C678DD">{</span><span style="color:#E06C75">pulseContainer</span><span style="color:#C678DD">}</span><span style="color:#D19A66"> class</span><span style="color:#ABB2BF">=</span><span style="color:#98C379">"pulse-container"</span><span style="color:#ABB2BF">></span></span>
<span class="line"><span style="color:#ABB2BF">  &#x3C;</span><span style="color:#E06C75">div</span><span style="color:#C678DD"> bind</span><span style="color:#ABB2BF">:</span><span style="color:#E5C07B">this</span><span style="color:#ABB2BF">=</span><span style="color:#C678DD">{</span><span style="color:#E06C75">pulseTemplate</span><span style="color:#C678DD">}</span><span style="color:#D19A66"> class</span><span style="color:#ABB2BF">=</span><span style="color:#98C379">"golf-target pulse-template"</span><span style="color:#ABB2BF"> /></span></span>
<span class="line"><span style="color:#ABB2BF">&#x3C;/</span><span style="color:#E06C75">div</span><span style="color:#ABB2BF">></span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF">&#x3C;</span><span style="color:#E06C75">button</span><span style="color:#D19A66"> class</span><span style="color:#ABB2BF">=</span><span style="color:#98C379">"restart"</span><span style="color:#C678DD"> on</span><span style="color:#ABB2BF">:</span><span style="color:#E5C07B">click</span><span style="color:#ABB2BF">=</span><span style="color:#C678DD">{</span><span style="color:#E06C75">handleRestartClick</span><span style="color:#C678DD">}</span><span style="color:#ABB2BF">></span></span>
<span class="line"><span style="color:#ABB2BF">  &#x3C;</span><span style="color:#E06C75">span</span><span style="color:#D19A66"> class</span><span style="color:#ABB2BF">=</span><span style="color:#98C379">"material-symbols-outlined"</span><span style="color:#ABB2BF">> replay &#x3C;/</span><span style="color:#E06C75">span</span><span style="color:#ABB2BF">></span></span>
<span class="line"><span style="color:#ABB2BF">&#x3C;/</span><span style="color:#E06C75">button</span><span style="color:#ABB2BF">></span></span>
<span class="line"><span style="color:#ABB2BF">&#x3C;</span><span style="color:#E06C75">div</span><span style="color:#D19A66"> class</span><span style="color:#ABB2BF">=</span><span style="color:#98C379">"scores"</span><span style="color:#ABB2BF">></span></span>
<span class="line"><span style="color:#ABB2BF">  &#x3C;</span><span style="color:#E06C75">div</span><span style="color:#D19A66"> class</span><span style="color:#ABB2BF">=</span><span style="color:#98C379">"tracker score"</span><span style="color:#D19A66"> class</span><span style="color:#ABB2BF">:</span><span style="color:#E06C75;font-style:italic">courseCompleted</span><span style="color:#ABB2BF">></span></span>
<span class="line"><span style="color:#ABB2BF">    &#x3C;</span><span style="color:#E06C75">span</span><span style="color:#D19A66"> class</span><span style="color:#ABB2BF">=</span><span style="color:#98C379">"material-symbols-outlined"</span><span style="color:#ABB2BF">> sports_score &#x3C;/</span><span style="color:#E06C75">span</span><span style="color:#ABB2BF">></span></span>
<span class="line"><span style="color:#ABB2BF">    &#x3C;</span><span style="color:#E06C75">p</span><span style="color:#ABB2BF">></span><span style="color:#C678DD">{</span><span style="color:#E06C75">moves</span><span style="color:#C678DD">}</span><span style="color:#ABB2BF">&#x3C;/</span><span style="color:#E06C75">p</span><span style="color:#ABB2BF">></span></span>
<span class="line"><span style="color:#ABB2BF">  &#x3C;/</span><span style="color:#E06C75">div</span><span style="color:#ABB2BF">></span></span>
<span class="line"><span style="color:#ABB2BF">  &#x3C;</span><span style="color:#E06C75">div</span><span style="color:#D19A66"> class</span><span style="color:#ABB2BF">=</span><span style="color:#98C379">"tracker clock"</span><span style="color:#D19A66"> class</span><span style="color:#ABB2BF">:</span><span style="color:#E06C75;font-style:italic">courseCompleted</span><span style="color:#ABB2BF">></span></span>
<span class="line"><span style="color:#ABB2BF">    &#x3C;</span><span style="color:#E06C75">span</span><span style="color:#D19A66"> class</span><span style="color:#ABB2BF">=</span><span style="color:#98C379">"material-symbols-outlined"</span><span style="color:#ABB2BF">> timer &#x3C;/</span><span style="color:#E06C75">span</span><span style="color:#ABB2BF">></span></span>
<span class="line"><span style="color:#ABB2BF">    &#x3C;</span><span style="color:#E06C75">p</span><span style="color:#ABB2BF">></span><span style="color:#C678DD">{</span><span style="color:#E06C75">timer</span><span style="color:#C678DD">}</span><span style="color:#ABB2BF">&#x3C;/</span><span style="color:#E06C75">p</span><span style="color:#ABB2BF">></span></span>
<span class="line"><span style="color:#ABB2BF">  &#x3C;/</span><span style="color:#E06C75">div</span><span style="color:#ABB2BF">></span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF">  &#x3C;</span><span style="color:#E06C75">button</span><span style="color:#D19A66"> class</span><span style="color:#ABB2BF">=</span><span style="color:#98C379">"reset"</span><span style="color:#C678DD"> on</span><span style="color:#ABB2BF">:</span><span style="color:#E5C07B">click</span><span style="color:#ABB2BF">=</span><span style="color:#C678DD">{</span><span style="color:#E06C75">handleResetClick</span><span style="color:#C678DD">}</span><span style="color:#ABB2BF">></span></span>
<span class="line"><span style="color:#ABB2BF">    &#x3C;</span><span style="color:#E06C75">span</span><span style="color:#D19A66"> class</span><span style="color:#ABB2BF">=</span><span style="color:#98C379">"material-symbols-outlined"</span><span style="color:#ABB2BF">> delete &#x3C;/</span><span style="color:#E06C75">span</span><span style="color:#ABB2BF">></span></span>
<span class="line"><span style="color:#ABB2BF">  &#x3C;/</span><span style="color:#E06C75">button</span><span style="color:#ABB2BF">></span></span>
<span class="line"><span style="color:#ABB2BF">&#x3C;/</span><span style="color:#E06C75">div</span><span style="color:#ABB2BF">></span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF">&#x3C;</span><span style="color:#E06C75">style</span><span style="color:#D19A66"> lang</span><span style="color:#ABB2BF">=</span><span style="color:#98C379">"scss"</span><span style="color:#ABB2BF">></span></span>
<span class="line"><span style="color:#E06C75">  $pxem</span><span style="color:#ABB2BF">: </span><span style="color:#D19A66">16</span><span style="color:#ABB2BF">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75">  button</span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#ABB2BF">    all: </span><span style="color:#D19A66">unset</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#E06C75">    cursor</span><span style="color:#ABB2BF">: </span><span style="color:#D19A66">pointer</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#56B6C2">    -webkit-tap-highlight-color</span><span style="color:#ABB2BF">: </span><span style="color:#D19A66">transparent</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">  }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D19A66">  .prevent-select</span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#56B6C2">    -webkit-user-select</span><span style="color:#ABB2BF">: </span><span style="color:#D19A66">none</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#56B6C2">    -ms-user-select</span><span style="color:#ABB2BF">: </span><span style="color:#D19A66">none</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">    user-select: </span><span style="color:#D19A66">none</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">  }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D19A66">  .disable-touch-zoom</span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#ABB2BF">    touch-action: </span><span style="color:#D19A66">manipulation</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">  }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D19A66">  .spinner</span><span style="color:#56B6C2">:focus-visible</span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#ABB2BF">    background-color: </span><span style="color:#56B6C2">rgba</span><span style="color:#ABB2BF">(</span><span style="color:#D19A66">255</span><span style="color:#ABB2BF">, </span><span style="color:#D19A66">0</span><span style="color:#ABB2BF">, </span><span style="color:#D19A66">255</span><span style="color:#ABB2BF">, </span><span style="color:#D19A66">0.15</span><span style="color:#ABB2BF">);</span></span>
<span class="line"><span style="color:#ABB2BF">  }</span></span>
<span class="line"><span style="color:#D19A66">  .slider1</span><span style="color:#56B6C2">:focus-visible</span><span style="color:#ABB2BF">,</span></span>
<span class="line"><span style="color:#D19A66">  .slider2</span><span style="color:#56B6C2">:focus-visible</span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#ABB2BF">    background-color: </span><span style="color:#56B6C2">rgba</span><span style="color:#ABB2BF">(</span><span style="color:#D19A66">255</span><span style="color:#ABB2BF">, </span><span style="color:#D19A66">255</span><span style="color:#ABB2BF">, </span><span style="color:#D19A66">0</span><span style="color:#ABB2BF">, </span><span style="color:#D19A66">0.4</span><span style="color:#ABB2BF">);</span></span>
<span class="line"><span style="color:#ABB2BF">  }</span></span>
<span class="line"><span style="color:#D19A66">  .goal</span><span style="color:#56B6C2">:focus-visible</span><span style="color:#ABB2BF">,</span></span>
<span class="line"><span style="color:#D19A66">  .restart</span><span style="color:#56B6C2">:focus-visible</span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#ABB2BF">    outline: </span><span style="color:#D19A66">solid</span><span style="color:#D19A66"> 2</span><span style="color:#E06C75">px</span><span style="color:#D19A66"> white</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">    outline-offset: </span><span style="color:#D19A66">4</span><span style="color:#E06C75">px</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">  }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D19A66">  .restart</span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#ABB2BF">    position: </span><span style="color:#D19A66">absolute</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">    top: </span><span style="color:#56B6C2">min</span><span style="color:#ABB2BF">(</span><span style="color:#D19A66">4.4</span><span style="color:#E06C75">em</span><span style="color:#ABB2BF">, </span><span style="color:#D19A66">16.8</span><span style="color:#E06C75">cqw</span><span style="color:#ABB2BF">);</span></span>
<span class="line"><span style="color:#ABB2BF">    left: </span><span style="color:#D19A66">0.8</span><span style="color:#E06C75">em</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">  }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D19A66">  .scores</span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#ABB2BF">    position: </span><span style="color:#D19A66">absolute</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">    top: </span><span style="color:#D19A66">0.5</span><span style="color:#E06C75">em</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">    right: </span><span style="color:#D19A66">1</span><span style="color:#E06C75">em</span><span style="color:#ABB2BF">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF">    display: </span><span style="color:#D19A66">flex</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">    gap: </span><span style="color:#D19A66">1.1</span><span style="color:#E06C75">em</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">    font-weight: </span><span style="color:#D19A66">700</span><span style="color:#ABB2BF">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D19A66">    .tracker</span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#ABB2BF">      display: </span><span style="color:#D19A66">flex</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">      align-items: </span><span style="color:#D19A66">center</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">      gap: </span><span style="color:#D19A66">0.1</span><span style="color:#E06C75">em</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">      flex-direction: </span><span style="color:#D19A66">column</span><span style="color:#ABB2BF">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75">      p</span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#ABB2BF">        margin: </span><span style="color:#D19A66">0</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">      }</span></span>
<span class="line"><span style="color:#ABB2BF">    }</span></span>
<span class="line"><span style="color:#D19A66">    .tracker.courseCompleted</span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#ABB2BF">      color: limeGreen;</span></span>
<span class="line"><span style="color:#ABB2BF">    }</span></span>
<span class="line"><span style="color:#ABB2BF">  }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D19A66">  .centerer</span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#ABB2BF">    width: </span><span style="color:#D19A66">100</span><span style="color:#E06C75">%</span><span style="color:#ABB2BF">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF">    display: </span><span style="color:#D19A66">flex</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">    justify-content: </span><span style="color:#D19A66">center</span><span style="color:#ABB2BF">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF">    container-type: inline-size;</span></span>
<span class="line"><span style="color:#ABB2BF">  }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D19A66">  .course-sizer</span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#ABB2BF">    position: </span><span style="color:#D19A66">relative</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">    width: </span><span style="color:#56B6C2">calc</span><span style="color:#ABB2BF">(</span><span style="color:#D19A66">620</span><span style="color:#56B6C2"> /</span><span style="color:#E06C75"> $pxem</span><span style="color:#56B6C2"> *</span><span style="color:#D19A66"> 1</span><span style="color:#E06C75">em</span><span style="color:#ABB2BF">);</span></span>
<span class="line"><span style="color:#ABB2BF">    height: </span><span style="color:#56B6C2">calc</span><span style="color:#ABB2BF">(</span><span style="color:#D19A66">270</span><span style="color:#56B6C2"> /</span><span style="color:#E06C75"> $pxem</span><span style="color:#56B6C2"> *</span><span style="color:#D19A66"> 1</span><span style="color:#E06C75">em</span><span style="color:#ABB2BF">);</span></span>
<span class="line"><span style="color:#ABB2BF">  }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D19A66">  .course</span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#ABB2BF">    width: </span><span style="color:#56B6C2">calc</span><span style="color:#ABB2BF">(</span><span style="color:#D19A66">620</span><span style="color:#56B6C2"> /</span><span style="color:#E06C75"> $pxem</span><span style="color:#56B6C2"> *</span><span style="color:#D19A66"> 1</span><span style="color:#E06C75">em</span><span style="color:#ABB2BF">);</span></span>
<span class="line"><span style="color:#ABB2BF">    height: </span><span style="color:#56B6C2">calc</span><span style="color:#ABB2BF">(</span><span style="color:#D19A66">270</span><span style="color:#56B6C2"> /</span><span style="color:#E06C75"> $pxem</span><span style="color:#56B6C2"> *</span><span style="color:#D19A66"> 1</span><span style="color:#E06C75">em</span><span style="color:#ABB2BF">);</span></span>
<span class="line"><span style="color:#ABB2BF">    transform-origin: </span><span style="color:#D19A66">top</span><span style="color:#D19A66"> left</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">  }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF">  @container (max-width: 613px) {</span></span>
<span class="line"><span style="color:#D19A66">    .course-sizer.portrait-size-toggle</span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#ABB2BF">      width: </span><span style="color:#56B6C2">calc</span><span style="color:#ABB2BF">(</span><span style="color:#D19A66">270</span><span style="color:#56B6C2"> /</span><span style="color:#E06C75"> $pxem</span><span style="color:#56B6C2"> *</span><span style="color:#D19A66"> 1</span><span style="color:#E06C75">em</span><span style="color:#ABB2BF">);</span></span>
<span class="line"><span style="color:#ABB2BF">      height: </span><span style="color:#56B6C2">calc</span><span style="color:#ABB2BF">(</span><span style="color:#D19A66">620</span><span style="color:#56B6C2"> /</span><span style="color:#E06C75"> $pxem</span><span style="color:#56B6C2"> *</span><span style="color:#D19A66"> 1</span><span style="color:#E06C75">em</span><span style="color:#ABB2BF">);</span></span>
<span class="line"><span style="color:#ABB2BF">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D19A66">    .course.portrait-rotate-toggle</span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#ABB2BF">      transform: </span><span style="color:#56B6C2">translateX</span><span style="color:#ABB2BF">(</span><span style="color:#56B6C2">calc</span><span style="color:#ABB2BF">(</span><span style="color:#D19A66">270</span><span style="color:#56B6C2"> /</span><span style="color:#E06C75"> $pxem</span><span style="color:#56B6C2"> *</span><span style="color:#D19A66"> 1</span><span style="color:#E06C75">em</span><span style="color:#ABB2BF">)) </span><span style="color:#56B6C2">rotate</span><span style="color:#ABB2BF">(</span><span style="color:#D19A66">90</span><span style="color:#E06C75">deg</span><span style="color:#ABB2BF">);</span></span>
<span class="line"><span style="color:#ABB2BF">    }</span></span>
<span class="line"><span style="color:#ABB2BF">  }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D19A66">  .golf-target</span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#ABB2BF">    position: </span><span style="color:#D19A66">absolute</span><span style="color:#ABB2BF">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF">    width: </span><span style="color:#56B6C2">calc</span><span style="color:#ABB2BF">(</span><span style="color:#D19A66">35</span><span style="color:#56B6C2"> /</span><span style="color:#E06C75"> $pxem</span><span style="color:#56B6C2"> *</span><span style="color:#D19A66"> 1</span><span style="color:#E06C75">em</span><span style="color:#ABB2BF">);</span></span>
<span class="line"><span style="color:#ABB2BF">    height: </span><span style="color:#56B6C2">calc</span><span style="color:#ABB2BF">(</span><span style="color:#D19A66">35</span><span style="color:#56B6C2"> /</span><span style="color:#E06C75"> $pxem</span><span style="color:#56B6C2"> *</span><span style="color:#D19A66"> 1</span><span style="color:#E06C75">em</span><span style="color:#ABB2BF">);</span></span>
<span class="line"><span style="color:#ABB2BF">    border: </span><span style="color:#D19A66">solid</span><span style="color:#D19A66"> 3</span><span style="color:#E06C75">px</span><span style="color:#D19A66"> #32cd32</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">    outline: </span><span style="color:#D19A66">dotted</span><span style="color:#D19A66"> 3</span><span style="color:#E06C75">px</span><span style="color:#D19A66"> transparent</span><span style="color:#ABB2BF">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF">    pointer-events: </span><span style="color:#D19A66">none</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">  }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D19A66">  .start-target</span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#ABB2BF">    top: </span><span style="color:#56B6C2">calc</span><span style="color:#ABB2BF">(</span><span style="color:#D19A66">60</span><span style="color:#56B6C2"> /</span><span style="color:#E06C75"> $pxem</span><span style="color:#56B6C2"> *</span><span style="color:#D19A66"> 1</span><span style="color:#E06C75">em</span><span style="color:#ABB2BF">);</span></span>
<span class="line"><span style="color:#ABB2BF">    left: </span><span style="color:#56B6C2">calc</span><span style="color:#ABB2BF">(</span><span style="color:#D19A66">10</span><span style="color:#56B6C2"> /</span><span style="color:#E06C75"> $pxem</span><span style="color:#56B6C2"> *</span><span style="color:#D19A66"> 1</span><span style="color:#E06C75">em</span><span style="color:#ABB2BF">);</span></span>
<span class="line"><span style="color:#ABB2BF">  }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D19A66">  .child-target</span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#ABB2BF">    opacity: </span><span style="color:#D19A66">0</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">  }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D19A66">  .hit-target</span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#ABB2BF">    opacity: </span><span style="color:#D19A66">0</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">    background-color: limegreen;</span></span>
<span class="line"><span style="color:#ABB2BF">  }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D19A66">  .modifier</span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#ABB2BF">    position: </span><span style="color:#D19A66">absolute</span><span style="color:#ABB2BF">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF">    width: </span><span style="color:#56B6C2">calc</span><span style="color:#ABB2BF">(</span><span style="color:#D19A66">150</span><span style="color:#56B6C2"> /</span><span style="color:#E06C75"> $pxem</span><span style="color:#56B6C2"> *</span><span style="color:#D19A66"> 1</span><span style="color:#E06C75">em</span><span style="color:#ABB2BF">);</span></span>
<span class="line"><span style="color:#ABB2BF">    height: </span><span style="color:#56B6C2">calc</span><span style="color:#ABB2BF">(</span><span style="color:#D19A66">150</span><span style="color:#56B6C2"> /</span><span style="color:#E06C75"> $pxem</span><span style="color:#56B6C2"> *</span><span style="color:#D19A66"> 1</span><span style="color:#E06C75">em</span><span style="color:#ABB2BF">);</span></span>
<span class="line"><span style="color:#ABB2BF">    border: </span><span style="color:#D19A66">dashed</span><span style="color:#D19A66"> 3</span><span style="color:#E06C75">px</span><span style="color:#ABB2BF"> darkmagenta;</span></span>
<span class="line"><span style="color:#ABB2BF">  }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D19A66">  .spinner</span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#ABB2BF">    top: </span><span style="color:#56B6C2">calc</span><span style="color:#ABB2BF">(</span><span style="color:#D19A66">70</span><span style="color:#56B6C2"> /</span><span style="color:#E06C75"> $pxem</span><span style="color:#56B6C2"> *</span><span style="color:#D19A66"> 1</span><span style="color:#E06C75">em</span><span style="color:#ABB2BF">);</span></span>
<span class="line"><span style="color:#ABB2BF">    left: </span><span style="color:#56B6C2">calc</span><span style="color:#ABB2BF">(</span><span style="color:#D19A66">60</span><span style="color:#56B6C2"> /</span><span style="color:#E06C75"> $pxem</span><span style="color:#56B6C2"> *</span><span style="color:#D19A66"> 1</span><span style="color:#E06C75">em</span><span style="color:#ABB2BF">);</span></span>
<span class="line"><span style="color:#ABB2BF">  }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D19A66">  .slider1</span><span style="color:#ABB2BF">,</span></span>
<span class="line"><span style="color:#D19A66">  .slider2</span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#ABB2BF">    height: </span><span style="color:#56B6C2">calc</span><span style="color:#ABB2BF">(</span><span style="color:#D19A66">50</span><span style="color:#56B6C2"> /</span><span style="color:#E06C75"> $pxem</span><span style="color:#56B6C2"> *</span><span style="color:#D19A66"> 1</span><span style="color:#E06C75">em</span><span style="color:#ABB2BF">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF">    border-color: </span><span style="color:#D19A66">yellow</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">  }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D19A66">  .slider1</span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#ABB2BF">    top: </span><span style="color:#56B6C2">calc</span><span style="color:#ABB2BF">(</span><span style="color:#D19A66">160</span><span style="color:#56B6C2"> /</span><span style="color:#E06C75"> $pxem</span><span style="color:#56B6C2"> *</span><span style="color:#D19A66"> 1</span><span style="color:#E06C75">em</span><span style="color:#ABB2BF">);</span></span>
<span class="line"><span style="color:#ABB2BF">    left: </span><span style="color:#56B6C2">calc</span><span style="color:#ABB2BF">(</span><span style="color:#D19A66">235</span><span style="color:#56B6C2"> /</span><span style="color:#E06C75"> $pxem</span><span style="color:#56B6C2"> *</span><span style="color:#D19A66"> 1</span><span style="color:#E06C75">em</span><span style="color:#ABB2BF">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF">    transform: </span><span style="color:#56B6C2">rotate</span><span style="color:#ABB2BF">(</span><span style="color:#D19A66">-45</span><span style="color:#E06C75">deg</span><span style="color:#ABB2BF">);</span></span>
<span class="line"><span style="color:#ABB2BF">  }</span></span>
<span class="line"><span style="color:#D19A66">  .slider2</span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#ABB2BF">    top: </span><span style="color:#56B6C2">calc</span><span style="color:#ABB2BF">(</span><span style="color:#D19A66">160</span><span style="color:#56B6C2"> /</span><span style="color:#E06C75"> $pxem</span><span style="color:#56B6C2"> *</span><span style="color:#D19A66"> 1</span><span style="color:#E06C75">em</span><span style="color:#ABB2BF">);</span></span>
<span class="line"><span style="color:#ABB2BF">    left: </span><span style="color:#56B6C2">calc</span><span style="color:#ABB2BF">(</span><span style="color:#D19A66">479</span><span style="color:#56B6C2"> /</span><span style="color:#E06C75"> $pxem</span><span style="color:#56B6C2"> *</span><span style="color:#D19A66"> 1</span><span style="color:#E06C75">em</span><span style="color:#ABB2BF">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF">    transform: </span><span style="color:#56B6C2">rotate</span><span style="color:#ABB2BF">(</span><span style="color:#D19A66">225</span><span style="color:#E06C75">deg</span><span style="color:#ABB2BF">);</span></span>
<span class="line"><span style="color:#ABB2BF">  }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D19A66">  .goal</span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#ABB2BF">    width: </span><span style="color:#56B6C2">calc</span><span style="color:#ABB2BF">(</span><span style="color:#D19A66">35</span><span style="color:#56B6C2"> /</span><span style="color:#E06C75"> $pxem</span><span style="color:#56B6C2"> *</span><span style="color:#D19A66"> 1</span><span style="color:#E06C75">em</span><span style="color:#ABB2BF">);</span></span>
<span class="line"><span style="color:#ABB2BF">    height: </span><span style="color:#56B6C2">calc</span><span style="color:#ABB2BF">(</span><span style="color:#D19A66">35</span><span style="color:#56B6C2"> /</span><span style="color:#E06C75"> $pxem</span><span style="color:#56B6C2"> *</span><span style="color:#D19A66"> 1</span><span style="color:#E06C75">em</span><span style="color:#ABB2BF">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF">    border-style: </span><span style="color:#D19A66">solid</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">    border-color: </span><span style="color:#D19A66">red</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">  }</span></span>
<span class="line"><span style="color:#D19A66">  .goal-0</span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#ABB2BF">    top: </span><span style="color:#56B6C2">calc</span><span style="color:#ABB2BF">(</span><span style="color:#D19A66">210</span><span style="color:#56B6C2"> /</span><span style="color:#E06C75"> $pxem</span><span style="color:#56B6C2"> *</span><span style="color:#D19A66"> 1</span><span style="color:#E06C75">em</span><span style="color:#ABB2BF">);</span></span>
<span class="line"><span style="color:#ABB2BF">    left: </span><span style="color:#56B6C2">calc</span><span style="color:#ABB2BF">(</span><span style="color:#D19A66">415</span><span style="color:#56B6C2"> /</span><span style="color:#E06C75"> $pxem</span><span style="color:#56B6C2"> *</span><span style="color:#D19A66"> 1</span><span style="color:#E06C75">em</span><span style="color:#ABB2BF">);</span></span>
<span class="line"><span style="color:#ABB2BF">    transform: </span><span style="color:#56B6C2">rotate</span><span style="color:#ABB2BF">(</span><span style="color:#D19A66">45</span><span style="color:#E06C75">deg</span><span style="color:#ABB2BF">);</span></span>
<span class="line"><span style="color:#ABB2BF">  }</span></span>
<span class="line"><span style="color:#D19A66">  .goal-1</span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#ABB2BF">    top: </span><span style="color:#56B6C2">calc</span><span style="color:#ABB2BF">(</span><span style="color:#D19A66">57</span><span style="color:#56B6C2"> /</span><span style="color:#E06C75"> $pxem</span><span style="color:#56B6C2"> *</span><span style="color:#D19A66"> 1</span><span style="color:#E06C75">em</span><span style="color:#ABB2BF">);</span></span>
<span class="line"><span style="color:#ABB2BF">    left: </span><span style="color:#56B6C2">calc</span><span style="color:#ABB2BF">(</span><span style="color:#D19A66">223</span><span style="color:#56B6C2"> /</span><span style="color:#E06C75"> $pxem</span><span style="color:#56B6C2"> *</span><span style="color:#D19A66"> 1</span><span style="color:#E06C75">em</span><span style="color:#ABB2BF">);</span></span>
<span class="line"><span style="color:#ABB2BF">    transform: </span><span style="color:#56B6C2">rotate</span><span style="color:#ABB2BF">(</span><span style="color:#D19A66">24</span><span style="color:#E06C75">deg</span><span style="color:#ABB2BF">);</span></span>
<span class="line"><span style="color:#ABB2BF">  }</span></span>
<span class="line"><span style="color:#D19A66">  .goal-2</span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#ABB2BF">    top: </span><span style="color:#56B6C2">calc</span><span style="color:#ABB2BF">(</span><span style="color:#D19A66">104</span><span style="color:#56B6C2"> /</span><span style="color:#E06C75"> $pxem</span><span style="color:#56B6C2"> *</span><span style="color:#D19A66"> 1</span><span style="color:#E06C75">em</span><span style="color:#ABB2BF">);</span></span>
<span class="line"><span style="color:#ABB2BF">    left: </span><span style="color:#56B6C2">calc</span><span style="color:#ABB2BF">(</span><span style="color:#D19A66">564</span><span style="color:#56B6C2"> /</span><span style="color:#E06C75"> $pxem</span><span style="color:#56B6C2"> *</span><span style="color:#D19A66"> 1</span><span style="color:#E06C75">em</span><span style="color:#ABB2BF">);</span></span>
<span class="line"><span style="color:#ABB2BF">    transform: </span><span style="color:#56B6C2">rotate</span><span style="color:#ABB2BF">(</span><span style="color:#D19A66">20</span><span style="color:#E06C75">deg</span><span style="color:#ABB2BF">);</span></span>
<span class="line"><span style="color:#ABB2BF">  }</span></span>
<span class="line"><span style="color:#D19A66">  .goal-3</span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#ABB2BF">    top: </span><span style="color:#56B6C2">calc</span><span style="color:#ABB2BF">(</span><span style="color:#D19A66">57</span><span style="color:#56B6C2"> /</span><span style="color:#E06C75"> $pxem</span><span style="color:#56B6C2"> *</span><span style="color:#D19A66"> 1</span><span style="color:#E06C75">em</span><span style="color:#ABB2BF">);</span></span>
<span class="line"><span style="color:#ABB2BF">    left: </span><span style="color:#56B6C2">calc</span><span style="color:#ABB2BF">(</span><span style="color:#D19A66">559</span><span style="color:#56B6C2"> /</span><span style="color:#E06C75"> $pxem</span><span style="color:#56B6C2"> *</span><span style="color:#D19A66"> 1</span><span style="color:#E06C75">em</span><span style="color:#ABB2BF">);</span></span>
<span class="line"><span style="color:#ABB2BF">    transform: </span><span style="color:#56B6C2">rotate</span><span style="color:#ABB2BF">(</span><span style="color:#D19A66">14</span><span style="color:#E06C75">deg</span><span style="color:#ABB2BF">);</span></span>
<span class="line"><span style="color:#ABB2BF">  }</span></span>
<span class="line"><span style="color:#D19A66">  .goal-4</span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#ABB2BF">    top: </span><span style="color:#56B6C2">calc</span><span style="color:#ABB2BF">(</span><span style="color:#D19A66">11</span><span style="color:#56B6C2"> /</span><span style="color:#E06C75"> $pxem</span><span style="color:#56B6C2"> *</span><span style="color:#D19A66"> 1</span><span style="color:#E06C75">em</span><span style="color:#ABB2BF">);</span></span>
<span class="line"><span style="color:#ABB2BF">    left: </span><span style="color:#56B6C2">calc</span><span style="color:#ABB2BF">(</span><span style="color:#D19A66">551</span><span style="color:#56B6C2"> /</span><span style="color:#E06C75"> $pxem</span><span style="color:#56B6C2"> *</span><span style="color:#D19A66"> 1</span><span style="color:#E06C75">em</span><span style="color:#ABB2BF">);</span></span>
<span class="line"><span style="color:#ABB2BF">    transform: </span><span style="color:#56B6C2">rotate</span><span style="color:#ABB2BF">(</span><span style="color:#D19A66">9</span><span style="color:#E06C75">deg</span><span style="color:#ABB2BF">);</span></span>
<span class="line"><span style="color:#ABB2BF">  }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D19A66">  .pulse-template</span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#ABB2BF">    border-color: </span><span style="color:#D19A66">transparent</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">    outline: </span><span style="color:#D19A66">solid</span><span style="color:#D19A66"> 2</span><span style="color:#E06C75">px</span><span style="color:#D19A66"> transparent</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">    outline-offset: </span><span style="color:#D19A66">0</span><span style="color:#E06C75">px</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">    outline-color: </span><span style="color:#56B6C2">rgba</span><span style="color:#ABB2BF">(</span><span style="color:#D19A66">50</span><span style="color:#ABB2BF">, </span><span style="color:#D19A66">205</span><span style="color:#ABB2BF">, </span><span style="color:#D19A66">50</span><span style="color:#ABB2BF">, </span><span style="color:#D19A66">1</span><span style="color:#ABB2BF">);</span></span>
<span class="line"><span style="color:#ABB2BF">    opacity: </span><span style="color:#D19A66">0</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">  }</span></span>
<span class="line"><span style="color:#ABB2BF">&#x3C;/</span><span style="color:#E06C75">style</span><span style="color:#ABB2BF">></span></span></code></pre>`;
