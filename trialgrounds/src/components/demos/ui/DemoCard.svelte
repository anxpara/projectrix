<script lang="ts">
  import { optionsStoreContext } from '$lib/contexts/contexts';
  import type { DemoName } from '$lib/demos/demoNames';
  import { demosByName, type Demo } from '$lib/demos/demos.svelte';
  import type { Options } from '$lib/options';
  import type { Store } from '$lib/stores/Store';
  import DemoStartSlot from './DemoStartSlot.svelte';

  interface Props {
    demoName: DemoName;
    href: string;
  }
  let { demoName, href }: Props = $props();
  const demo: Demo = demosByName.get(demoName)!;

  const optionsStore: Store<Options> = optionsStoreContext.get();

  let startSlot = $state() as DemoStartSlot;
</script>

<div class="demo-card">
  <a {href} class="title-link">
    <div class="corner left"></div>
    <div class="title">
      <div class="corner-right-container">
        <div class="corner right"></div>
      </div>

      <DemoStartSlot bind:this={startSlot}></DemoStartSlot>

      <h1>/{demo.name}</h1>
    </div>
  </a>

  <div class="demo-container prevent-select disable-touch-zoom">
    <demo.Component bind:this={demo.instance} {startSlot} options={optionsStore} />
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

    border: solid 1px coral;
    width: min(700px, calc(100% - 2px));

    container-type: inline-size;
    will-change: transform;
  }

  .title-link {
    -webkit-tap-highlight-color: transparent;
    font-size: min(1em, 3.6cqw);
    width: fit-content;

    display: block;

    color: #111521;
    text-decoration-thickness: calc(3 / $pxem * 1em);
    text-underline-offset: 0.3em;

    .title {
      z-index: 2;
      position: relative;
      left: 0em;
      top: 0;

      padding-left: 3em;
      padding-right: 1.3em;
      padding-top: 0.4em;
      padding-bottom: 0.7em;

      background: coral;

      h1 {
        font-size: 2.1em;
        margin-block: 0;

        font-family: 'Rubik', sans-serif;
        font-weight: 600;
        font-style: italic;
      }
    }
  }

  .corner-right-container {
    z-index: -1;
    position: absolute;
    right: -2.5em;
    top: 0;
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
    z-index: 3;
    left: -1.9em;
    top: -1px;

    color: #111521;
    background-color: #111521;
    cursor: default;
  }
  .right {
    left: unset;
    right: 1.2em;
    bottom: -1px;
    height: calc(100% + 0.25em);

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
      margin-block: 0.5em;
      padding-inline: 1em;
    }
  }
</style>
