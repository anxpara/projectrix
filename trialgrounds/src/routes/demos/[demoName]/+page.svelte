<script lang="ts">
  import { page } from '$app/stores';
  import type { DemoName } from '$lib/demos/demoNames';
  import { demosByName } from '$lib/demos/demos';
  import DemoCard from '../../../components/DemoCard.svelte';
  import TabbedCode from '../../../components/TabbedCode.svelte';

  $: demo = demosByName.get($page.params.demoName as DemoName)!;
</script>

<svelte:head>
  <title>Projectrix Trialgrounds | {demo.name} demo</title>
</svelte:head>

<div class="centerer">
  <DemoCard {demo} href={`/demos/${demo.name}${$page.url.search}`}></DemoCard>
  <TabbedCode {demo}></TabbedCode>
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
</style>
