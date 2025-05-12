<script lang="ts">
  import OptionCheckbox from '../melt/OptionCheckbox.svelte';
  import { getContext, onMount } from 'svelte';
  import { derived, writable, type Readable } from 'svelte/store';
  import { afterNavigate } from '$app/navigation';
  import { browser } from '$app/environment';
  import { isHoverDevice } from '$lib/stores/isHoverDevice';
  import { addChangeEmitsToReadable } from '$lib/stores/addChangeEmitsToStore';
  import { sharedOptionNames, trialOptionNames } from '$lib/optionNames';
  import { clearInlineStyles, getProjection } from 'projectrix';
  import { animate, JSAnimation, utils } from 'animejs';

  let root: HTMLElement = $state();
  let header: HTMLElement = $state();
  let headerBg: HTMLElement = $state();
  let buttonBg: HTMLElement = $state();
  let menuContent: HTMLElement = $state();

  let currentHeaderAnim: JSAnimation | undefined = undefined;
  let currentButtonAnim: JSAnimation | undefined = undefined;
  let currentContentAnim: JSAnimation | undefined = undefined;

  const pageUrl = getContext<Readable<URL>>('pageUrl');
  let viewingTrials = $derived(!$pageUrl.pathname.includes('demos') && !$pageUrl.pathname.includes('perf'));

  const overHeader = writable<boolean>(false);
  const overContent = writable<boolean>(false);
  const toggledOpen = writable<boolean>(false);
  const menuOpen = addChangeEmitsToReadable<boolean>(
    derived(
      [overHeader, overContent, toggledOpen],
      ([isOverHeader, isOverContent, isToggledOpen]) => {
        return isOverHeader || isOverContent || isToggledOpen;
      },
    ),
    false,
  );
  menuOpen.changes.subscribe(async (isOpen) => {
    if (!browser) return;
    requestAnimationFrame(() => animateMenu(isOpen));
  });
  let inert = $derived($menuOpen ? null : true);

  onMount(() => {
    document.addEventListener('click', handleDocumentClick);
  });

  afterNavigate((navigation) => {
    if (
      navigation.from?.route.id === navigation.to?.route.id &&
      navigation.from?.url.search != navigation.to?.url.search
    ) {
      return;
    }
    closeMenu();
  });

  function closeMenu(): void {
    $overHeader = false;
    $overContent = false;
    $toggledOpen = false;
  }

  function animateMenu(isOpen: boolean): void {
    animateHeader(isOpen);
    flipButton(isOpen);
    animateContent(isOpen);
  }

  function animateHeader(isOpen: boolean): void {
    currentHeaderAnim?.pause();

    const from = isOpen ? '#ff7f50' : '#111521';
    const to = isOpen ? '#111521' : '#ff7f50';

    utils.set(header, { color: from });
    currentHeaderAnim = animate(header, {
      color: to,

      duration: 200,
      ease: isOpen ? 'inQuad' : 'inExpo',

      onComplete: () => {
        header.style.color = '';
      },
    });
  }

  function flipButton(isOpen: boolean): void {
    currentButtonAnim?.pause();

    const subject = isOpen ? buttonBg : headerBg;
    const target = isOpen ? headerBg : buttonBg;
    const { toSubject, toTargetOrigin } = getProjection(subject, target);

    utils.set(target, toSubject);
    currentButtonAnim = animate(target, {
      ...toTargetOrigin,

      duration: 200,
      ease: 'inExpo',

      onComplete: () => {
        clearInlineStyles(target);
      },
    });
  }

  function animateContent(isOpen: boolean): void {
    currentContentAnim?.pause();

    if (!isOpen) {
      menuContent.style.opacity = '';
      return;
    }

    utils.set(menuContent, { opacity: 0, borderColor: '#ff7f5000' });
    currentContentAnim = animate(menuContent, {
      opacity: { to: 1, ease: 'inExpo' },
      borderColor: { to: '#ff7f50ff', ease: 'inQuad' },

      duration: 200,

      onComplete: () => {
        menuContent.style.opacity = '';
        menuContent.style.borderColor = '';
      },
    });
  }

  function handleMouseEnterHeader(e: MouseEvent): void {
    if (!$isHoverDevice) return;
    $overHeader = true;
  }
  function handleMouseLeaveHeader(e: MouseEvent): void {
    if (!$isHoverDevice) return;
    setTimeout(() => {
      $overHeader = false;
      if (!$overContent) $toggledOpen = false;
    }, 1);
  }
  function handleClickHeader(e: MouseEvent): void {
    $toggledOpen = !$menuOpen;
    $overContent = false;
    $overHeader = false;
  }

  function handleMouseEnterContent(e: MouseEvent): void {
    if (!$isHoverDevice) return;
    $overContent = true;
  }
  function handleMouseLeaveContent(e: MouseEvent): void {
    if (!$isHoverDevice) return;
    setTimeout(() => {
      $overContent = false;
      if (!$overHeader) $toggledOpen = false;
    }, 1);
  }

  function handleDocumentClick(e: MouseEvent): void {
    const target = e.target as HTMLElement;
    if (!$menuOpen || root.isSameNode(target) || root.contains(target)) return;
    closeMenu();
  }
