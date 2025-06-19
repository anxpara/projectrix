<script lang="ts">
  import { type Snippet } from 'svelte';
  import { browser } from '$app/environment';
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import { currentTrialStoreContext, optionsStoreContext } from '$lib/contexts/contexts';
  import { getUrlForOptions, type Options } from '$lib/options';
  import { onStoreChange } from '$lib/stores/onStoreChange.svelte';
  import { store, type Store } from '$lib/stores/Store';
  import { allTrials, type Trial } from '$lib/trials/trials.svelte';
  import type { LayoutData } from './$types';
  import MainMenu from '$components/ui/MainMenu.svelte';
  import '$styles/app.scss';

  interface Props {
    data: LayoutData;
    children?: Snippet;
  }
  let { data, children }: Props = $props();

  const optionsStore: Store<Options> = $state(store(data.options));
  optionsStoreContext.set(optionsStore);
  onStoreChange(() => optionsStore, handleOptionsChanged);

  const currentTrialStore: Store<Trial> = $state(store(allTrials[0]));
  currentTrialStoreContext.set(currentTrialStore);

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
