<script lang="ts">
  import { onDestroy, onMount, tick } from 'svelte';
  import { browser } from '$app/environment';
  import { page } from '$app/state';
  import {
    currentTrialStoreContext,
    defaultSubjectStoreContext,
    optionsStoreContext,
  } from '$lib/contexts/contexts';
  import type { Options } from '$lib/options';
  import { store, type Store } from '$lib/stores/Store';
  import { animateTrial, stopTrial } from '$lib/trials/animateTrial';
  import type { TrialName } from '$lib/trials/trialNames';
  import {
    getNextTrial,
    getPreviousTrial,
    trialsByName,
    type Trial,
  } from '$lib/trials/trials.svelte';
  import type { LayoutData } from '../$types';
  import OriginMarker from '$components/trials/ui/OriginMarker.svelte';

  interface Props {
    data: LayoutData;
  }
  let { data }: Props = $props();

  let optionsStore: Store<Options> = optionsStoreContext.get();

  const currentTrialStore: Store<Trial> = currentTrialStoreContext.get();
  $effect(() => {
    currentTrialStore.value = trialsByName.get(page.params.trialName as TrialName)!;
  });

  const hideSubject = $derived(!!currentTrialStore.value.instance?.getSubjectElement?.());
  const previousTrial = $derived(getPreviousTrial(currentTrialStore.value, data.trialNames));
  const nextTrial = $derived(getNextTrial(currentTrialStore.value, data.trialNames));

  const defaultSubjectStore = $state(store()) as Store<HTMLElement>;
  defaultSubjectStoreContext.set(defaultSubjectStore);

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

<div
  bind:this={defaultSubjectStore.value}
  class="subject-element default-subject-element"
  class:hideSubject
>
  subject
</div>

<div class="lone-trial-container">
  {#if currentTrialStore.value}
    <OriginMarker bind:this={currentTrialStore.value.originMarker} />
    <currentTrialStore.value.Component
      bind:this={currentTrialStore.value.instance}
      trial={currentTrialStore.value}
    />
  {/if}

  {#if !optionsStore.value.hideUI}
    <nav>
      {#if previousTrial}
        <a href="/{previousTrial.name}{page.url.search}">{'<'} Previous</a>
      {/if}
      {#if nextTrial}
        <a href="/{nextTrial.name}{page.url.search}">Next {'>'} </a>
      {/if}
    </nav>
  {/if}
</div>

<style lang="scss">
  .lone-trial-container {
    position: absolute;
    top: 0;

    width: 100%;
    height: 100svh;
    overflow: hidden;

    display: grid;
    justify-content: center;
    align-items: center;
  }

  nav {
    font-size: 1.5em;
    position: absolute;
    bottom: 1.5em;
    width: 100vw;

    display: flex;
    justify-content: center;
    gap: 1em;

    a {
      color: coral;
      text-underline-offset: 0.2em;
    }
  }
</style>
