<script lang="ts">
  import { page } from '$app/state';
  import type { DemoName } from '$lib/demos/demoNames';
  import { demosByName } from '$lib/demos/demos';
  import { getContext } from 'svelte';
  import DemoCard from '../../../components/DemoCard.svelte';
  import TabbedCode from '../../../components/TabbedCode.svelte';
  import type { Writable } from 'svelte/store';
  import type { Options } from '$lib/options';

  let options = getContext<Writable<Options>>('options');

  let demo = $derived(demosByName.get(page.params.demoName as DemoName)!);
  let hideUI = $derived($options.hideUI);
</script>

<svelte:head>
  <title>Projectrix Trialgrounds | {demo.name} demo</title>
</svelte:head>

<div class="centerer" class:hideUI>
  <DemoCard {demo} href={`/demos/${demo.name}${page.url.search}`}></DemoCard>
  {#if !hideUI}
    <TabbedCode {demo}></TabbedCode>
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
