<script lang="ts">
  import { Tabs } from 'bits-ui';
  import { animate } from 'motion';
  import { clearInlineStyles, getProjection, setInlineStyles } from 'projectrix';
  import { codesByDemoName } from '$lib/demos/codesByDemoName';
  import type { DemoName } from '$lib/demos/demoNames';
  import { demosByName, type Demo } from '$lib/demos/demos.svelte';

  interface Props {
    demoName: DemoName;
  }
  let { demoName }: Props = $props();
  const demo: Demo = demosByName.get(demoName)!;

  type Tab = {
    id: string;
    title: string;
    figureTitle: string;
    code: string;
    highlightedCode: string;
    tabBg: HTMLElement;
    figure: HTMLElement;
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
  ]) as Tab[];

  const tabsById: Record<string, Tab> = {};
  tabs.forEach((tab) => {
    tabsById[tab.id] = tab;
  });

  let currentTabId: string = $state(tabs[0].id);
  let currentTab: Tab = tabs[0];
  let contentContainer: HTMLElement;

  function onTabChange(newTabId: string): void {
    requestAnimationFrame(() => {
      flipTab(newTabId, currentTab.id);
      animateContentHeight(newTabId, currentTab.id);
      currentTab = tabsById[newTabId];
    });
  }

  function flipTab(newTabId: string, oldTabId: string, skipAnimation = false): void {
    if (skipAnimation) return;

    const oldTabBg = tabsById[oldTabId].tabBg;
    const newTabBg = tabsById[newTabId].tabBg;
    const { toSubject, toTargetOrigin } = getProjection(oldTabBg, newTabBg);

    setInlineStyles(newTabBg, toSubject);
    animate(
      newTabBg,
      {
        ...toTargetOrigin,
      },
      {
        duration: 0.2,
        easing: 'ease-out',
      },
    ).finished.then(() => clearInlineStyles(newTabBg));
  }

  function animateContentHeight(newTabId: string, _oldTabId: string, skipAnimation = false): void {
    const height = getComputedStyle(tabsById[newTabId].figure).height;
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

<Tabs.Root bind:value={currentTabId} onValueChange={onTabChange}>
  {#snippet child({ props })}
    <div {...props} class="tabbed-code-root">
      <Tabs.List>
        {#snippet child({ props })}
          <div {...props} class="tab-list" aria-label="view usage or full code">
            {#each tabs as tab}
              <Tabs.Trigger value={tab.id}>
                {#snippet child({ props })}
                  <div {...props} class="tab" class:selected={currentTabId === tab.id}>
                    <div
                      class="tab-decor tab-border"
                      class:selected={currentTabId === tab.id}
                    ></div>
                    <div bind:this={tab.tabBg} class="tab-decor tab-bg"></div>
                    {tab.title}
                  </div>
                {/snippet}
              </Tabs.Trigger>
            {/each}
          </div>
        {/snippet}
      </Tabs.List>
      <div bind:this={contentContainer} class="content-container">
        {#each tabs as tab}
          <figure
            bind:this={tab.figure}
            title={tab.figureTitle}
            class="tab-figure"
            class:showTab={currentTabId === tab.id}
          >
            {@html tab.highlightedCode}
          </figure>
        {/each}
      </div>
    </div>
  {/snippet}
</Tabs.Root>

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
    -webkit-tap-highlight-color: transparent;

    font-size: 1.5em;
    z-index: 1;

    position: relative;

    margin-right: 0.3em;
    padding: 0.5em 1.4em 0.5em 1.3em;
    display: block;

    font-weight: 800;
    font-style: italic;
    letter-spacing: 0.03em;

    transition: color 0.1s $coralBezier;

    cursor: pointer;

    .tab-decor {
      position: absolute;
      left: 0;
      top: 0;
      border: solid 2px coral;

      width: calc(100% - 4px);
      height: calc(100% - 4px);

      transform: skew(-34deg);
    }

    .tab-bg {
      z-index: -1;
      opacity: 0;

      background: coral;
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
    border-left: solid 1px coral;
    width: 100%;

    overflow: hidden;

    background: hsla(16, 100%, 58%, 0.06);

    figure {
      position: absolute;
      top: 0;
      margin: 0;
      width: 100%;

      display: block !important;

      opacity: 0;
      transition: 0.1s linear opacity;

      pointer-events: none;

      :global(pre.shiki) {
        margin: 0;
        background-color: transparent !important;
      }
    }
    figure.showTab {
      position: relative;
      opacity: 1;

      pointer-events: all;
    }
  }
</style>
