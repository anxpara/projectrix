<script lang="ts">
  import type { Demo } from '$lib/demos/demos';
  import type { Options } from '$lib/options';
  import { getContext } from 'svelte';
  import type { Writable } from 'svelte/store';
  import DemoStartSlot from './DemoStartSlot.svelte';

  export let demo: Demo;
  export let href: string;

  const options = getContext<Writable<Options>>('options');

  let startSlot: DemoStartSlot;
</script>

<div class="demo-container">
  <div class="corner left" />
  <a {href} class="title-link">
    <div class="title">
      <div class="corner-right-container">
        <div class="corner right" />
      </div>
      <DemoStartSlot bind:this={startSlot}></DemoStartSlot>

      <h1>/demos/{demo.name}</h1>
    </div>
  </a>

  <div class="summary">
    <p>{demo.summary}</p>
  </div>

  <svelte:component this={demo.demoType} bind:this={demo.demoComponent} {startSlot} {options} />
</div>

<style lang="scss">
  .demo-container {
    position: relative;
    display: block;
    margin-bottom: 1.5em;

    width: 700px;
    height: 400px;

    border: solid 1px coral;
  }

  .title-link {
    position: absolute;
    top: 0;
    left: 0;

    height: 3.5em;
    padding-inline: 0em;

    color: #111521;
    text-underline-offset: 0.3em;
    text-decoration-thickness: 3px;

    .title {
      position: relative;

      top: 0;
      left: 0em;

      padding-left: 3em;
      padding-top: 0.4em;
      padding-right: 1em;
      padding-bottom: 0.7em;

      z-index: 2;

      background: coral;

      h1 {
        font-family: 'Rubik', sans-serif;
        font-size: 2.1em;
        font-weight: 600;
        font-style: italic;

        margin-block: 0;
      }
    }
  }

  .corner-right-container {
    position: absolute;
    top: 0;
    right: -2.5em;
    z-index: -1;

    width: 7em;
    height: calc(100%);

    overflow: hidden;
  }

  .corner {
    position: absolute;

    width: 3em;
    height: 3.55em;

    transform: skew(-34deg);
  }
  .left {
    top: -1px;
    left: -1.9em;

    z-index: 3;

    color: #111521;
    background-color: #111521;

    cursor: default;
  }
  .right {
    height: calc(100% + 4px);
    left: unset;
    right: 1.2em;
    bottom: -1px;

    color: coral;
    background-color: coral;
  }

  .summary {
    position: absolute;
    bottom: 0;

    width: 100%;

    display: grid;
    justify-content: center;

    p {
      font-size: 1.8em;
      padding-inline: 1em;
    }
  }
</style>
