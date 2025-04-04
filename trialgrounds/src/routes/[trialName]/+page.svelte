<script lang="ts">
  import { page } from '$app/stores';
  import { getContext, onDestroy, onMount, tick } from 'svelte';
  import { trialsByName } from '../../lib/trials/trials';
  import type { TrialName } from '../../lib/trials/trialNames';
  import OriginMarker from '../../components/OriginMarker.svelte';
  import { animateTrial } from '$lib/trials/animateTrial';
  import { utils } from 'animejs';
  import type { Writable } from 'svelte/store';
  import { showDefaultSubject } from '$lib/trials/showDefaultSubject';
  import type { Options } from '$lib/options';

  let options = getContext<Writable<Options>>('options');

  $: trial = trialsByName.get($page.params.trialName as TrialName)!;
  $: trialSubject = trial.trialComponent?.getTrialControls
    ?.call(null)
    .getSubjectElement?.call(null);
  $: updateShowDefaultSubject(!trialSubject);
  const defaultSubject = getContext<Writable<HTMLElement | undefined>>('default-subject');

  let animateInterval: NodeJS.Timeout | undefined = undefined;
  let projected = false;

  onMount(async () => {
    await tick();

    if (!trial?.trialComponent) {
      throw new Error('trial component failed to load');
    }

    startAnimation();
    animateInterval = setInterval(startAnimation, 2000);
  });

  onDestroy(() => {
    clearInterval(animateInterval);
    if (trial.animation?.currentTime && trial.animation.currentTime < 1) {
      trial.animation.stop();
      trial.animation = undefined;
    }
    const target = trial.trialComponent?.getTrialControls().getTargetElement();
    if (!target) {
      return;
    }
    utils.remove(target);
  });

  function startAnimation(): void {
    if ($options.projectOnce && projected) {
      return;
    }
    animateTrial(trial, $defaultSubject!, $options);
    projected = true;
  }

  function updateShowDefaultSubject(showDefault: boolean): void {
    $showDefaultSubject = showDefault;
  }
</script>

<svelte:head>
  <title>Projectrix Trialgrounds | {trial.name} trial</title>
</svelte:head>

<div class="lone-trial-container">
  {#if trial}
    <OriginMarker bind:this={trial.originMarker} />
    <svelte:component this={trial.trialType} bind:this={trial.trialComponent} {trial} />
  {/if}
</div>

<style lang="scss">
  .lone-trial-container {
    position: absolute;
    top: 0;

    width: 100%;
    height: 100svh;

    display: grid;
    justify-content: center;
    align-items: center;
  }
</style>
