<script lang="ts">
  import type { PerfControls } from '$lib/perf/perfs';
  import DepthNPerf from './DepthNPerf.svelte';

  let depthNPerf: DepthNPerf;

  export function getPerfControls(): PerfControls {
    return depthNPerf.getPerfControls();
  }
</script>

<DepthNPerf bind:this={depthNPerf} n={1}></DepthNPerf>
