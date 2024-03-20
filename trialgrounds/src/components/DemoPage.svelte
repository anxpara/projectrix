<script lang="ts">
  import type { Demo } from '$lib/demos/demos';
  import DemoContainer from './DemoContainer.svelte';

  export let demo: Demo;
  export let href: string;
</script>

<div class="centerer">
  <DemoContainer {demo} {href}></DemoContainer>
</div>

<style lang="scss">
  .centerer {
    width: 100%;

    padding-block: 1em;

    display: flex;
    flex-direction: column;
    align-items: center;

    will-change: transform;
  }
</style>
