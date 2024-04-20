<script lang="ts">
  import type { Demo } from '$lib/demos/demos';
  import { getContext, tick } from 'svelte';
  import { fade } from 'svelte/transition';
  import { createTabs, melt } from '@melt-ui/svelte';
  import {
    getProjection,
    setInlineStyles,
    clearInlineStyles,
    type PartialProjectionResults,
  } from 'projectrix';
  import anime from 'animejs';
  import type { Readable } from 'svelte/store';
  import type { CodesByDemoName } from '$lib/demos/demoCodes';

  export let demo: Demo;
  const usageFigureTitle = `${demo.name} demo usage`;
  const codeTitle = `${cap(demo.name)}Demo.svelte`;
  const codeFigureTitle = `${demo.name} demo svelte component file`;

  let tabsByTabId: Record<string, HTMLElement> = {};
  let tabBgsByTabId: Record<string, HTMLElement> = {};
  let currentTabBg: HTMLElement | undefined = undefined;

  let figuresByTabId: Record<string, HTMLElement | undefined> = {};
  let figureBg: HTMLElement;

  const codesByDemoName = getContext<Readable<CodesByDemoName>>('codesByDemoName');
  $: highlightsByTabId = <Record<string, string>>{
    'tab-usage': $codesByDemoName.get(demo.name)!.usageHL,
    'tab-code': $codesByDemoName.get(demo.name)!.codeHL,
  };

  const {
    elements: { root, list, content, trigger },
    states: { value },
  } = createTabs({
    defaultValue: 'tab-usage',
  });

  const tabs = [
    { id: 'tab-usage', title: 'Usage' },
    { id: 'tab-code', title: codeTitle },
  ];

  value.subscribe(async (value: string) => {
    await tick();

    flipTabBg(value);
    animateFigureBg(value);
    currentTabBg = tabBgsByTabId[value];
  });

  function flipTabBg(toTabId: string, skipAnimation = false): void {
    const tabBg = tabBgsByTabId[toTabId];
    if (!tabBg || !currentTabBg || skipAnimation) return;

    const { toSubject, toTargetOrigin } = getProjection(currentTabBg, tabBg, {
      transformType: 'matrix3d',
    }) as PartialProjectionResults;
    delete toSubject.borderWidth; // avoid anime border shorthand bug
    delete toTargetOrigin.borderWidth;

    setInlineStyles(tabBg, toSubject);
    anime({
      targets: tabBg,
      duration: 200,
      easing: 'easeOutQuad',

      ...toTargetOrigin,

      complete: () => clearInlineStyles(tabBg, toTargetOrigin),
    });
  }

  function animateFigureBg(toTabId: string, skipAnimation = false): void {
    const figure = figuresByTabId[toTabId];
    if (!figure) return;

    const { toSubject } = getProjection(figure, figureBg, {
      transformType: 'matrix3d',
      useBorder: 'target', // keep figureBg's stylized left border
    }) as PartialProjectionResults;
    delete toSubject.width; // keep figureBg's 100% width

    if (skipAnimation) {
      setInlineStyles(figureBg, toSubject);
    } else {
      anime({
        targets: figureBg,
        duration: 300,
        easing: 'easeInOutQuad',

        ...toSubject,
      });
    }
  }

  function cap(word: string): string {
    const newWord = word[0].toUpperCase() + word.substring(1);
    return newWord;
  }
</script>

<div use:melt={$root} class="tabbed-code-root">
  <div use:melt={$list} class="tab-list" aria-label="view usage or full code">
    {#each tabs as tab}
      <button
        bind:this={tabsByTabId[tab.id]}
        use:melt={$trigger(tab.id)}
        class="tab"
        class:selected={$value === tab.id}
      >
        <div class="tab-decor tab-border" class:selected={$value === tab.id}></div>
        <div bind:this={tabBgsByTabId[tab.id]} class="tab-decor tab-bg"></div>
        {tab.title}
      </button>
    {/each}
  </div>
  <div bind:this={figureBg} class="figure-bg"></div>
  {#if $value === 'tab-usage'}
    <figure
      bind:this={figuresByTabId['tab-usage']}
      use:melt={$content('tab-usage')}
      transition:fade={{ duration: 100 }}
      title={usageFigureTitle}
      class="tab-figure"
    >
      {@html highlightsByTabId['tab-usage']}
    </figure>
  {/if}
  {#if $value === 'tab-code'}
    <figure
      bind:this={figuresByTabId['tab-code']}
      use:melt={$content('tab-code')}
      transition:fade={{ duration: 100 }}
      title={codeFigureTitle}
      class="tab-figure"
    >
      {@html highlightsByTabId['tab-code']}
    </figure>
  {/if}
  <br />
</div>

<style lang="scss">
  $coralBezier: cubic-bezier(0.49, 0.74, 0, 0.76);

  .tabbed-code-root {
    position: relative;
    width: min(700px, 100%);
  }

  .tab-list {
    font-size: min(1em, 2.9vw);

    position: relative;
    left: 1.04em;
    top: 0.03em;

    width: calc(100% - 1.04em);

    display: flex;
  }

  .tab {
    all: unset;

    font-size: 1.5em;
    display: block;

    position: relative;
    z-index: 1;

    margin-right: 0.3em;
    padding: 0.5em 1.4em 0.5em 1.3em;

    font-weight: 800;
    font-style: italic;
    letter-spacing: 0.03em;

    cursor: pointer;
    -webkit-tap-highlight-color: transparent;

    transition: color 0.1s $coralBezier;

    .tab-decor {
      position: absolute;
      top: 0;
      left: 0;

      width: calc(100% - 4px);
      height: calc(100% - 4px);
      border: solid 2px coral;

      transform: skew(-34deg);
    }

    .tab-bg {
      z-index: -1;

      background: coral;
      opacity: 0;
    }
  }
  .tab.selected {
    color: #161b22;
    transition: color 0.1s $coralBezier;
    cursor: default;

    .tab-bg {
      opacity: 1;
    }
  }
  .tab:hover {
    .tab-border {
      border-color: rgb(204, 100, 62);
    }
  }
  .tab.selected:hover {
    .tab-border {
      border-color: coral;
    }
  }
  .tab:focus-visible {
    .tab-border {
      outline: solid 2px white;
      outline-offset: 2px;
    }
  }

  .figure-bg {
    position: absolute;
    margin-bottom: 2em;
    z-index: -1;

    height: 0;
    width: 100%;
    border-left: solid 1px coral;

    background: hsla(16, 100%, 58%, 0.06);
  }

  figure {
    position: absolute;
    margin: 0;
    margin-bottom: 2em;

    width: 100%;

    pre {
      background: transparent;
    }
  }

  :global(pre.shiki) {
    margin: 0;
    background-color: transparent !important;
  }

  .summary {
    position: absolute;
    bottom: 0;

    width: 100%;

    display: grid;
    justify-content: center;

    p {
      font-size: 1.8em;
      padding-inline: 1em;
    }
  }
</style>
