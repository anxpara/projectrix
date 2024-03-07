<script lang="ts">
  import { getProjection } from 'projectrix';
  import { onMount, tick } from 'svelte';

  // starting slot is part of demos infrastructure, not specific to this demo
  export let setTargetToStartingSlot: (target: HTMLElement) => void;
  export let revertSlotStyleInPlace: (target: HTMLElement) => void;
  export let log: boolean = false;

  let target: HTMLElement;
  let inSlot = false;

  onMount(async () => {
    await tick();

    setTimeout(() => {
      setTargetToStartingSlot(target);
      target.style.opacity = '1';
      inSlot = true;
    }, 50);
  });

  function match(subject: HTMLElement, target: HTMLElement): void {
    if (inSlot) {
      revertSlotStyleInPlace(target);
      inSlot = false;
    }

    const projectionResults = getProjection(subject, target);
    const { toSubject } = projectionResults;

    if (log) {
      console.log(projectionResults);
    }

    target.style.width = toSubject.width;
    target.style.height = toSubject.height;
    // target.style.borderStyle = toSubject.borderStyle; // keep solid border
    target.style.borderWidth = toSubject.borderWidth;
    target.style.borderRadius = toSubject.borderRadius;
    target.style.transformOrigin = toSubject.transformOrigin;
    target.style.transform = toSubject.transform;
  }

  function subjectClickHandler(subject: HTMLElement): void {
    match(subject, target);
  }
</script>

<button class="match-subject" on:click={(e) => subjectClickHandler(e.currentTarget)} />
<button class="match-subject rotated" on:click={(e) => subjectClickHandler(e.currentTarget)} />
<button class="parent" on:click={(e) => subjectClickHandler(e.currentTarget)}>
  <button
    class="match-subject child"
    on:click|stopPropagation={(e) => subjectClickHandler(e.currentTarget)}
  />
</button>

<div bind:this={target} class="match-target" />

<style lang="scss">
  // not bothering to make responsive for now, not a priority
  button {
    all: unset;
  }

  .match-subject:focus-visible,
  .parent:focus-visible {
    outline: solid 2px white;
    outline-offset: 4px;
  }

  .match-target {
    position: absolute; // any positioning works with Projectrix

    width: 35px;
    height: 35px;
    border: solid 3px limegreen;

    pointer-events: none;

    opacity: 0;
  }

  .match-subject {
    position: absolute;
    top: 150px;
    left: 100px;

    width: 100px;
    height: 100px;
    border: dashed 3px yellow;

    cursor: pointer;
  }

  .rotated {
    left: 270px;
    transform: rotate(45deg);
  }

  .parent {
    position: absolute;
    top: 125px;
    left: 440px;

    width: 150px;
    height: 150px;
    border: dashed 3px darkmagenta;

    cursor: pointer;

    transform: skew(-15deg);

    .child {
      width: 75px;
      height: 75px;
      top: 0px;
      left: 0px;
    }
  }
</style>
