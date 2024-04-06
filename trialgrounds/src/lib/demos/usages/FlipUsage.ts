export const FlipUsage = `import { getProjection, measureSubject, setInlineStyles, clearInlineStyles } from 'projectrix';
import { animate } from 'motion';

function flip(target: HTMLElement, nextParent: HTMLElement): void {
  const subject = measureSubject(target);

  nextParent.append(target);

  requestAnimationFrame(() => {
    const { toSubject, toTargetOrigin } = getProjection(subject, target);

    // set target to subject's projection
    setInlineStyles(target, toSubject);

    // FLIP back to origin
    const flipAnimation = animate(
      target,
      { ...toTargetOrigin },
      {
        duration: 1,
        easing: 'ease-out',
      },
    );

    // clear inline styles once they're redundant
    flipAnimation.finished.then(() => clearInlineStyles(target, toTargetOrigin));
  });
}`;

export const FlipCode = `<script lang="ts">
  import { onDestroy, onMount, tick } from 'svelte';
  import { getProjection, clearInlineStyles, setInlineStyles, measureSubject } from 'projectrix';
  import { animate, type AnimationControls } from 'motion';
  import type { Writable } from 'svelte/store';
  import type { Options } from '$lib/options';
  import type DemoStartSlot from '../DemoStartSlot.svelte';

  // start slot and options are part of demos infrastructure
  export let startSlot: DemoStartSlot;
  export let options: Writable<Options>;
  $: log = $options.log;

  let target: HTMLElement;
  let leftParent: HTMLElement;
  let rightParent: HTMLElement;

  let currentParent: HTMLElement | undefined;
  let currentAnim: AnimationControls | undefined;
  let currentTimeout: NodeJS.Timeout | undefined;

  onMount(async () => {
    await tick();
    startSlot.show();
    currentParent = leftParent;

    currentTimeout = setTimeout(() => {
      flipToNextParent();
    }, 1000);
  });

  onDestroy(() => {
    currentAnim?.pause();
    currentAnim = undefined;

    clearTimeout(currentTimeout);
    currentTimeout = undefined;
  });

  function flipToNextParent(): void {
    let subjectEl = startSlot.isShowing() ? startSlot.getSlotSubject() : target;
    const subject = measureSubject(subjectEl);

    const nextParent = currentParent === rightParent ? leftParent : rightParent;
    nextParent.append(target);
    currentParent = nextParent;

    requestAnimationFrame(() => {
      const { toSubject, toTargetOrigin } = getProjection(subject, target, { log });

      setInlineStyles(target, toSubject);
      target.style.opacity = '1';
      startSlot.hide();

      currentAnim = animate(
        target,
        {
          ...toTargetOrigin,
        },
        {
          duration: 1,
          easing: 'ease-out',
        },
      );

      currentAnim.finished.then(() => {
        clearInlineStyles(target);

        playParentAnimation(nextParent).finished.then(() => {
          currentTimeout = setTimeout(() => {
            flipToNextParent();
          }, 1000);
        });
      });
    });
  }

  function playParentAnimation(parent: HTMLElement): AnimationControls {
    const dir = parent === rightParent ? -1 : 1;

    currentAnim = animate(
      parent,
      {
        transform: [
          'skew(' + 15 * dir + 'deg)',
          'skew(' + 15 * dir + 'deg) rotate(' + -20 * dir + 'deg)',
          'skew(' + 15 * dir + 'deg) rotate(' + 20 * dir + 'deg)',
          'skew(' + 15 * dir + 'deg)',
        ],
      },
      {
        duration: 1,
        easing: 'ease-in-out',
      },
    );

    return currentAnim;
  }
</script>

<div class="size-container">
  <div class="parents-container">
    <div bind:this={leftParent} class="parent left">
      <div bind:this={target} class="demo-target child" />
    </div>

    <div bind:this={rightParent} class="parent right"></div>
  </div>
</div>

<style lang="scss">
  .size-container {
    position: relative;
    width: 100%;
    aspect-ratio: 4 / 1;
    margin-top: 1.5em;

    container-type: size;
  }

  .parents-container {
    width: 100%;
    height: 100%;

    display: flex;
    justify-content: center;
    align-items: center;

    gap: 25cqw;
  }

  .parent {
    width: 21cqw;
    height: 21cqw;
    border: dashed 3px darkmagenta;

    will-change: transform;

    .demo-target {
      position: absolute;
      top: 0px;
      left: 0px;

      width: 10.75cqw;
      height: 10.75cqw;

      // last i checked, safari webkit can't handle non-integer borders
      // on transformed elements, so i always recommend pixels for borders
      border: solid 3px limegreen;

      opacity: 0;
    }
  }
  .left {
    transform: skew(15deg);
  }
  .right {
    transform: skew(-15deg);
  }
</style>`;

