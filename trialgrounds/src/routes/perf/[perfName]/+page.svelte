<script lang="ts">
  import { page } from '$app/state';
  import type { PerfName } from '$lib/perf/perfNames';
  import { perfsByName } from '$lib/perf/perfs.svelte';
  import { getContext, onMount, tick } from 'svelte';
  import PerfCard from '$components/perfs/ui/PerfCard.svelte';
  import type { Options } from '$lib/options';
  import { runPerf } from '$lib/perf/runPerf';
  import type { Store } from '$lib/stores/Store';

  let optionsStore: Store<Options> = getContext('optionsStore');

  const perf = $derived(perfsByName.get(page.params.perfName as PerfName)!);

  onMount(async () => {
    await tick();
    runPerf(perf, optionsStore.value);
  });
</script>

<svelte:head>
  <title>Projectrix Trialgrounds | {perf.name} perf</title>
</svelte:head>

<div class="lone-perf-container">
  <PerfCard perfName={perf.name} href={`/perfs/${perf.name}${page.url.search}`}></PerfCard>
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