</script>

<div bind:this={root} class="centerer">
  <div class="sizer">
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div
      bind:this={header}
      class="menu-header"
      class:open={$menuOpen}
      onmouseenter={handleMouseEnterHeader}
      onmouseleave={handleMouseLeaveHeader}
      onclick={handleClickHeader}
    >
      <div bind:this={headerBg} class="menu-header-bg" class:open={$menuOpen}></div>
      <h1 class="title">Projectrix Trialgrounds</h1>
      <div class="material-symbols-outlined menu-button-base">
        <button
          bind:this={buttonBg}
          aria-label={$menuOpen ? 'close menu' : 'open menu'}
          class="menu-button"
          class:open={$menuOpen}
        >
        </button>
        {#if $toggledOpen}
          <span style="font-size: .8em;">close_small</span>
        {:else}
          arrow_drop_down
        {/if}
      </div>
    </div>

    <dialog
      bind:this={menuContent}
      class="menus-container"
      class:open={$menuOpen}
      aria-label="main menu"
      {inert}
      onmouseenter={handleMouseEnterContent}
      onmouseleave={handleMouseLeaveContent}
    >
      <nav>
        <a href="/{$pageUrl.search}">Trials</a>&nbsp;|&nbsp;<a href="/demos{$pageUrl.search}"
          >Demos</a
        >&nbsp;|&nbsp;<a href="/perf{$pageUrl.search}">Perf</a>
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
    </dialog>
  </div>
</div>

<style lang="scss">
  .centerer {
    position: relative;
    width: 100%;
    height: 4em;
    z-index: 3;

    display: flex;
    flex-direction: column;
    align-items: center;

    container-type: inline-size;

    pointer-events: none;
  }

  .menu-header {
    all: unset;

    font-size: clamp(0.5em, 1em, 3.7cqw);
    position: relative;
    margin-top: 1em;
    border-radius: 0.3em;
    padding: 0.5em;
    padding-inline: 1.2em;

    display: flex;
    justify-content: center;
    gap: 0.8em;

    pointer-events: all;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
    -webkit-user-select: none;
    -ms-user-select: none;
    user-select: none;

    .menu-header-bg {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: -1;

      background: hsla(225, 32%, 10%, 0.8);
      transform: skew(-31deg);
    }
    .menu-header-bg.open {
      background: coral;
    }
  }
  .menu-header.open {
    color: #111521;
  }

  .title {
    z-index: 2;
    margin: 0;
    line-height: 1.3em;

    font-family: 'rubik';
    text-align: center;
  }

  .menu-button-base {
    position: relative;
    top: 0.05em;
    z-index: 1;

    font-size: 1.8em;
    width: 0.8em;
    height: 1.1em;
    line-height: 1.1em;

    display: flex;
    justify-content: center;
    align-items: center;

    font-weight: 500;
    color: #111521;

    .menu-button {
      position: absolute;
      z-index: -1;
      width: 100%;
      height: 100%;

      border: none;
      padding: 0;

      background: coral;
      transform: skew(-31deg);

      cursor: pointer;
      -webkit-tap-highlight-color: transparent;
    }
  }

  .menus-container {
    position: relative;
    top: -1px;
    transform: translateX(clamp(-3.219cqw, -0.87em, 0em));
    z-index: 1;

    width: auto;
    border: solid 2px;
    border-top: 1px;
    padding: 1em;

    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    align-items: center;
    gap: 0 2em;

    opacity: 0;
    color: coral;
    background: hsla(225, 32%, 10%, 0.93);

    will-change: transform;

    pointer-events: none;
    -webkit-tap-highlight-color: transparent;
    -webkit-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }
  .menus-container.open {
    opacity: 1;
    pointer-events: all;
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
    display: flex;
    gap: 1.2em;
    padding-left: 2em;

    fieldset {
      all: unset;

      display: flex;
      flex-direction: column;
      gap: 0.5em;
    }
  }

  p,
  h1 {
    font-size: 1.5em;
    margin-block: 0.67em;
  }

  p {
    font-weight: 600;
  }

  a {
    text-underline-offset: 0.2em;
    color: coral;
  }

  a:visited {
    color: coral;
  }
</style>
