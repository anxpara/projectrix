<script lang="ts">
  import type { Options } from '$lib/options';
  import { PerfInProgress, type Perf } from '$lib/perf/perfs';
  import { runPerf } from '$lib/perf/runPerf';
  import { getContext } from 'svelte';
  import type { Writable } from 'svelte/store';

  interface Props {
    perf: Perf;
    href: string;
  }

  let { perf = $bindable(), href }: Props = $props();

  let durationMs = $derived(perf.durationMs);

  const options = getContext<Writable<Options>>('options');
</script>

<div class="perf-card">
  <a {href} class="title-link">
    <div class="title-bg"></div>
    <h1>/{perf.name}</h1>
  </a>

  <div class="perf-container prevent-select">
    <perf.perfType bind:this={perf.perfComponent} {perf} {options} />

    <div class="duration-container">
      {#if !$durationMs || $durationMs === PerfInProgress}
        <p>-</p>
      {:else}
        <p>{$durationMs}ms</p>
      {/if}
    </div>

    <div class="rerun-container">
      <button onclick={() => runPerf(perf, $options)}
        ><span class="material-symbols-outlined"> replay </span></button
      >
    </div>
  </div>
</div>

<style lang="scss">
  button {
    all: unset;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
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
    width: 100%;
    height: 2.8em;

    display: flex;
    align-items: center;
    position: relative;

    color: #111521;
    text-underline-offset: 0.2em;
    text-decoration-thickness: 0.125em;
    -webkit-tap-highlight-color: transparent;

    .title-bg {
      position: absolute;
      left: 0.93em;
      z-index: -1;

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

    width: 14em;
    height: 14em;
    border: solid 1px coral;

    overflow: hidden;
    pointer-events: none;

    .duration-container {
      position: absolute;
      bottom: 0.5em;
      right: 0.5em;

      pointer-events: all;

      p {
        margin: 0;
      }
    }

    .rerun-container {
      position: absolute;
      top: 0.5em;
      right: 0.5em;

      pointer-events: all;
    }
  }
</style>
