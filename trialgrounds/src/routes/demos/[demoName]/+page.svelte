<script lang="ts">
  import { page } from '$app/state';
  import type { DemoName } from '$lib/demos/demoNames';
  import { getContext } from 'svelte';
  import type { Options } from '$lib/options';
  import type { Store } from '$lib/stores/Store';
  import TabbedCode from '$components/ui/TabbedCode.svelte';
  import DemoCard from '$components/demos/ui/DemoCard.svelte';

  let optionsStore: Store<Options> = getContext('optionsStore');
  const hideUI = $derived(optionsStore.value.hideUI);

  const demoName = $derived(page.params.demoName as DemoName);
</script>

<svelte:head>
  <title>Projectrix Trialgrounds | {demoName} demo</title>
</svelte:head>

<div class="centerer" class:hideUI>
  <DemoCard {demoName} href={`/demos/${demoName}${page.url.search}`}></DemoCard>
  {#if !hideUI}
    <TabbedCode {demoName}></TabbedCode>
  {/if}
</div>

<style lang="scss">
  .centerer {
    width: calc(100% - 2em);
    padding: 1em;

    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5em;
  }

  .centerer.hideUI {
    height: 100svh;
    padding-block: 0;

    justify-content: center;
  }
</style>