export const FlipUsageHL = `<pre class="shiki one-dark-pro" style="background-color:#282c34;color:#abb2bf" tabindex="0"><code><span class="line"><span style="color:#C678DD">import</span><span style="color:#ABB2BF"> { </span><span style="color:#E06C75">getProjection</span><span style="color:#ABB2BF">, </span><span style="color:#E06C75">measureSubject</span><span style="color:#ABB2BF">, </span><span style="color:#E06C75">setInlineStyles</span><span style="color:#ABB2BF">, </span><span style="color:#E06C75">clearInlineStyles</span><span style="color:#ABB2BF"> } </span><span style="color:#C678DD">from</span><span style="color:#98C379"> 'projectrix'</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#C678DD">import</span><span style="color:#ABB2BF"> { </span><span style="color:#E06C75">animate</span><span style="color:#ABB2BF"> } </span><span style="color:#C678DD">from</span><span style="color:#98C379"> 'motion'</span><span style="color:#ABB2BF">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD">function</span><span style="color:#61AFEF"> flip</span><span style="color:#ABB2BF">(</span><span style="color:#E06C75;font-style:italic">target</span><span style="color:#ABB2BF">: </span><span style="color:#E5C07B">HTMLElement</span><span style="color:#ABB2BF">, </span><span style="color:#E06C75;font-style:italic">nextParent</span><span style="color:#ABB2BF">: </span><span style="color:#E5C07B">HTMLElement</span><span style="color:#ABB2BF">): </span><span style="color:#E5C07B">void</span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#C678DD">  const</span><span style="color:#E5C07B"> subject</span><span style="color:#56B6C2"> =</span><span style="color:#61AFEF"> measureSubject</span><span style="color:#ABB2BF">(</span><span style="color:#E06C75">target</span><span style="color:#ABB2BF">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E5C07B">  nextParent</span><span style="color:#ABB2BF">.</span><span style="color:#61AFEF">append</span><span style="color:#ABB2BF">(</span><span style="color:#E06C75">target</span><span style="color:#ABB2BF">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#61AFEF">  requestAnimationFrame</span><span style="color:#ABB2BF">(() </span><span style="color:#C678DD">=></span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#C678DD">    const</span><span style="color:#ABB2BF"> { </span><span style="color:#E5C07B">toSubject</span><span style="color:#ABB2BF">, </span><span style="color:#E5C07B">toTargetOrigin</span><span style="color:#ABB2BF"> } </span><span style="color:#56B6C2">=</span><span style="color:#61AFEF"> getProjection</span><span style="color:#ABB2BF">(</span><span style="color:#E06C75">subject</span><span style="color:#ABB2BF">, </span><span style="color:#E06C75">target</span><span style="color:#ABB2BF">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic">    // set target to subject's projection</span></span>
<span class="line"><span style="color:#61AFEF">    setInlineStyles</span><span style="color:#ABB2BF">(</span><span style="color:#E06C75">target</span><span style="color:#ABB2BF">, </span><span style="color:#E06C75">toSubject</span><span style="color:#ABB2BF">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic">    // FLIP back to origin</span></span>
<span class="line"><span style="color:#C678DD">    const</span><span style="color:#E5C07B"> flipAnimation</span><span style="color:#56B6C2"> =</span><span style="color:#61AFEF"> animate</span><span style="color:#ABB2BF">(</span></span>
<span class="line"><span style="color:#E06C75">      target</span><span style="color:#ABB2BF">,</span></span>
<span class="line"><span style="color:#ABB2BF">      { ...</span><span style="color:#E06C75">toTargetOrigin</span><span style="color:#ABB2BF"> },</span></span>
<span class="line"><span style="color:#ABB2BF">      {</span></span>
<span class="line"><span style="color:#E06C75">        duration</span><span style="color:#ABB2BF">: </span><span style="color:#D19A66">1</span><span style="color:#ABB2BF">,</span></span>
<span class="line"><span style="color:#E06C75">        easing</span><span style="color:#ABB2BF">: </span><span style="color:#98C379">'ease-out'</span><span style="color:#ABB2BF">,</span></span>
<span class="line"><span style="color:#ABB2BF">      },</span></span>
<span class="line"><span style="color:#ABB2BF">    );</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic">    // clear inline styles once they're redundant</span></span>
<span class="line"><span style="color:#E5C07B">    flipAnimation</span><span style="color:#ABB2BF">.</span><span style="color:#E5C07B">finished</span><span style="color:#ABB2BF">.</span><span style="color:#61AFEF">then</span><span style="color:#ABB2BF">(() </span><span style="color:#C678DD">=></span><span style="color:#61AFEF"> clearInlineStyles</span><span style="color:#ABB2BF">(</span><span style="color:#E06C75">target</span><span style="color:#ABB2BF">, </span><span style="color:#E06C75">toTargetOrigin</span><span style="color:#ABB2BF">));</span></span>
<span class="line"><span style="color:#ABB2BF">  });</span></span>
<span class="line"><span style="color:#ABB2BF">}</span></span></code></pre>`;

