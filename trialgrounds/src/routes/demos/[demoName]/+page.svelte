<script lang="ts">
  import { page } from '$app/state';
  import { optionsStoreContext } from '$lib/contexts/contexts';
  import type { DemoName } from '$lib/demos/demoNames';
  import type { Options } from '$lib/options';
  import type { Store } from '$lib/stores/Store';
  import DemoCard from '$components/demos/ui/DemoCard.svelte';
  import TabbedCode from '$components/ui/TabbedCode.svelte';

  let optionsStore: Store<Options> = optionsStoreContext.get();
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
    padding: 1em;
    width: calc(100% - 2em);

    overflow-x: hidden;

    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5em;
  }

  .centerer.hideUI {
    padding-block: 0;
    height: 100svh;

    justify-content: center;
  }
</style>
