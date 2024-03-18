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
  import { createCollapsible, melt } from '@melt-ui/svelte';

  export let data;

  const options = writable<Options>(data.options);
  setContext('options', options);

  $: viewingTrials = !$page.url.pathname.includes('demos');

  const {
    elements: { root, content, trigger },
    states: { open },
  } = createCollapsible();

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

{#if !$options.hideUI}
  <div use:melt={$root} class="centerer">
    <div use:melt={$trigger} class="menu-header">
      <h1 class="title">Projectrix Trialgrounds</h1>
      <button
        aria-label={$open ? 'close menu' : 'open menu'}
        class="material-symbols-outlined menu-button"
      >
        {#if $open}
          unfold_less
        {:else}
          unfold_more
        {/if}
      </button>
    </div>
    {#if $open}
      <div use:melt={$content} class="menus-container">
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
  </div>
{/if}

<slot />

<style lang="scss">
  .centerer {
    position: relative;
    width: 100%;
    z-index: 3;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    pointer-events: none;
    * > * {
      pointer-events: all;
    }
  }

  .menu-header {
    all: unset;

    display: flex;
    margin-top: 1em;
    border-radius: 0.3em;
    padding: 0.5em;
    gap: 0.5em;

    background: hsla(225, 32%, 10%, 0.8);
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
  }

  .title {
    margin: 0;
    line-height: 1.3em;

    font-family: 'rubik';
    text-align: center;
  }

  .menu-button {
    font-size: 1.8em;
    width: 0.8em;
    height: 1.1em;
    line-height: 1.1em;
    border: none;
    border-radius: 0.15em;

    display: flex;
    justify-content: center;
    align-items: center;

    font-weight: 500;
    color: #111521;
    background: coral;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
  }
  .menu-header:hover {
    .menu-button {
      background-color: rgb(223, 109, 68);
    }
  }

  .menus-container {
    position: relative;
    width: fit-content;
    z-index: 1;

    border-radius: 0.3em;
    padding-inline: 0.3em;
    padding-bottom: 0.4em;

    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    gap: 0 2em;

    color: coral;
    background: hsla(225, 32%, 10%, 0.8);
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
