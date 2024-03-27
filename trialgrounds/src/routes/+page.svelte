<script lang="ts">
  import { allTrials, getTrials, type Trial } from '../lib/trials';
  import { getContext, onDestroy, onMount, tick } from 'svelte';
  import { page } from '$app/stores';
  import OriginMarker from '../components/OriginMarker.svelte';
  import { animateTrial, animateTrialReturn } from '$lib/animateTrial';
  import anime from 'animejs';
  import { showDefaultSubject } from '$lib/showDefaultSubject';
  import type { Writable } from 'svelte/store';
  import type { Options } from '$lib/options';

  export let data;

  let options = getContext<Writable<Options>>('options');

  const trials = getCurrentTrials(data.trialNames);
  function getCurrentTrials(trialNames: string[]): Trial[] {
    return trialNames.length ? getTrials(trialNames) : allTrials;
  }

  let trialsLoaded = false;
  let autoSelectIndex: number = -1;
  let autoSelectInterval: NodeJS.Timeout | undefined = undefined;
  let currentTrial: Trial | undefined = undefined;
  $: trialSubject = currentTrial?.trialComponent?.getTrialControls().getSubjectElement?.call(null);
  $: updateShowDefaultSubject(!trialSubject);

  let defaultSubject: HTMLElement;

  onMount(async () => {
    await tick();
    trialsLoaded = true;

    setTimeout(autoSelectNextTrial, 500);

    if ($options.projectOnce) {
      return;
    }

    autoSelectInterval = setInterval(autoSelectNextTrial, 2000);
  });

  onDestroy(() => {
    clearInterval(autoSelectInterval);
    allTrials.forEach((trial) => {
      const target = trial.trialComponent?.getTrialControls().getTargetElement();
      if (target) {
        anime.remove(target);
      }
    });
  });

  function autoSelectNextTrial(): void {
    autoSelectIndex++;
    autoSelectIndex %= trials.length;
    const nextTrial = trials[autoSelectIndex];

    // trial component was probably garbage collected
    if (!nextTrial?.trialComponent) return;

    selectTrial(nextTrial);
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
    animateTrial(trial, defaultSubject, $options);
  }

  function unselectTrial(trial: Trial): void {
    animateTrialReturn(trial, $options);
  }

  function updateShowDefaultSubject(showDefault: boolean): void {
    $showDefaultSubject = showDefault;
  }
</script>

<svelte:head>
  <title>Projectrix Trialgrounds | all trials</title>
</svelte:head>

<div
  bind:this={defaultSubject}
  class="subject-element default-subject-element"
  class:hideSubject={!$showDefaultSubject}
>
  subject
</div>

<div class="all-trials-container">
  {#each trials as trial}
    <a
      href="/{trial.name}{$page.url.search}"
      on:mouseenter={() => hoverTrial(trial)}
      on:focus={() => hoverTrial(trial)}
    >
      <OriginMarker bind:this={trial.originMarker} />
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
    position: relative;
    width: fit-content;
    height: fit-content;
    text-decoration: none;
  }
</style>
