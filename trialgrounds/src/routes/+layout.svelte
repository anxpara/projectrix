<script lang="ts">
  import { page } from '$app/stores';
  import { sharedOptionNames, trialOptionNames } from '$lib/optionNames';
  import { writable } from 'svelte/store';
  import '../app.scss';
  import { getUrlForOptions, type Options } from '$lib/options';
  import { setContext } from 'svelte';
  import OptionCheckbox from '../components/melt/OptionCheckbox.svelte';
  import { goto } from '$app/navigation';
  import { browser } from '$app/environment';

  export let data;

  const options = writable<Options>(data.options);
  setContext('options', options);

  $: viewingTrials = !$page.url.pathname.includes('demos');

  if (browser) {
    window.addEventListener('popstate', handlePopstate);
    options.subscribe(handleOptionsChanged);
  }

  function handlePopstate(): void {
    setUrlToOptions($options);
  }

  function handleOptionsChanged(newOptions: Options): void {
    setUrlToOptions(newOptions);
  }

  function setUrlToOptions(options: Options): void {
    if (!browser) return;

    const currentParams = $page.url.searchParams;
    const nextUrl = getUrlForOptions(options, currentParams);

    setTimeout(() => {
      goto(nextUrl, { replaceState: true, keepFocus: true });
    }, 1);
  }
</script>

{#if !$options.hideMenu}
  <h1 class="title">Projectrix Trialgrounds</h1>
  <div class="menus-container">
    <nav title="collections of trials or demos">
      <h1>collections</h1>
      <ul>
        <li>
          <a href="/{$page.url.search}">all trials</a>
        </li>
        <li>
          <a href="/demos{$page.url.search}">all demos</a>
        </li>
      </ul>
    </nav>
    <div class="options-menu">
      <h1>options</h1>
      <div class="option-groups">
        <div class="option-group">
          {#each sharedOptionNames as name}
            <OptionCheckbox {name}></OptionCheckbox>
          {/each}
        </div>
        <div class="option-group">
          {#each trialOptionNames as name}
            <OptionCheckbox {name} irrelevant={!viewingTrials}></OptionCheckbox>
          {/each}
        </div>
      </div>
    </div>
  </div>
{/if}

<slot />

<style lang="scss">
  .title {
    margin-bottom: 0;

    font-family: 'rubik';
    text-align: center;
  }

  .menus-container {
    position: relative;
    width: 100%;
    z-index: 1;

    display: flex;
    flex-direction: row;
    justify-content: center;
    gap: 2em;

    color: coral;
  }

  nav {
    display: flex;
    flex-direction: column;
    align-items: center;

    ul {
      margin-block: 0;
      padding-left: 1em;

      li {
        margin-bottom: 0.6em;
      }
    }
  }

  .options-menu {
    display: flex;
    flex-direction: column;
    gap: 0.2em;
  }

  .option-groups {
    display: flex;
    gap: 1.2em;
    padding-left: 1.2em;
  }

  .option-group {
    display: flex;
    flex-direction: column;
    gap: 0.4em;
  }

  h1 {
    font-size: 1.5em;
    margin-block: 0.67em;
  }

  a {
    text-underline-offset: 0.2em;
    color: coral;
  }

  a:visited {
    color: coral;
  }
</style>
