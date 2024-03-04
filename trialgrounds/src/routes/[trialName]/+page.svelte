<script lang="ts">
  import { page } from '$app/stores';
  import { getContext, onDestroy, onMount, tick } from 'svelte';
  import { trialsByName } from '../../lib/trials';
  import type { TrialName } from '../../lib/trialNames';
  import OriginMarker from '../../components/OriginMarker.svelte';
  import { animateTrial } from '$lib/animateTrial';
  import anime from 'animejs';
  import type { Writable } from 'svelte/store';
  import { showDefaultSubject } from '$lib/showDefaultSubject';

  export let data;

  $: trial = trialsByName.get($page.params.trialName as TrialName)!;
  $: trialSubject = trial.trialComponent?.getSubjectElement();
  $: updateShowDefaultSubject(!trialSubject);
  const defaultSubject = getContext<Writable<HTMLElement | undefined>>('default-subject');

  let animateInterval: NodeJS.Timeout | undefined = undefined;

  onMount(async () => {
    await tick();

    if (!trial?.trialComponent) {
      throw new Error('trial component failed to load');
    }

    animate();
    if (data.projectOnce) return;

    animateInterval = setInterval(animate, 2000);
  });

  onDestroy(() => {
    clearInterval(animateInterval);
    const target = trial.trialComponent?.getTargetElement();
    if (!target) return;
    anime.remove(target);
  });

  function animate(): void {
    animateTrial(trial, $defaultSubject!, data.toTargetOrigin, data.skipAnimation, data.log);
  }

  function updateShowDefaultSubject(showDefault: boolean): void {
    $showDefaultSubject = showDefault;
  }
</script>

<div class="lone-trial-container">
  {#if trial}
    <OriginMarker bind:this={trial.originMarker} />
    <svelte:component this={trial.trialType} bind:this={trial.trialComponent} {trial} />
  {/if}
</div>

<style lang="scss">
  .lone-trial-container {
    width: 100%;
    height: 100%;

    display: grid;
    justify-content: center;
    align-items: center;
  }
</style>
