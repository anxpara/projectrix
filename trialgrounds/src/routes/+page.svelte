<script lang="ts">
  import { allTrials, getTrials, type Trial } from '../lib/trials';
  import { onDestroy, onMount, tick } from 'svelte';
  import { page } from '$app/stores';
  import OriginMarker from '../components/OriginMarker.svelte';
  import { animateTrial, animateTrialReturn } from '$lib/animateTrial';
  import anime from 'animejs';
  import { showDefaultSubject } from '$lib/showDefaultSubject';

  export let data;

  const trials = getCurrentTrials(data.trialNames);
  function getCurrentTrials(trialNames: string[]): Trial[] {
    return trialNames.length ? getTrials(trialNames) : allTrials;
  }

  let trialsLoaded = false;
  let autoSelectIndex: number = -1;
  let autoSelectInterval: NodeJS.Timeout | undefined = undefined;
  let currentTrial: Trial | undefined = undefined;
  $: trialSubject = currentTrial?.trialComponent?.getSubjectElement();
  $: updateShowDefaultSubject(!trialSubject);

  let defaultSubject: HTMLElement;

  onMount(async () => {
    await tick();
    trialsLoaded = true;

    setTimeout(autoSelectNextTrial, 500);

    if (data.projectOnce) {
      return;
    }

    autoSelectInterval = setInterval(autoSelectNextTrial, 2000);
  });

  onDestroy(() => {
    clearInterval(autoSelectInterval);
    allTrials.forEach((trial) => {
      const target = trial.trialComponent?.getTargetElement();
      if (target) {
        anime.remove(target);
      }
    });
  });

  function autoSelectNextTrial(): void {
    autoSelectIndex++;
    autoSelectIndex %= trials.length;

    selectTrial(trials[autoSelectIndex]);
  }

  function hoverTrial(trial: Trial): void {
    clearInterval(autoSelectInterval);
    autoSelectInterval = undefined;
    autoSelectIndex = -1;

    if (currentTrial === trial) {
      return;
    }

    selectTrial(trial);
  }

  function selectTrial(trial: Trial): void {
    if (currentTrial === trial) return;
    if (currentTrial) unselectTrial(currentTrial);

    currentTrial = trial;
    animateTrial(trial, defaultSubject, data.toTargetOrigin, data.skipAnimation, data.log);
  }

  function unselectTrial(trial: Trial): void {
    animateTrialReturn(trial, data.toTargetOrigin, data.skipAnimation);
  }

  function updateShowDefaultSubject(showDefault: boolean): void {
    $showDefaultSubject = showDefault;
  }
</script>

<div
  bind:this={defaultSubject}
  class="subject-element default-subject-element"
  class:hideSubject={!$showDefaultSubject}
>
  subject
</div>

<div class="all-trials-container">
  {#each trials as trial}
    <OriginMarker bind:this={trial.originMarker} />
    <a
      data-sveltekit-reload
      href="/{trial.name}{$page.url.search}"
      on:mouseenter={() => hoverTrial(trial)}
      on:focus={() => hoverTrial(trial)}
    >
      <svelte:component
        this={trial.trialType}
        bind:this={trial.trialComponent}
        {trial}
        hideSubject={currentTrial !== trial || !trialSubject}
      />
    </a>
  {/each}
</div>

<style lang="scss">
  .all-trials-container {
    position: absolute;
    top: 14em;

    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 2em;
  }

  a {
    width: fit-content;
    height: fit-content;
    text-decoration: none;
  }
</style>
