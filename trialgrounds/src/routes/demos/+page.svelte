<script lang="ts">
  import { page } from '$app/stores';
  import { allDemos } from '$lib/demos/demos';
  import DemoContainer from '../../components/DemoContainer.svelte';

  export let data;
</script>

<div class="all-demos-container">
  {#each allDemos as demo}
    <DemoContainer {demo} href={`/demos/${demo.name}${$page.url.search}`} log={data.log} />
  {/each}
</div>

<style lang="scss">
  .all-demos-container {
    width: 100%;
    padding-top: 9em;
    padding-bottom: 2em;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 1em;
  }
</style>
