<script lang="ts">
  import { onDestroy, type Snippet } from 'svelte';
  import { MediaQuery } from 'svelte/reactivity';
  import { browser } from '$app/environment';
  import { afterNavigate } from '$app/navigation';
  import { animate, utils, type JSAnimation } from 'animejs';
  import { clearInlineStyles, getProjection } from 'projectrix';
  import { onClickOutside, watch } from 'runed';

  const isHoverDeviceMQ = new MediaQuery('(hover: hover)', true);

  type Props = {
    title?: string;
    children: Snippet;
  };
  let { title = '', children }: Props = $props();

  let sizer = $state() as HTMLElement;
  let header = $state() as HTMLElement;
  let headerBg = $state() as HTMLElement;
  let buttonBg = $state() as HTMLElement;
  let menuContent = $state() as HTMLElement;

  let currentHeaderAnim: JSAnimation | undefined = undefined;
  let currentButtonAnim: JSAnimation | undefined = undefined;
  let currentContentAnim: JSAnimation | undefined = undefined;

  let overHeader = $state(false);
  let overContent = $state(false);
  let toggledOpen = $state(false);
  const open: boolean = $derived(overHeader || overContent || toggledOpen);
  const inert = $derived(open ? null : true);

  watch(
    () => open,
    (isOpen, wasOpen) => {
      if (!browser) return;
      if (wasOpen === undefined || isOpen === wasOpen) return;
      requestAnimationFrame(() => animateMenu(isOpen));
    },
  );

  afterNavigate((navigation) => {
    if (
      navigation.from?.route.id === navigation.to?.route.id &&
      navigation.from?.url.search != navigation.to?.url.search
    ) {
      return;
    }
    closeMenu();
  });

  onClickOutside(() => sizer, closeMenu);

  onDestroy(() => {
    currentHeaderAnim?.pause();
    currentButtonAnim?.pause();
    currentContentAnim?.pause();
  });

  function closeMenu(): void {
    overHeader = false;
    overContent = false;
    toggledOpen = false;
  }

  function animateMenu(isOpen: boolean): void {
    if (!browser) return;
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
    if (!isHoverDeviceMQ.current) return;
    overHeader = true;
  }
  function handleMouseLeaveHeader(e: MouseEvent): void {
    if (!isHoverDeviceMQ.current) return;
    setTimeout(() => {
      overHeader = false;
      if (!overContent) toggledOpen = false;
    }, 1);
  }
  function handleClickHeader(e: MouseEvent): void {
    toggledOpen = !open;
    overContent = false;
    overHeader = false;
  }

  function handleMouseEnterContent(e: MouseEvent): void {
    if (!isHoverDeviceMQ.current) return;
    overContent = true;
  }
  function handleMouseLeaveContent(e: MouseEvent): void {
    if (!isHoverDeviceMQ.current) return;
    setTimeout(() => {
      overContent = false;
      if (!overHeader) toggledOpen = false;
    }, 1);
  }
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
  bind:this={header}
  class="menu-header"
  class:open
  onmouseenter={handleMouseEnterHeader}
  onmouseleave={handleMouseLeaveHeader}
  onclick={handleClickHeader}
>
  <div bind:this={headerBg} class="menu-header-bg" class:open></div>
  <h1 class="title">{title}</h1>
  <div class="material-symbols-outlined menu-button-base">
    <button
      bind:this={buttonBg}
      aria-label={open ? 'close menu' : 'open menu'}
      class="menu-button"
      class:open
    >
    </button>
    {#if toggledOpen}
      <span style="font-size: .8em;">close_small</span>
    {:else}
      arrow_drop_down
    {/if}
  </div>
</div>

<dialog
  bind:this={menuContent}
  class="menus-container"
  class:open
  aria-label="main menu"
  {inert}
  onmouseenter={handleMouseEnterContent}
  onmouseleave={handleMouseLeaveContent}
>
  {@render children()}
</dialog>

<style lang="scss">
  .menu-header {
    all: unset;
    -webkit-tap-highlight-color: transparent;

    font-size: 1em;
    position: relative;
    margin-top: 1em;
    padding: 0.5em;
    padding-inline: 1.2em;

    display: flex;
    justify-content: center;
    gap: 0.8em;
    border-radius: 0.3em;

    pointer-events: all;
    cursor: pointer;
    -webkit-user-select: none;
    -ms-user-select: none;
    user-select: none;

    .menu-header-bg {
      z-index: -1;
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;

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
    font-size: 1.5em;
    z-index: 2;
    margin: 0;

    font-family: 'rubik';
    line-height: 1.3em;
    text-align: center;
  }

  .menu-button-base {
    font-size: 1.8em;
    z-index: 1;
    position: relative;
    top: 0.05em;
    width: 0.8em;
    height: 1.1em;

    display: flex;
    justify-content: center;
    align-items: center;

    color: #111521;
    font-weight: 500;
    line-height: 1.1em;

    .menu-button {
      -webkit-tap-highlight-color: transparent;

      z-index: -1;
      position: absolute;
      border: none;
      padding: 0;
      width: 100%;
      height: 100%;

      background: coral;
      transform: skew(-31deg);

      cursor: pointer;
    }
  }

  .menus-container {
    -webkit-tap-highlight-color: transparent;

    z-index: 1;
    position: relative;
    top: -1px;
    border: solid 2px;
    border-top: 1px;
    padding: 1em;

    width: auto;

    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    align-items: center;
    gap: 0 2em;

    opacity: 0;
    color: coral;
    background: hsla(225, 32%, 10%, 0.93);
    transform: translateX(clamp(-3.219cqw, -0.87em, 0em));

    pointer-events: none;
    -webkit-user-select: none;
    -ms-user-select: none;
    user-select: none;

    will-change: transform;
  }
  .menus-container.open {
    opacity: 1;
    pointer-events: all;
  }
</style>
