<script lang="ts">
  import { optionsStoreContext } from '$lib/contexts/contexts';
  import type { Options } from '$lib/options';
  import type { PerfName } from '$lib/perf/perfNames';
  import { PerfInProgress, perfsByName, type Perf } from '$lib/perf/perfs.svelte';
  import { runPerf } from '$lib/perf/runPerf';
  import type { Store } from '$lib/stores/Store';

  interface Props {
    perfName: PerfName;
    href: string;
  }
  let { perfName, href }: Props = $props();
  const perf: Perf = perfsByName.get(perfName)!;
  const durationMs: number | undefined = $derived(perf.durationMs);

  const optionsStore: Store<Options> = optionsStoreContext.get();

  function reRunPerf(): void {
    runPerf(perf, optionsStore.value);
  }
</script>

<div class="perf-card">
  <a {href} class="title-link">
    <div class="title-bg"></div>
    <h1>/{perf.name}</h1>
  </a>

  <div class="perf-container prevent-select">
    <perf.Component bind:this={perf.instance} />

    <div class="duration-container">
      {#if !durationMs || durationMs === PerfInProgress}
        <p>-</p>
      {:else}
        <p>{durationMs}ms</p>
      {/if}
    </div>

    <div class="rerun-container">
      <button onclick={reRunPerf}>
        <span class="material-symbols-outlined"> replay </span>
      </button>
    </div>
  </div>
</div>

<style lang="scss">
  button {
    all: unset;
    -webkit-tap-highlight-color: transparent;

    cursor: pointer;
  }

  .prevent-select {
    -webkit-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }

  .perf-card {
    position: relative;
    width: calc(14em + 2px);
  }

  .title-link {
    -webkit-tap-highlight-color: transparent;

    position: relative;
    width: 100%;
    height: 2.8em;

    display: flex;
    align-items: center;

    color: #111521;
    text-decoration-thickness: 0.125em;
    text-underline-offset: 0.2em;

    .title-bg {
      z-index: -1;
      position: absolute;
      left: 0.93em;

      width: 100%;
      height: 100%;

      background-color: coral;
      transform: skew(-34deg);
    }

    h1 {
      font-size: 1.5em;

      margin-block: 0;
      padding-left: 1.4em;

      font-family: 'Rubik', sans-serif;
      font-weight: 600;
      font-style: italic;
    }
  }

  .perf-container {
    position: relative;
    border: solid 1px coral;

    width: 14em;
    height: 14em;

    overflow: hidden;
    pointer-events: none;

    .duration-container {
      position: absolute;
      right: 0.5em;
      bottom: 0.5em;

      pointer-events: all;

      p {
        margin: 0;
      }
    }

    .rerun-container {
      position: absolute;
      right: 0.5em;
      top: 0.5em;

      pointer-events: all;
    }
  }
</style>
