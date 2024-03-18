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
    <nav aria-labelledby="navTitle">
      <p id="navTitle">directory</p>
      <ul>
        <li>
          <a href="/{$page.url.search}">all trials</a>
        </li>
        <li>
          <a href="/demos{$page.url.search}">all demos</a>
        </li>
      </ul>
    </nav>
    <div role="menu" aria-labelledby="menuTitle">
      <p id="menuTitle">options</p>
      <div class="option-groups">
        <fieldset aria-label="common options">
          {#each sharedOptionNames as name}
            <OptionCheckbox {name}></OptionCheckbox>
          {/each}
        </fieldset>
        <fieldset aria-label="trial options">
          {#each trialOptionNames as name}
            <OptionCheckbox {name} irrelevant={!viewingTrials}></OptionCheckbox>
          {/each}
        </fieldset>
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

  .option-groups {
    display: flex;
    gap: 1.2em;
    padding-left: 1.2em;

    fieldset {
      all: unset;

      display: flex;
      flex-direction: column;
      gap: 0.4em;
    }
  }

  p,
  h1 {
    font-size: 1.5em;
    margin-block: 0.67em;
  }

  p {
    font-weight: 600;
  }

  a {
    text-underline-offset: 0.2em;
    color: coral;
  }

  a:visited {
    color: coral;
  }
</style>
