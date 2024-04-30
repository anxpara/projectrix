<script lang="ts">
  import type { Options } from '$lib/options';
  import type { Writable } from 'svelte/store';
  import type { Perf, PerfControls } from '$lib/perf/perfs';
  import DepthNPerf from './DepthNPerf.svelte';

  export let perf: Perf;
  export let options: Writable<Options>;

  let depthNPerf: DepthNPerf;

  export function getPerfControls(): PerfControls {
    return depthNPerf.getPerfControls();
  }
</script>

<DepthNPerf bind:this={depthNPerf} {perf} n={100} {options}></DepthNPerf>
