<script lang="ts">
  import { page } from '$app/state';
  import { getContext, onDestroy, onMount, tick } from 'svelte';
  import { trialsByName, type Trial } from '$lib/trials/trials.svelte';
  import type { TrialName } from '$lib/trials/trialNames';
  import OriginMarker from '$components/trials/ui/OriginMarker.svelte';
  import { animateTrial, stopTrial } from '$lib/trials/animateTrial';
  import type { Options } from '$lib/options';
  import { type Store } from '$lib/stores/Store';
  import { browser } from '$app/environment';

  let optionsStore: Store<Options> = getContext('optionsStore');
  const defaultSubjectStore: Store<HTMLElement> = getContext('defaultSubjectStore');

  const currentTrialStore: Store<Trial> = getContext('currentTrialStore');
  currentTrialStore.value = trialsByName.get(page.params.trialName as TrialName)!;

  let animateInterval: NodeJS.Timeout | undefined = undefined;
  let projected = false;

  onMount(async () => {
    await tick();

    if (!currentTrialStore.value?.instance) {
      throw new Error('trial component failed to load');
    }

    startAnimation();
    animateInterval = setInterval(startAnimation, 2000);
  });

  onDestroy(() => {
    if (!browser) return;
    clearInterval(animateInterval);
    stopTrial(currentTrialStore.value);
  });

  function startAnimation(): void {
    if (optionsStore.value.projectOnce && projected) return;
    animateTrial(currentTrialStore.value, defaultSubjectStore.value, optionsStore.value);
    projected = true;
  }
</script>

<svelte:head>
  <title>Projectrix Trialgrounds | {currentTrialStore.value.name} trial</title>
</svelte:head>

<div class="lone-trial-container">
  {#if currentTrialStore.value}
    <OriginMarker bind:this={currentTrialStore.value.originMarker} />
    <currentTrialStore.value.Component
      bind:this={currentTrialStore.value.instance}
      trial={currentTrialStore.value}
    />
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
