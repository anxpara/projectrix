<script lang="ts">
  import '$styles/app.scss';
  import { getUrlForOptions, type Options } from '$lib/options';
  import { setContext, type Snippet } from 'svelte';
  import { goto } from '$app/navigation';
  import { browser } from '$app/environment';
  import MainMenu from '$components/ui/MainMenu.svelte';
  import { store, type Store } from '$lib/stores/Store';
  import { page } from '$app/state';
  import type { LayoutData } from './$types';
  import { onStoreChange } from '$lib/stores/onStoreChange.svelte';
  import { allTrials, type Trial } from '$lib/trials/trials.svelte';

  interface Props {
    data: LayoutData;
    children?: Snippet;
  }
  let { data, children }: Props = $props();

  const optionsStore: Store<Options> = $state(store(data.options));
  setContext('optionsStore', optionsStore);
  onStoreChange(() => optionsStore, handleOptionsChanged);

  const currentTrialStore: Store<Trial> = $state(store(allTrials[0]));
  setContext('currentTrialStore', currentTrialStore);

  if (browser) {
    window.addEventListener('popstate', handlePopstate);
  }

  function handlePopstate(): void {
    setUrlToOptions(optionsStore.value);
  }

  function handleOptionsChanged(newOptions: Options): void {
    setUrlToOptions(newOptions);
  }

  function setUrlToOptions(options: Options): void {
    if (!browser) return;

    const currentParams = page.url.searchParams;
    const nextUrl = getUrlForOptions(options, currentParams);

    setTimeout(() => {
      goto(nextUrl, { replaceState: true, keepFocus: true });
    }, 1);
  }
</script>

{#if !optionsStore.value.hideUI}
  <MainMenu></MainMenu>
{/if}

{@render children?.()}

<style lang="scss">
</style>
