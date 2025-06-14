<script lang="ts">
  import { allTrials, getTrials, type Trial } from '../lib/trials/trials.svelte';
  import { getContext, onDestroy, onMount, tick } from 'svelte';
  import { page } from '$app/state';
  import OriginMarker from '$components/trials/ui/OriginMarker.svelte';
  import { animateTrial, animateTrialReturn } from '$lib/trials/animateTrial';
  import { utils } from 'animejs';
  import type { Options } from '$lib/options';
  import type { Store } from '$lib/stores/Store';
  import type { LayoutData } from './$types';
  import { browser } from '$app/environment';

  interface Props {
    data: LayoutData;
  }
  let { data }: Props = $props();
  const activeTrials = getActiveTrials(data.trialNames);
  function getActiveTrials(trialNames: string[]): Trial[] {
    return trialNames.length ? getTrials(trialNames) : allTrials;
  }

  const optionsStore: Store<Options> = getContext('optionsStore');

  const currentTrialStore: Store<Trial> = getContext('currentTrialStore');
  const hideDefaultSubject = $derived(!!currentTrialStore.value.instance?.getSubjectElement?.());

  let defaultSubject: HTMLElement;
  let autoSelectIndex: number = -1;
  let autoSelectInterval: NodeJS.Timeout | undefined = undefined;

  onMount(async () => {
    await tick();

    setTimeout(autoSelectNextTrial.bind(null, true), 500);
    if (optionsStore.value.projectOnce) return;

    autoSelectInterval = setInterval(autoSelectNextTrial, 2000);
  });

  onDestroy(() => {
    if (browser) clearInterval(autoSelectInterval);

    allTrials.forEach((trial) => {
      const target = trial.instance?.getTargetElement();
      if (target) {
        utils.remove(target);
      }
    });
  });

  function autoSelectNextTrial(isFirstTrial = false): void {
    autoSelectIndex++;
    autoSelectIndex %= activeTrials.length;
    selectTrial(activeTrials[autoSelectIndex], isFirstTrial);
  }

  function hoverTrial(trial: Trial): void {
    clearInterval(autoSelectInterval);
    autoSelectInterval = undefined;
    autoSelectIndex = -1;

    if (currentTrialStore.value === trial) {
      return;
    }

    selectTrial(trial);
  }

  function selectTrial(trial: Trial, isFirstTrial = false): void {
    if (!trial.instance) return; // trial component was probably garbage collected
    if (!isFirstTrial && currentTrialStore.value === trial) return;
    if (!isFirstTrial && currentTrialStore.value) unselectTrial(currentTrialStore.value);

    currentTrialStore.value = trial;
    animateTrial(trial, defaultSubject, optionsStore.value, {
      complete: (options) => {
        if (currentTrialStore.value !== trial) {
          animateTrialReturn(trial, options, 0);
        }
      },
    });
  }

  function unselectTrial(trial: Trial): void {
    const skipAnimation =
      optionsStore.value.skipAnimation ||
      !!trial.instance?.getTrialOptionOverrides?.().skipAnimation;
    if (!trial.animation?.completed && !skipAnimation) return;

    const durationMs = skipAnimation ? 0 : undefined;
    animateTrialReturn(trial, optionsStore.value, durationMs);
  }
</script>

<svelte:head>
  <title>Projectrix Trialgrounds | all trials</title>
</svelte:head>

<div
  bind:this={defaultSubject}
  class="subject-element default-subject-element"
  class:hideSubject={hideDefaultSubject}
>
  subject
</div>

<div class="all-trials-container">
  {#each activeTrials as trial}
    <a
      href="/{trial.name}{page.url.search}"
      onmouseenter={() => hoverTrial(trial)}
      onfocus={() => hoverTrial(trial)}
    >
      <OriginMarker bind:this={trial.originMarker} />
      <trial.Component
        bind:this={trial.instance}
        {trial}
        hideSubject={!hideDefaultSubject || trial != currentTrialStore.value}
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
