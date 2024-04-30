<script lang="ts">
  import { page } from '$app/stores';
  import type { PerfName } from '$lib/perf/perfNames';
  import { perfsByName } from '$lib/perf/perfs';
  import { getContext, onMount, tick } from 'svelte';
  import PerfCard from '../../../components/PerfCard.svelte';
  import type { Writable } from 'svelte/store';
  import type { Options } from '$lib/options';
  import { runPerf } from '$lib/perf/runPerf';

  let options = getContext<Writable<Options>>('options');

  $: perf = perfsByName.get($page.params.perfName as PerfName)!;

  onMount(async () => {
    await tick();
    runPerf(perf, $options);
  });
</script>

<svelte:head>
  <title>Projectrix Trialgrounds | {perf.name} perf</title>
</svelte:head>

<div class="lone-perf-container">
  <PerfCard {perf} href={`/perfs/${perf.name}${$page.url.search}`}></PerfCard>
</div>

<style lang="scss">
  .lone-perf-container {
    position: absolute;
    top: 0;

    width: 100%;
    height: 100svh;

    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
