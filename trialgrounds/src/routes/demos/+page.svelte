<script lang="ts">
  import { page } from '$app/state';
  import { allDemos } from '$lib/demos/demos.svelte';
  import DemoCard from '$components/demos/ui/DemoCard.svelte';
</script>

<svelte:head>
  <title>Projectrix Trialgrounds | demos</title>
</svelte:head>

<div class="all-demos-container">
  {#each allDemos as demo}
    <DemoCard demoName={demo.name} href={`/demos/${demo.name}${page.url.search}`} />
  {/each}
</div>

<style lang="scss">
  .all-demos-container {
    width: calc(100% - 2em);
    padding: 1em;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 1.5em;

    overflow: hidden;
  }
</style>
