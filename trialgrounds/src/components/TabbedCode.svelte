<script lang="ts">
  import type { Demo } from '$lib/demos/demos';
  import { tick } from 'svelte';
  import { fade } from 'svelte/transition';
  import { createTabs, melt } from '@melt-ui/svelte';
  import { getProjection } from '../../../dist/es/projectrix';
  import anime from 'animejs';

  export let demo: Demo;
  const usageFigureTitle = `${demo.name} demo usage`;
  const codeTitle = `${demo.name}Demo.svelte`;
  const codeFigureTitle = `${demo.name} demo svelte component file`;

  let tabsByTabId: Record<string, HTMLElement> = {};
  let tabBgsByTabId: Record<string, HTMLElement> = {};
  let currentTabBg: HTMLElement | undefined = undefined;

  let figuresByTabId: Record<string, HTMLElement | undefined> = {};
  let figureBg: HTMLElement;
  const highlightsByTabId: Record<string, string> = {
    'tab-usage': demo.usageHL,
    'tab-code': demo.codeHL,
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
    });
    toSubject.borderWidth = ''; // avoid anime border shorthand bug
    toTargetOrigin.borderWidth = '';

    anime.set(tabBg, { ...toSubject });
    anime({
      targets: tabBg,
      duration: 200,
      easing: 'easeOutQuad',

      ...toTargetOrigin,

      complete: () => clearInlineStyles(tabBg),
    });
  }

  function animateFigureBg(toTabId: string, skipAnimation = false): void {
    const figure = figuresByTabId[toTabId];
    if (!figure) return;

    const { toSubject } = getProjection(figure, figureBg, {
      transformType: 'matrix3d',
      useBorder: 'target', // keep figureBg's stylized left border
    });

    if (skipAnimation) {
      anime.set(figureBg, { ...toSubject, width: '' });
    } else {
      anime({
        targets: figureBg,
        duration: 300,
        easing: 'easeInOutQuad',

        ...toSubject,
        width: '',
      });
    }
  }

  function clearInlineStyles(target: HTMLElement): void {
    target.style.width = '';
    target.style.height = '';
    target.style.borderWidth = '';
    target.style.borderStyle = '';
    target.style.borderRadius = '';
    target.style.transformOrigin = '';
    target.style.transform = '';
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
        <div bind:this={tabBgsByTabId[tab.id]} class="tab-bg">
          <div class="corner left" />
          <div class="corner right" />
        </div>
        {tab.title}
        <div class="corner left" class:selected={$value === tab.id} />
        <div class="corner right" class:selected={$value === tab.id} />
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
    padding-left: 2.35em;

    display: flex;
  }

  .tab {
    all: unset;

    font-size: 1.5em;
    display: block;
    
    position: relative;
    margin-right: 2.2em;
    border: solid 2px coral;
    padding: 0.4em 0.1em;
    z-index: 1;

    border-left-color: transparent;
    border-right-color: transparent;
    font-weight: 800;
    font-style: italic;
    letter-spacing: 0.03em;

    cursor: pointer;
    -webkit-tap-highlight-color: transparent;

    transition: color 0.1s $coralBezier;

    .corner {
      cursor: pointer;
    }

    .tab-bg {
      font-size: 1.5em;

      position: absolute;
      top: 0;
      left: 0;
      z-index: -1;

      width: calc(100% - 4px);
      height: calc(100% - 4px);
      border: solid 2px coral;

      background: coral;
      opacity: 0;

      .corner {
        background: inherit;
      }
      .corner.left {
        left: -0.7em;
      }
      .corner.right {
        right: -0.7em;
      }
    }
  }
  .tab:hover {
    border-color: rgb(204, 100, 62);
    border-left-color: transparent;
    border-right-color: transparent;

    .corner {
      border-color: rgb(204, 100, 62);
    }
    .corner.left {
      border-right-color: transparent;
    }
    .corner.right {
      border-left-color: transparent;
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
  .tab.selected:hover {
    border-color: coral;
    border-left-color: transparent;
    border-right-color: transparent;

    .corner {
      border-color: coral;
    }
    .corner.left {
      border-right-color: transparent;
    }
    .corner.right {
      border-left-color: transparent;
    }
  }

  .corner {
    position: absolute;
    top: -2px;

    width: calc(3em - 6px);
    height: calc(100% - 0px);
    border: solid 2px coral;

    transform: skew(-34deg);
  }
  .left {
    left: -1em;
    z-index: 3;

    border-right-color: transparent;
    cursor: default;
  }
  .right {
    left: unset;
    right: -1em;
    bottom: 0;
    z-index: -1;

    border-left-color: transparent;
  }
  .corner.selected {
    cursor: default;
  }

  .figure-bg {
    position: absolute;
    margin-bottom: 2em;
    border-left: solid 1px coral;
    height: 0;
    width: 100%;
    z-index: -1;

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
