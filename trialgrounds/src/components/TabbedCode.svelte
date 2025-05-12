<script lang="ts">
  import type { Demo } from '$lib/demos/demos';
  import { createTabs, melt } from '@melt-ui/svelte';
  import { getProjection, setInlineStyles, clearInlineStyles } from 'projectrix';
  import { animate } from 'motion';
  import { codesByDemoName } from '$lib/demos/codesByDemoName';

  interface Props {
    demo: Demo;
  }

  let { demo }: Props = $props();

  type Tab = {
    id: string;
    title: string;
    figureTitle: string;
    code: string;
    highlightedCode: string;
    tabBg?: HTMLElement;
    figure?: HTMLElement;
  };

  const tabs: Tab[] = $state([
    {
      id: 'tab-usage',
      title: 'Usage',
      figureTitle: `${demo.name} demo usage`,
      code: codesByDemoName.get(demo.name)!.usage,
      highlightedCode: codesByDemoName.get(demo.name)!.usageHL,
    },
    {
      id: 'tab-code',
      title: `${cap(demo.name)}Demo.svelte`,
      figureTitle: `${demo.name} demo svelte component file`,
      code: codesByDemoName.get(demo.name)!.code,
      highlightedCode: codesByDemoName.get(demo.name)!.codeHL,
    },
  ]);

  const tabsById: Record<string, Tab> = {};
  tabs.forEach((tab) => {
    tabsById[tab.id] = tab;
  });

  let currentTab: Tab | undefined = undefined;
  let contentContainer: HTMLElement = $state();

  const {
    elements: { root, list, content, trigger },
    states: { value },
  } = createTabs({
    defaultValue: tabs[0].id,
  });

  value.subscribe(async (nextTabId: string) => {
    requestAnimationFrame(() => {
      flipTab(nextTabId);
      animateContentHeight(nextTabId);
      currentTab = tabsById[nextTabId];
    });
  });

  function flipTab(toTabId: string, skipAnimation = false): void {
    const tabBg = tabsById[toTabId].tabBg;
    if (!tabBg || !currentTab?.tabBg || skipAnimation) return;

    const { toSubject, toTargetOrigin } = getProjection(currentTab.tabBg, tabBg);

    setInlineStyles(tabBg, toSubject);
    animate(
      tabBg,
      {
        ...toTargetOrigin,
      },
      {
        duration: 0.2,
        easing: 'ease-out',
      },
    ).finished.then(() => clearInlineStyles(tabBg));
  }

  function animateContentHeight(toTabId: string, skipAnimation = false): void {
    const figure = tabsById[toTabId].figure;
    if (!figure) return;

    const height = getComputedStyle(figure).height;

    animate(
      contentContainer,
      {
        height,
      },
      {
        duration: skipAnimation ? 0 : 0.3,
        easing: 'ease-in-out',
      },
    );
  }

  function cap(word: string): string {
    return word[0].toUpperCase() + word.substring(1);
  }
</script>

<div use:melt={$root} class="tabbed-code-root">
  <div use:melt={$list} class="tab-list" aria-label="view usage or full code">
    {#each tabs as tab}
      <button use:melt={$trigger(tab.id)} class="tab" class:selected={$value === tab.id}>
        <div class="tab-decor tab-border" class:selected={$value === tab.id}></div>
        <div bind:this={tab.tabBg} class="tab-decor tab-bg"></div>
        {tab.title}
      </button>
    {/each}
  </div>
  <div bind:this={contentContainer} class="content-container">
    {#each tabs as tab}
      <figure
        bind:this={tab.figure}
        use:melt={$content(tab.id)}
        title={tab.figureTitle}
        class="tab-figure"
        class:showTab={$value === tab.id}
      >
        {@html tab.highlightedCode}
      </figure>
    {/each}
  </div>
</div>

<style lang="scss">
  $coralBezier: cubic-bezier(0.49, 0.74, 0, 0.76);

  .tabbed-code-root {
    position: relative;
    width: min(700px, 100%);
    will-change: transform;
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

  .content-container {
    position: relative;

    width: 100%;
    border-left: solid 1px coral;

    background: hsla(16, 100%, 58%, 0.06);

    overflow: hidden;

    figure {
      display: block !important;

      position: absolute;
      top: 0;

      width: 100%;
      margin: 0;

      pointer-events: none;
      opacity: 0;
      transition: 0.1s linear opacity;

      :global(pre.shiki) {
        margin: 0;
        background-color: transparent !important;
      }
    }
    figure.showTab {
      position: relative;

      pointer-events: all;
      opacity: 1;
    }
  }
</style>
