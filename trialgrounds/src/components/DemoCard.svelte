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

<div class="demo-card">
  <a {href} class="title-link">
    <div class="corner left" />
    <div class="title">
      <div class="corner-right-container">
        <div class="corner right" />
      </div>

      <DemoStartSlot bind:this={startSlot}></DemoStartSlot>

      <h1>/{demo.name}</h1>
    </div>
  </a>

  <div class="demo-container prevent-select disable-touch-zoom">
    <svelte:component this={demo.demoType} bind:this={demo.demoComponent} {startSlot} {options} />
  </div>

  <div class="summary">
    <p>{demo.summary}</p>
  </div>
</div>

<style lang="scss">
  $pxem: 16;

  .prevent-select {
    -webkit-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }

  .disable-touch-zoom {
    touch-action: manipulation;
  }

  .demo-card {
    position: relative;
    margin-bottom: 1.5em;

    width: min(700px, calc(100% - 2px));

    border: solid 1px coral;

    container-type: inline-size;
    will-change: transform;
  }

  .title-link {
    font-size: min(1em, 3.6cqw);

    display: block;
    width: fit-content;

    color: #111521;
    text-underline-offset: 0.3em;
    text-decoration-thickness: calc(3 / $pxem * 1em);

    -webkit-tap-highlight-color: transparent;

    .title {
      position: relative;

      top: 0;
      left: 0em;

      padding-left: 3em;
      padding-top: 0.4em;
      padding-right: 1.3em;
      padding-bottom: 0.7em;

      z-index: 2;

      background: coral;

      h1 {
        margin-block: 0;

        font-family: 'Rubik', sans-serif;
        font-size: 2.1em;
        font-weight: 600;
        font-style: italic;
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
    pointer-events: none;
  }

  .corner {
    position: absolute;

    width: 3em;
    height: 3.55em;

    transform: skew(-34deg);
  }
  .left {
    font-size: 1em;
    top: -1px;
    left: -1.9em;

    z-index: 3;

    color: #111521;
    background-color: #111521;

    cursor: default;
  }
  .right {
    height: calc(100% + 0.25em);
    left: unset;
    right: 1.2em;
    bottom: -1px;

    color: coral;
    background-color: coral;
    pointer-events: all;
  }

  .summary {
    width: 100%;

    display: grid;
    justify-content: center;

    p {
      font-size: min(1.8em, 5.9cqw);
      padding-inline: 1em;
      margin-block: 0.5em;
    }
  }
</style>
