<script lang="ts">
  import { showDefaultSubject } from '$lib/trials/showDefaultSubject';
  import { writable } from 'svelte/store';
  import { setContext } from 'svelte';

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

<slot />
