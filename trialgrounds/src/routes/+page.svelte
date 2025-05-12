<script lang="ts">
  import { run } from 'svelte/legacy';

  import { allTrials, getTrials, type Trial } from '../lib/trials/trials';
  import { getContext, onDestroy, onMount, tick } from 'svelte';
  import { page } from '$app/state';
  import OriginMarker from '../components/OriginMarker.svelte';
  import { animateTrial, animateTrialReturn } from '$lib/trials/animateTrial';
  import { utils } from 'animejs';
  import { showDefaultSubject } from '$lib/trials/showDefaultSubject';
  import type { Writable } from 'svelte/store';
  import type { Options } from '$lib/options';

  interface Props {
    data: any;
  }

  let { data }: Props = $props();

  let options = getContext<Writable<Options>>('options');

  const trials = $state(getCurrentTrials(data.trialNames));
  function getCurrentTrials(trialNames: string[]): Trial[] {
    return trialNames.length ? getTrials(trialNames) : allTrials;
  }

  let trialsLoaded = false;
  let autoSelectIndex: number = -1;
  let autoSelectInterval: NodeJS.Timeout | undefined = undefined;
  let currentTrial: Trial | undefined = $state(undefined);

  let defaultSubject: HTMLElement = $state();

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
        utils.remove(target);
      }
    });
  });

  function autoSelectNextTrial(): void {
    autoSelectIndex++;
    autoSelectIndex %= trials.length;
    const nextTrial = trials[autoSelectIndex];

    // trial component was probably garbage collected
    if (!nextTrial?.trialComponent || !defaultSubject) return;

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
    animateTrial(trial, defaultSubject, $options, {
      complete: (options) => {
        if (currentTrial !== trial) {
          animateTrialReturn(trial, options, 0);
        }
      },
    });
  }

  function unselectTrial(trial: Trial): void {
    const skipAnimation =
      $options.skipAnimation ||
      !!trial.trialComponent?.getTrialControls?.call(null).getTrialOptionOverrides?.call(null)
        .skipAnimation;

    const transformType =
      trial.trialComponent?.getTrialControls?.call(null).getProjectionOptions?.call(null)
        .transformType ?? 'transform';

    if (transformType !== 'transform' || trial.animation?.currentTime === 0 || skipAnimation) {
      animateTrialReturn(trial, $options);
    }
  }

  function updateShowDefaultSubject(showDefault: boolean): void {
    $showDefaultSubject = showDefault;
  }
  let trialSubject = $derived(currentTrial?.trialComponent?.getTrialControls().getSubjectElement?.call(null));
  run(() => {
    updateShowDefaultSubject(!trialSubject);
  });
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
      href="/{trial.name}{page.url.search}"
      onmouseenter={() => hoverTrial(trial)}
      onfocus={() => hoverTrial(trial)}
    >
      <OriginMarker bind:this={trial.originMarker} />
      <trial.trialType
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
