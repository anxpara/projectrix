<script lang="ts">
  import { page } from '$app/state';
  import PerfCard from '$components/perfs/ui/PerfCard.svelte';
  import { allPerfs } from '$lib/perf/perfs.svelte';
  import { getContext, onMount, tick } from 'svelte';
  import { runPerf } from '$lib/perf/runPerf';
  import type { Options } from '$lib/options';
  import type { Store } from '$lib/stores/Store';

  let optionsStore: Store<Options> = getContext('optionsStore');

  onMount(async () => {
    await tick();
    clearAllPerfs();
    runAllPerfs();
  });

  function clearAllPerfs(): void {
    allPerfs.forEach((perf) => {
      perf.durationMs = undefined;
    });
  }

  function runAllPerfs(): void {
    allPerfs.forEach((perf) => {
      runPerf(perf, optionsStore.value);
    });
  }
</script>

<svelte:head>
  <title>Projectrix Trialgrounds | performance</title>
</svelte:head>

<div class="centerer">
  <div class="all-perfs-container">
    {#each allPerfs as perf}
      <PerfCard perfName={perf.name} href={`/perf/${perf.name}${page.url.search}`} />
    {/each}
  </div>
</div>

<style lang="scss">
  .centerer {
    box-sizing: border-box;

    padding: 1.4em;
    padding-right: 2.2em;
    width: 100%;

    display: flex;
    justify-content: center;

    .all-perfs-container {
      max-width: min(46em, 100%);

      display: grid;
      grid-template-columns: repeat(auto-fill, calc(14em + 2px));
      gap: 1.4em;
    }
  }
</style>
