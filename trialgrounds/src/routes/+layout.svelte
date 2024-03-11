<script lang="ts">
  import { page } from '$app/stores';
  import { allOptionNames, sharedOptionNames, trialOptionNames } from '$lib/optionNames';
  import { writable } from 'svelte/store';
  import '../app.scss';
  import type { Options } from '$lib/options';
  import { setContext } from 'svelte';

  export let data;

  const options = writable<Options>(data.options);
  setContext('options', options);
</script>

{#if !$options.hideMenu}
  <nav title="collections of trials or demos">
    <h1>collections</h1>
    <ul>
      <li>
        <a data-sveltekit-reload href="/{$page.url.search}">all trials</a>
      </li>
      <li>
        <a data-sveltekit-reload href="/demos{$page.url.search}">all demos</a>
      </li>
    </ul>
  </nav>
{/if}

<slot />

<style lang="scss">
  nav {
    position: absolute;
    width: 100%;
    height: 13em;

    display: flex;
    flex-direction: column;
    align-items: center;

    color: coral;

    ul {
      margin-block: 0;
      padding-left: 1em;

      li {
        margin-bottom: 0.6em;
      }
    }
  }

  a {
    text-underline-offset: 0.2em;
    color: coral;
  }

  a:visited {
    color: coral;
  }
</style>
