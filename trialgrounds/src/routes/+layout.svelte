<script lang="ts">
  import '../app.scss';

  export let data;
</script>

{#if !data.hideMenu}
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

<slot />

<style lang="scss">
  nav {
    position: absolute;
    width: 100%;
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
