<script lang="ts">
  import { page } from '$app/stores';
  import type { DemoName } from '$lib/demos/demoNames';
  import { demosByName } from '$lib/demos/demos';
  import DemoContainer from '../../../components/DemoContainer.svelte';

  $: demo = demosByName.get($page.params.demoName as DemoName)!;
</script>

<svelte:head>
  <title>Projectrix Trialgrounds | {demo.name} demo</title>
</svelte:head>

<div class="centerer">
  <DemoContainer {demo} href={`/demos/${demo.name}${$page.url.search}`} />
</div>

<style lang="scss">
  .centerer {
    width: 100vw;
    height: 100svh;

    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
