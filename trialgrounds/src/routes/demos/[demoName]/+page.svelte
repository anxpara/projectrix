<script lang="ts">
  import { page } from '$app/stores';
  import type { DemoName } from '$lib/demos/demoNames';
  import { demosByName } from '$lib/demos/demos';
  import DemoContainer from '../../../components/DemoContainer.svelte';

  export let data;
  $: demo = demosByName.get($page.params.demoName as DemoName)!;
</script>

<div class="centerer">
  <DemoContainer {demo} log={data.log} />
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
