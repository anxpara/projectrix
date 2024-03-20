<script lang="ts">
  import type { Demo } from '$lib/demos/demos';
  import { getContext, onMount, tick } from 'svelte';
  import type { Writable } from 'svelte/store';
  import { fade } from 'svelte/transition';
  import { createTabs, melt } from '@melt-ui/svelte';
  import type { Highlighter } from 'shiki/bundle/web';
  import { codeToHighlightedString } from '$lib/highlightCode';
  import { getProjection } from '../../../dist/es/projectrix';
  import anime from 'animejs';

  export let demo: Demo;
  const usageFigureTitle = `${demo.name} demo usage`;
  const codeTitle = `${demo.name}Demo.svelte`;
  const codeFigureTitle = `${demo.name} demo svelte component file`;

  let triggersByTabId: Record<string, HTMLElement> = {};
  let triggerHighlight: HTMLElement;
  let hlInit = false;

  let figuresByTabId: Record<string, HTMLElement | undefined> = {};
  let figureBg: HTMLElement;
  let bgInit = false;

  const highlighter = getContext<Writable<Highlighter | undefined>>('highlighter');
  const highlightsByTabId: Record<string, string> = {
    'tab-usage': '',
    'tab-code': '',
  };

  const {
    elements: { root, list, content, trigger },
    states: { value },
  } = createTabs({
    defaultValue: 'tab-usage',
  });

  const triggers = [
    { id: 'tab-usage', title: 'Usage' },
    { id: 'tab-code', title: codeTitle },
  ];

  onMount(async () => {
    await tick();
    setTimeout(() => {
      animateTriggerHighlight('tab-usage', true);
      hlInit = true;
    }, 3);
  });

  highlighter.subscribe(async (hl) => {
    if (!hl) return;

    highlightsByTabId['tab-usage'] = codeToHighlightedString(hl, demo.usage, 'typescript');

    await tick(); // prep for bg
    animateFigureBg($value, true);
    bgInit = true;

    await tick(); // separate additional expensive highlight computations
    highlightsByTabId['tab-code'] = codeToHighlightedString(hl, demo.code, 'svelte');
  });

  value.subscribe(async (value: string) => {
    await tick();

    if (hlInit) {
      animateTriggerHighlight(value);
    }
    animateFigureBg(value, !bgInit);
  });

  function animateTriggerHighlight(toTabId: string, skipAnimation = false): void {
    const trigger = triggersByTabId[toTabId];
    if (!trigger) return;

    const { toSubject } = getProjection(trigger, triggerHighlight, {
      transformType: 'matrix3d',
    });
    toSubject.borderWidth = ''; // avoid anime border shorthand bug

    if (skipAnimation) {
      anime.set(triggerHighlight, { ...toSubject, opacity: 1 });
    } else {
      anime({
        targets: triggerHighlight,
        duration: 200,
        easing: 'easeOutQuad',

        ...toSubject,
        opacity: 1,
      });
    }
  }

  function animateFigureBg(toTabId: string, skipAnimation = false): void {
    const figure = figuresByTabId[toTabId];
    if (!figure) return;

    const { toSubject } = getProjection(figure, figureBg, {
      transformType: 'matrix3d',
      useBorder: 'target', // keep figureBg's stylized left border
    });

    if (skipAnimation) {
      anime.set(figureBg, { ...toSubject });
    } else {
      anime({
        targets: figureBg,
        duration: 300,
        easing: 'easeInOutQuad',

        ...toSubject,
      });
    }
  }
</script>

<div use:melt={$root} class="tabbed-code-root">
  <div use:melt={$list} class="trigger-list" aria-label="view usage or full code">
    <div bind:this={triggerHighlight} class="trigger-highlight">
      <div class="corner left" />
      <div class="corner right" />
    </div>
    {#each triggers as triggerItem}
      <button
        bind:this={triggersByTabId[triggerItem.id]}
        use:melt={$trigger(triggerItem.id)}
        class="trigger-button"
        class:selected={$value === triggerItem.id}
      >
        {triggerItem.title}
        <div class="corner left" class:selected={$value === triggerItem.id} />
        <div class="corner right" class:selected={$value === triggerItem.id} />
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
    width: 700px;
  }

  .trigger-list {
    padding-left: 2.4em;
  }

  .trigger-highlight {
    position: absolute;
    font-size: 1.5em;
    border: solid 2px coral;
    z-index: -1;

    background: coral;
    opacity: 0;

    .corner {
      background: coral;
    }
  }

  .trigger-button {
    all: unset;

    position: relative;
    font-size: 1.5em;
    height: calc(1.2em - 4px);
    margin-right: 3em;
    border: solid 2px coral;
    padding: 0.4em 0.1em;
    z-index: 1;

    border-left-color: transparent;
    border-right-color: transparent;
    font-weight: 800;
    font-style: italic;
    letter-spacing: 0.03em;
    cursor: pointer;
    transition: color 0.1s $coralBezier;

    .corner {
      cursor: pointer;
    }
  }
  .trigger-button.selected {
    color: #161b22;
    transition: color 0.1s $coralBezier;
    cursor: default;
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

  .target-slot {
    width: calc(2em - 6px);

    color: transparent;
    background-color: transparent;
    cursor: default;
  }
  .slot-1 {
    right: calc(-3.6em + 4px);
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
