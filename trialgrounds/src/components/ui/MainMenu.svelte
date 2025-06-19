<script lang="ts">
  import { page } from '$app/state';
  import { sharedOptionNames, trialOptionNames } from '$lib/optionNames';
  import HoverMenu from './HoverMenu.svelte';
  import OptionCheckbox from './OptionCheckbox.svelte';

  const pageUrl = $derived(page.url);
  const viewingTrials = $derived(
    !pageUrl.pathname.includes('demos') && !pageUrl.pathname.includes('perf'),
  );
</script>

<div class="centerer">
  <div class="sizer">
    <HoverMenu title="Projectrix Trialgrounds">
      <nav>
        <a href="/{pageUrl.search}">Trials</a>&nbsp;|&nbsp;<a href="/demos{pageUrl.search}">Demos</a
        >&nbsp;|&nbsp;<a href="/perf{pageUrl.search}">Perf</a>
      </nav>
      <div role="menu" aria-labelledby="menuTitle">
        <p id="menuTitle" class="menu-title">Options:</p>
        <div class="option-groups">
          <fieldset aria-label="common options">
            {#each sharedOptionNames as name}
              <OptionCheckbox {name}></OptionCheckbox>
            {/each}
          </fieldset>
          <fieldset aria-label="trial options">
            {#each trialOptionNames as name}
              <OptionCheckbox {name} irrelevant={!viewingTrials}></OptionCheckbox>
            {/each}
          </fieldset>
        </div>
      </div>
    </HoverMenu>
  </div>
</div>

<style lang="scss">
  .centerer {
    font-size: clamp(0.5em, 1em, 3.7cqw);
    z-index: 3;
    position: relative;
    width: 100%;
    height: 4em;

    container-type: inline-size;

    display: flex;
    flex-direction: column;
    align-items: center;

    pointer-events: none;
  }

  nav {
    font-size: 1.5em;
    padding-bottom: 0.1em;

    display: flex;
    justify-content: center;
    align-items: center;
  }

  .menu-title {
    margin-bottom: 0.5em;
  }

  .option-groups {
    padding-left: 2em;
    display: flex;
    gap: 1.2em;

    fieldset {
      all: unset;

      display: flex;
      flex-direction: column;
      gap: 0.5em;
    }
  }

  p {
    font-size: 1.5em;
    margin-block: 0.67em;
    font-weight: 600;
  }

  a {
    color: coral;
    text-underline-offset: 0.2em;
  }

  a:visited {
    color: coral;
  }
</style>
