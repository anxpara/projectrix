<script lang="ts">
  import { getContext, setContext, type Snippet } from 'svelte';
  import { store, type Store } from '$lib/stores/Store';
  import type { Trial } from '$lib/trials/trials.svelte';

  interface Props {
    children?: Snippet;
  }
  let { children }: Props = $props();

  const currentTrialStore: Store<Trial> = getContext('currentTrialStore');
  const hideSubject = $derived(!!currentTrialStore.value.instance?.getSubjectElement?.());

  const defaultSubjectStore = $state(store()) as Store<HTMLElement>;
  setContext('defaultSubjectStore', defaultSubjectStore);
</script>

<div
  bind:this={defaultSubjectStore.value}
  class="subject-element default-subject-element"
  class:hideSubject
>
  subject
</div>

{@render children?.()}
