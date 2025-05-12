<script lang="ts">
  import { showDefaultSubject } from '$lib/trials/showDefaultSubject';
  import { writable } from 'svelte/store';
  import { setContext } from 'svelte';
  interface Props {
    children?: import('svelte').Snippet;
  }

  let { children }: Props = $props();

  const defaultSubject = writable<HTMLElement | undefined>(undefined);
  setContext('default-subject', defaultSubject);
</script>

<div
  bind:this={$defaultSubject}
  class="subject-element default-subject-element"
  class:hideSubject={!$showDefaultSubject}
>
  subject
</div>

{@render children?.()}
