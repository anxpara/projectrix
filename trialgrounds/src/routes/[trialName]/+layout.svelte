<script lang="ts">
  import { type Snippet } from 'svelte';
  import { currentTrialStoreContext, defaultSubjectStoreContext } from '$lib/contexts/contexts';
  import { store, type Store } from '$lib/stores/Store';
  import type { Trial } from '$lib/trials/trials.svelte';

  interface Props {
    children?: Snippet;
  }
  let { children }: Props = $props();

  const currentTrialStore: Store<Trial> = currentTrialStoreContext.get();
  const hideSubject = $derived(!!currentTrialStore.value.instance?.getSubjectElement?.());

  const defaultSubjectStore = $state(store()) as Store<HTMLElement>;
  defaultSubjectStoreContext.set(defaultSubjectStore);
</script>

<div
  bind:this={defaultSubjectStore.value}
  class="subject-element default-subject-element"
  class:hideSubject
>
  subject
</div>

{@render children?.()}
