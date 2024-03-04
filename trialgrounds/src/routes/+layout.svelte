<script lang="ts">
  import { showDefaultSubject } from '$lib/showDefaultSubject';
  import { writable } from 'svelte/store';
  import '../app.scss';
  import { setContext } from 'svelte';

  export let data;

  const defaultSubject = writable<HTMLElement | undefined>(undefined);
  setContext('default-subject', defaultSubject);
</script>

{#if !data.forPlaywright}
  <nav title="trial collections and presets">
    <h1>collections & presets</h1>
    <ul>
      <li>
        <a data-sveltekit-reload href="/"> all </a>
      </li>
      <li>
        <a data-sveltekit-replacestate href="/"> clear options </a>
      </li>
    </ul>
  </nav>
{/if}

<div
  bind:this={$defaultSubject}
  class="subject-element default-subject-element"
  class:hideSubject={!$showDefaultSubject}
>
  subject
</div>

<slot />

<style lang="scss">
  nav {
    position: absolute;
    width: 100vw;
    height: 13em;

    display: flex;
    flex-direction: column;
    align-items: center;

    color: coral;

    ul {
      padding-left: 1em;
    }
  }

  a {
    text-underline-offset: 0.2em;
    color: coral;
  }

  a:visited {
    color: coral;
  }
</style>
