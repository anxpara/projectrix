<script lang="ts">
  import '../app.scss';

  export let data;
</script>

{#if !data.hideMenu}
  <nav title="collections of trials or demos">
    <h1>collections</h1>
    <ul>
      <li>
        <a data-sveltekit-reload href="/">all trials</a>
      </li>
      <li>
        <a data-sveltekit-reload href="/demos">all demos</a>
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
      margin-block: 0;
      padding-left: 1em;

      li {
        margin-bottom: 0.6em;
      }
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
