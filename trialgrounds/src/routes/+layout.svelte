<script lang="ts">
  import '../app.scss';
  import { page } from '$app/stores';
  import { derived, writable } from 'svelte/store';
  import { getUrlForOptions, type Options } from '$lib/options';
  import { onMount, setContext } from 'svelte';
  import { goto } from '$app/navigation';
  import { browser } from '$app/environment';
  import MainMenu from '../components/menus/MainMenu.svelte';
  import type { Highlighter } from 'shiki/bundle/web';
  import { getShikiHighlighter, logUpToDateHighlightsToConsole } from '$lib/highlightCode';

  export let data;

  const options = writable<Options>(data.options);
  setContext('options', options);

  const pageUrl = derived(page, (page) => {
    return page.url;
  });
  setContext('pageUrl', pageUrl);

  const highlighter = writable<Highlighter | undefined>(undefined);
  setContext('highlighter', highlighter);

  if (browser) {
    window.addEventListener('popstate', handlePopstate);
    options.subscribe(handleOptionsChanged);
  }

  onMount(async () => {
    $highlighter = await getShikiHighlighter();
  });

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

  // highlighter.subscribe((hl) => {
  //   if (!hl) return;
  //   logUpToDateHighlightsToConsole(hl);
  // });
</script>

{#if !$options.hideUI}
  <MainMenu></MainMenu>
{/if}

<slot />

<style lang="scss">
</style>
