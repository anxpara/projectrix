<script lang="ts">
  import type { PerfControls } from '$lib/perf/perfs';
  import DepthNPerf from './DepthNPerf.svelte';

  let depthNPerf: DepthNPerf = $state();

  export function getPerfControls(): PerfControls {
    return depthNPerf.getPerfControls();
  }
</script>

<DepthNPerf bind:this={depthNPerf} n={10}></DepthNPerf>