export const FlipCodeHL = `<pre class="shiki one-dark-pro" style="background-color:#282c34;color:#abb2bf" tabindex="0"><code><span class="line"><span style="color:#ABB2BF">&#x3C;</span><span style="color:#E06C75">script</span><span style="color:#D19A66"> lang</span><span style="color:#ABB2BF">=</span><span style="color:#98C379">"ts"</span><span style="color:#ABB2BF">></span></span>
<span class="line"><span style="color:#C678DD">  import</span><span style="color:#ABB2BF"> { </span><span style="color:#E06C75">onDestroy</span><span style="color:#ABB2BF">, </span><span style="color:#E06C75">onMount</span><span style="color:#ABB2BF">, </span><span style="color:#E06C75">tick</span><span style="color:#ABB2BF"> } </span><span style="color:#C678DD">from</span><span style="color:#98C379"> 'svelte'</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#C678DD">  import</span><span style="color:#ABB2BF"> { </span><span style="color:#E06C75">getProjection</span><span style="color:#ABB2BF">, </span><span style="color:#E06C75">clearInlineStyles</span><span style="color:#ABB2BF">, </span><span style="color:#E06C75">setInlineStyles</span><span style="color:#ABB2BF">, </span><span style="color:#E06C75">measureSubject</span><span style="color:#ABB2BF"> } </span><span style="color:#C678DD">from</span><span style="color:#98C379"> 'projectrix'</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#C678DD">  import</span><span style="color:#ABB2BF"> { </span><span style="color:#E06C75">animate</span><span style="color:#ABB2BF">, </span><span style="color:#C678DD">type</span><span style="color:#E06C75"> AnimationControls</span><span style="color:#ABB2BF"> } </span><span style="color:#C678DD">from</span><span style="color:#98C379"> 'motion'</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#C678DD">  import</span><span style="color:#C678DD"> type</span><span style="color:#ABB2BF"> { </span><span style="color:#E06C75">Writable</span><span style="color:#ABB2BF"> } </span><span style="color:#C678DD">from</span><span style="color:#98C379"> 'svelte/store'</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#C678DD">  import</span><span style="color:#C678DD"> type</span><span style="color:#ABB2BF"> { </span><span style="color:#E06C75">Options</span><span style="color:#ABB2BF"> } </span><span style="color:#C678DD">from</span><span style="color:#98C379"> '$lib/options'</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#C678DD">  import</span><span style="color:#C678DD"> type</span><span style="color:#E06C75"> DemoStartSlot</span><span style="color:#C678DD"> from</span><span style="color:#98C379"> '../DemoStartSlot.svelte'</span><span style="color:#ABB2BF">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic">  // start slot and options are part of demos infrastructure</span></span>
<span class="line"><span style="color:#C678DD">  export</span><span style="color:#C678DD"> let</span><span style="color:#E06C75"> startSlot</span><span style="color:#ABB2BF">: </span><span style="color:#E5C07B">DemoStartSlot</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#C678DD">  export</span><span style="color:#C678DD"> let</span><span style="color:#E06C75"> options</span><span style="color:#ABB2BF">: </span><span style="color:#E5C07B">Writable</span><span style="color:#ABB2BF">&#x3C;</span><span style="color:#E5C07B">Options</span><span style="color:#ABB2BF">>;</span></span>
<span class="line"><span style="color:#E06C75">  $</span><span style="color:#ABB2BF">: </span><span style="color:#E06C75">log</span><span style="color:#56B6C2"> =</span><span style="color:#ABB2BF"> $</span><span style="color:#E5C07B">options</span><span style="color:#ABB2BF">.</span><span style="color:#E06C75">log</span><span style="color:#ABB2BF">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD">  let</span><span style="color:#E06C75"> target</span><span style="color:#ABB2BF">: </span><span style="color:#E5C07B">HTMLElement</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#C678DD">  let</span><span style="color:#E06C75"> leftParent</span><span style="color:#ABB2BF">: </span><span style="color:#E5C07B">HTMLElement</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#C678DD">  let</span><span style="color:#E06C75"> rightParent</span><span style="color:#ABB2BF">: </span><span style="color:#E5C07B">HTMLElement</span><span style="color:#ABB2BF">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD">  let</span><span style="color:#E06C75"> currentParent</span><span style="color:#ABB2BF">: </span><span style="color:#E5C07B">HTMLElement</span><span style="color:#ABB2BF"> | </span><span style="color:#E5C07B">undefined</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#C678DD">  let</span><span style="color:#E06C75"> currentAnim</span><span style="color:#ABB2BF">: </span><span style="color:#E5C07B">AnimationControls</span><span style="color:#ABB2BF"> | </span><span style="color:#E5C07B">undefined</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#C678DD">  let</span><span style="color:#E06C75"> currentTimeout</span><span style="color:#ABB2BF">: </span><span style="color:#E5C07B">NodeJS</span><span style="color:#ABB2BF">.</span><span style="color:#E5C07B">Timeout</span><span style="color:#ABB2BF"> | </span><span style="color:#E5C07B">undefined</span><span style="color:#ABB2BF">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#61AFEF">  onMount</span><span style="color:#ABB2BF">(</span><span style="color:#C678DD">async</span><span style="color:#ABB2BF"> () </span><span style="color:#C678DD">=></span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#C678DD">    await</span><span style="color:#61AFEF"> tick</span><span style="color:#ABB2BF">();</span></span>
<span class="line"><span style="color:#E5C07B">    startSlot</span><span style="color:#ABB2BF">.</span><span style="color:#61AFEF">show</span><span style="color:#ABB2BF">();</span></span>
<span class="line"><span style="color:#E06C75">    currentParent</span><span style="color:#56B6C2"> =</span><span style="color:#E06C75"> leftParent</span><span style="color:#ABB2BF">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75">    currentTimeout</span><span style="color:#56B6C2"> =</span><span style="color:#61AFEF"> setTimeout</span><span style="color:#ABB2BF">(() </span><span style="color:#C678DD">=></span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#61AFEF">      flipToNextParent</span><span style="color:#ABB2BF">();</span></span>
<span class="line"><span style="color:#ABB2BF">    }, </span><span style="color:#D19A66">1000</span><span style="color:#ABB2BF">);</span></span>
<span class="line"><span style="color:#ABB2BF">  });</span></span>
<span class="line"></span>
<span class="line"><span style="color:#61AFEF">  onDestroy</span><span style="color:#ABB2BF">(() </span><span style="color:#C678DD">=></span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#E5C07B">    currentAnim</span><span style="color:#ABB2BF">?.</span><span style="color:#61AFEF">pause</span><span style="color:#ABB2BF">();</span></span>
<span class="line"><span style="color:#E06C75">    currentAnim</span><span style="color:#56B6C2"> =</span><span style="color:#D19A66"> undefined</span><span style="color:#ABB2BF">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#61AFEF">    clearTimeout</span><span style="color:#ABB2BF">(</span><span style="color:#E06C75">currentTimeout</span><span style="color:#ABB2BF">);</span></span>
<span class="line"><span style="color:#E06C75">    currentTimeout</span><span style="color:#56B6C2"> =</span><span style="color:#D19A66"> undefined</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">  });</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD">  function</span><span style="color:#61AFEF"> flipToNextParent</span><span style="color:#ABB2BF">(): </span><span style="color:#E5C07B">void</span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#C678DD">    let</span><span style="color:#E06C75"> subjectEl</span><span style="color:#56B6C2"> =</span><span style="color:#E5C07B"> startSlot</span><span style="color:#ABB2BF">.</span><span style="color:#61AFEF">isShowing</span><span style="color:#ABB2BF">() </span><span style="color:#C678DD">?</span><span style="color:#E5C07B"> startSlot</span><span style="color:#ABB2BF">.</span><span style="color:#61AFEF">getSlotSubject</span><span style="color:#ABB2BF">() </span><span style="color:#C678DD">:</span><span style="color:#E06C75"> target</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#C678DD">    const</span><span style="color:#E5C07B"> subject</span><span style="color:#56B6C2"> =</span><span style="color:#61AFEF"> measureSubject</span><span style="color:#ABB2BF">(</span><span style="color:#E06C75">subjectEl</span><span style="color:#ABB2BF">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD">    const</span><span style="color:#E5C07B"> nextParent</span><span style="color:#56B6C2"> =</span><span style="color:#E06C75"> currentParent</span><span style="color:#56B6C2"> ===</span><span style="color:#E06C75"> rightParent</span><span style="color:#C678DD"> ?</span><span style="color:#E06C75"> leftParent</span><span style="color:#C678DD"> :</span><span style="color:#E06C75"> rightParent</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#E5C07B">    nextParent</span><span style="color:#ABB2BF">.</span><span style="color:#61AFEF">append</span><span style="color:#ABB2BF">(</span><span style="color:#E06C75">target</span><span style="color:#ABB2BF">);</span></span>
<span class="line"><span style="color:#E06C75">    currentParent</span><span style="color:#56B6C2"> =</span><span style="color:#E06C75"> nextParent</span><span style="color:#ABB2BF">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#61AFEF">    requestAnimationFrame</span><span style="color:#ABB2BF">(() </span><span style="color:#C678DD">=></span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#C678DD">      const</span><span style="color:#ABB2BF"> { </span><span style="color:#E5C07B">toSubject</span><span style="color:#ABB2BF">, </span><span style="color:#E5C07B">toTargetOrigin</span><span style="color:#ABB2BF"> } </span><span style="color:#56B6C2">=</span><span style="color:#61AFEF"> getProjection</span><span style="color:#ABB2BF">(</span><span style="color:#E06C75">subject</span><span style="color:#ABB2BF">, </span><span style="color:#E06C75">target</span><span style="color:#ABB2BF">, { </span><span style="color:#E06C75">log</span><span style="color:#ABB2BF"> });</span></span>
<span class="line"></span>
<span class="line"><span style="color:#61AFEF">      setInlineStyles</span><span style="color:#ABB2BF">(</span><span style="color:#E06C75">target</span><span style="color:#ABB2BF">, </span><span style="color:#E06C75">toSubject</span><span style="color:#ABB2BF">);</span></span>
<span class="line"><span style="color:#E5C07B">      target</span><span style="color:#ABB2BF">.</span><span style="color:#E5C07B">style</span><span style="color:#ABB2BF">.</span><span style="color:#E06C75">opacity</span><span style="color:#56B6C2"> =</span><span style="color:#98C379"> '1'</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#E5C07B">      startSlot</span><span style="color:#ABB2BF">.</span><span style="color:#61AFEF">hide</span><span style="color:#ABB2BF">();</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75">      currentAnim</span><span style="color:#56B6C2"> =</span><span style="color:#61AFEF"> animate</span><span style="color:#ABB2BF">(</span></span>
<span class="line"><span style="color:#E06C75">        target</span><span style="color:#ABB2BF">,</span></span>
<span class="line"><span style="color:#ABB2BF">        {</span></span>
<span class="line"><span style="color:#ABB2BF">          ...</span><span style="color:#E06C75">toTargetOrigin</span><span style="color:#ABB2BF">,</span></span>
<span class="line"><span style="color:#ABB2BF">        },</span></span>
<span class="line"><span style="color:#ABB2BF">        {</span></span>
<span class="line"><span style="color:#E06C75">          duration</span><span style="color:#ABB2BF">: </span><span style="color:#D19A66">1</span><span style="color:#ABB2BF">,</span></span>
<span class="line"><span style="color:#E06C75">          easing</span><span style="color:#ABB2BF">: </span><span style="color:#98C379">'ease-out'</span><span style="color:#ABB2BF">,</span></span>
<span class="line"><span style="color:#ABB2BF">        },</span></span>
<span class="line"><span style="color:#ABB2BF">      );</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E5C07B">      currentAnim</span><span style="color:#ABB2BF">.</span><span style="color:#E5C07B">finished</span><span style="color:#ABB2BF">.</span><span style="color:#61AFEF">then</span><span style="color:#ABB2BF">(() </span><span style="color:#C678DD">=></span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#61AFEF">        clearInlineStyles</span><span style="color:#ABB2BF">(</span><span style="color:#E06C75">target</span><span style="color:#ABB2BF">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#61AFEF">        playParentAnimation</span><span style="color:#ABB2BF">(</span><span style="color:#E06C75">nextParent</span><span style="color:#ABB2BF">).</span><span style="color:#E5C07B">finished</span><span style="color:#ABB2BF">.</span><span style="color:#61AFEF">then</span><span style="color:#ABB2BF">(() </span><span style="color:#C678DD">=></span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#E06C75">          currentTimeout</span><span style="color:#56B6C2"> =</span><span style="color:#61AFEF"> setTimeout</span><span style="color:#ABB2BF">(() </span><span style="color:#C678DD">=></span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#61AFEF">            flipToNextParent</span><span style="color:#ABB2BF">();</span></span>
<span class="line"><span style="color:#ABB2BF">          }, </span><span style="color:#D19A66">1000</span><span style="color:#ABB2BF">);</span></span>
<span class="line"><span style="color:#ABB2BF">        });</span></span>
<span class="line"><span style="color:#ABB2BF">      });</span></span>
<span class="line"><span style="color:#ABB2BF">    });</span></span>
<span class="line"><span style="color:#ABB2BF">  }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD">  function</span><span style="color:#61AFEF"> playParentAnimation</span><span style="color:#ABB2BF">(</span><span style="color:#E06C75;font-style:italic">parent</span><span style="color:#ABB2BF">: </span><span style="color:#E5C07B">HTMLElement</span><span style="color:#ABB2BF">): </span><span style="color:#E5C07B">AnimationControls</span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#C678DD">    const</span><span style="color:#E5C07B"> dir</span><span style="color:#56B6C2"> =</span><span style="color:#E06C75"> parent</span><span style="color:#56B6C2"> ===</span><span style="color:#E06C75"> rightParent</span><span style="color:#C678DD"> ?</span><span style="color:#56B6C2"> -</span><span style="color:#D19A66">1</span><span style="color:#C678DD"> :</span><span style="color:#D19A66"> 1</span><span style="color:#ABB2BF">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75">    currentAnim</span><span style="color:#56B6C2"> =</span><span style="color:#61AFEF"> animate</span><span style="color:#ABB2BF">(</span></span>
<span class="line"><span style="color:#E06C75">      parent</span><span style="color:#ABB2BF">,</span></span>
<span class="line"><span style="color:#ABB2BF">      {</span></span>
<span class="line"><span style="color:#E06C75">        transform</span><span style="color:#ABB2BF">: [</span></span>
<span class="line"><span style="color:#98C379">          'skew('</span><span style="color:#56B6C2"> +</span><span style="color:#D19A66"> 15</span><span style="color:#56B6C2"> *</span><span style="color:#E06C75"> dir</span><span style="color:#56B6C2"> +</span><span style="color:#98C379"> 'deg)'</span><span style="color:#ABB2BF">,</span></span>
<span class="line"><span style="color:#98C379">          'skew('</span><span style="color:#56B6C2"> +</span><span style="color:#D19A66"> 15</span><span style="color:#56B6C2"> *</span><span style="color:#E06C75"> dir</span><span style="color:#56B6C2"> +</span><span style="color:#98C379"> 'deg) rotate('</span><span style="color:#56B6C2"> +</span><span style="color:#56B6C2"> -</span><span style="color:#D19A66">20</span><span style="color:#56B6C2"> *</span><span style="color:#E06C75"> dir</span><span style="color:#56B6C2"> +</span><span style="color:#98C379"> 'deg)'</span><span style="color:#ABB2BF">,</span></span>
<span class="line"><span style="color:#98C379">          'skew('</span><span style="color:#56B6C2"> +</span><span style="color:#D19A66"> 15</span><span style="color:#56B6C2"> *</span><span style="color:#E06C75"> dir</span><span style="color:#56B6C2"> +</span><span style="color:#98C379"> 'deg) rotate('</span><span style="color:#56B6C2"> +</span><span style="color:#D19A66"> 20</span><span style="color:#56B6C2"> *</span><span style="color:#E06C75"> dir</span><span style="color:#56B6C2"> +</span><span style="color:#98C379"> 'deg)'</span><span style="color:#ABB2BF">,</span></span>
<span class="line"><span style="color:#98C379">          'skew('</span><span style="color:#56B6C2"> +</span><span style="color:#D19A66"> 15</span><span style="color:#56B6C2"> *</span><span style="color:#E06C75"> dir</span><span style="color:#56B6C2"> +</span><span style="color:#98C379"> 'deg)'</span><span style="color:#ABB2BF">,</span></span>
<span class="line"><span style="color:#ABB2BF">        ],</span></span>
<span class="line"><span style="color:#ABB2BF">      },</span></span>
<span class="line"><span style="color:#ABB2BF">      {</span></span>
<span class="line"><span style="color:#E06C75">        duration</span><span style="color:#ABB2BF">: </span><span style="color:#D19A66">1</span><span style="color:#ABB2BF">,</span></span>
<span class="line"><span style="color:#E06C75">        easing</span><span style="color:#ABB2BF">: </span><span style="color:#98C379">'ease-in-out'</span><span style="color:#ABB2BF">,</span></span>
<span class="line"><span style="color:#ABB2BF">      },</span></span>
<span class="line"><span style="color:#ABB2BF">    );</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD">    return</span><span style="color:#E06C75"> currentAnim</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">  }</span></span>
<span class="line"><span style="color:#ABB2BF">&#x3C;/</span><span style="color:#E06C75">script</span><span style="color:#ABB2BF">></span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF">&#x3C;</span><span style="color:#E06C75">div</span><span style="color:#D19A66"> class</span><span style="color:#ABB2BF">=</span><span style="color:#98C379">"size-container"</span><span style="color:#ABB2BF">></span></span>
<span class="line"><span style="color:#ABB2BF">  &#x3C;</span><span style="color:#E06C75">div</span><span style="color:#D19A66"> class</span><span style="color:#ABB2BF">=</span><span style="color:#98C379">"parents-container"</span><span style="color:#ABB2BF">></span></span>
<span class="line"><span style="color:#ABB2BF">    &#x3C;</span><span style="color:#E06C75">div</span><span style="color:#C678DD"> bind</span><span style="color:#ABB2BF">:</span><span style="color:#E5C07B">this</span><span style="color:#ABB2BF">=</span><span style="color:#C678DD">{</span><span style="color:#E06C75">leftParent</span><span style="color:#C678DD">}</span><span style="color:#D19A66"> class</span><span style="color:#ABB2BF">=</span><span style="color:#98C379">"parent left"</span><span style="color:#ABB2BF">></span></span>
<span class="line"><span style="color:#ABB2BF">      &#x3C;</span><span style="color:#E06C75">div</span><span style="color:#C678DD"> bind</span><span style="color:#ABB2BF">:</span><span style="color:#E5C07B">this</span><span style="color:#ABB2BF">=</span><span style="color:#C678DD">{</span><span style="color:#E06C75">target</span><span style="color:#C678DD">}</span><span style="color:#D19A66"> class</span><span style="color:#ABB2BF">=</span><span style="color:#98C379">"demo-target child"</span><span style="color:#ABB2BF"> /></span></span>
<span class="line"><span style="color:#ABB2BF">    &#x3C;/</span><span style="color:#E06C75">div</span><span style="color:#ABB2BF">></span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF">    &#x3C;</span><span style="color:#E06C75">div</span><span style="color:#C678DD"> bind</span><span style="color:#ABB2BF">:</span><span style="color:#E5C07B">this</span><span style="color:#ABB2BF">=</span><span style="color:#C678DD">{</span><span style="color:#E06C75">rightParent</span><span style="color:#C678DD">}</span><span style="color:#D19A66"> class</span><span style="color:#ABB2BF">=</span><span style="color:#98C379">"parent right"</span><span style="color:#ABB2BF">>&#x3C;/</span><span style="color:#E06C75">div</span><span style="color:#ABB2BF">></span></span>
<span class="line"><span style="color:#ABB2BF">  &#x3C;/</span><span style="color:#E06C75">div</span><span style="color:#ABB2BF">></span></span>
<span class="line"><span style="color:#ABB2BF">&#x3C;/</span><span style="color:#E06C75">div</span><span style="color:#ABB2BF">></span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF">&#x3C;</span><span style="color:#E06C75">style</span><span style="color:#D19A66"> lang</span><span style="color:#ABB2BF">=</span><span style="color:#98C379">"scss"</span><span style="color:#ABB2BF">></span></span>
<span class="line"><span style="color:#D19A66">  .size-container</span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#ABB2BF">    position: </span><span style="color:#D19A66">relative</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">    width: </span><span style="color:#D19A66">100</span><span style="color:#E06C75">%</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">    aspect-ratio: </span><span style="color:#D19A66">4</span><span style="color:#56B6C2"> /</span><span style="color:#D19A66"> 1</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">    margin-top: </span><span style="color:#D19A66">1.5</span><span style="color:#E06C75">em</span><span style="color:#ABB2BF">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF">    container-type: size;</span></span>
<span class="line"><span style="color:#ABB2BF">  }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D19A66">  .parents-container</span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#ABB2BF">    width: </span><span style="color:#D19A66">100</span><span style="color:#E06C75">%</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">    height: </span><span style="color:#D19A66">100</span><span style="color:#E06C75">%</span><span style="color:#ABB2BF">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF">    display: </span><span style="color:#D19A66">flex</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">    justify-content: </span><span style="color:#D19A66">center</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">    align-items: </span><span style="color:#D19A66">center</span><span style="color:#ABB2BF">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF">    gap: </span><span style="color:#D19A66">25</span><span style="color:#E06C75">cqw</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">  }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D19A66">  .parent</span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#ABB2BF">    width: </span><span style="color:#D19A66">21</span><span style="color:#E06C75">cqw</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">    height: </span><span style="color:#D19A66">21</span><span style="color:#E06C75">cqw</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">    border: </span><span style="color:#D19A66">dashed</span><span style="color:#D19A66"> 3</span><span style="color:#E06C75">px</span><span style="color:#ABB2BF"> darkmagenta;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF">    will-change: transform;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D19A66">    .demo-target</span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#ABB2BF">      position: </span><span style="color:#D19A66">absolute</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">      top: </span><span style="color:#D19A66">0</span><span style="color:#E06C75">px</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">      left: </span><span style="color:#D19A66">0</span><span style="color:#E06C75">px</span><span style="color:#ABB2BF">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF">      width: </span><span style="color:#D19A66">10.75</span><span style="color:#E06C75">cqw</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">      height: </span><span style="color:#D19A66">10.75</span><span style="color:#E06C75">cqw</span><span style="color:#ABB2BF">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic">      // last i checked, safari webkit can't handle non-integer borders</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic">      // on transformed elements, so i always recommend pixels for borders</span></span>
<span class="line"><span style="color:#ABB2BF">      border: </span><span style="color:#D19A66">solid</span><span style="color:#D19A66"> 3</span><span style="color:#E06C75">px</span><span style="color:#ABB2BF"> limegreen;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF">      opacity: </span><span style="color:#D19A66">0</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">    }</span></span>
<span class="line"><span style="color:#ABB2BF">  }</span></span>
<span class="line"><span style="color:#D19A66">  .left</span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#ABB2BF">    transform: </span><span style="color:#56B6C2">skew</span><span style="color:#ABB2BF">(</span><span style="color:#D19A66">15</span><span style="color:#E06C75">deg</span><span style="color:#ABB2BF">);</span></span>
<span class="line"><span style="color:#ABB2BF">  }</span></span>
<span class="line"><span style="color:#D19A66">  .right</span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#ABB2BF">    transform: </span><span style="color:#56B6C2">skew</span><span style="color:#ABB2BF">(</span><span style="color:#D19A66">-15</span><span style="color:#E06C75">deg</span><span style="color:#ABB2BF">);</span></span>
<span class="line"><span style="color:#ABB2BF">  }</span></span>
<span class="line"><span style="color:#ABB2BF">&#x3C;/</span><span style="color:#E06C75">style</span><span style="color:#ABB2BF">></span></span></code></pre>`;
