<script lang="ts">
  import { page } from '$app/stores';
  import type { DemoName } from '$lib/demos/demoNames';
  import { demosByName } from '$lib/demos/demos';
  import DemoPage from '../../../components/DemoPage.svelte';

  $: demo = demosByName.get($page.params.demoName as DemoName)!;
</script>

<svelte:head>
  <title>Projectrix Trialgrounds | {demo.name} demo</title>
</svelte:head>

<DemoPage {demo} href={`/demos/${demo.name}${$page.url.search}`} />
