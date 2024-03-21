export const MatchUsage = `import { getProjection } from 'projectrix';

const { toSubject } = getProjection(subjectElement, targetElement);

targetElement.style.width = toSubject.width;
targetElement.style.height = toSubject.height;
targetElement.style.borderStyle = toSubject.borderStyle;
targetElement.style.borderWidth = toSubject.borderWidth;
targetElement.style.borderRadius = toSubject.borderRadius;
targetElement.style.transformOrigin = toSubject.transformOrigin;
targetElement.style.transform = toSubject.transform;`;

export const MatchCode = `<script lang="ts">
  import type { Options } from '$lib/options';
  import { animate, type AnimationControls } from 'motion';
  import { getProjection } from 'projectrix';
  import { onMount, tick } from 'svelte';
  import type { Writable } from 'svelte/store';
  import type DemoStartSlot from '../DemoStartSlot.svelte';

  // starting slot is part of demos infrastructure
  export let startSlot: DemoStartSlot;
  export let options: Writable<Options>;

  let target: HTMLElement;
  let inSlot = false;

  let currentAnim: AnimationControls | undefined;

  onMount(async () => {
    await tick();
    startSlot.show();
    inSlot = true;
  });

  function swapSlotForTarget(target: HTMLElement): void {
    const { toSubject } = getProjection(startSlot.getSlotSubject(), target);

    target.style.transform = toSubject.transform;
    target.style.width = toSubject.width;
    target.style.height = toSubject.height;
    target.style.opacity = '1';

    startSlot.hide();
    inSlot = false;
  }

  function animateDirect(subject: HTMLElement, target: HTMLElement): void {
    if (inSlot) {
      swapSlotForTarget(target);
    }

    // stop current animation; motion one will update target's inline styles to mid-animation values
    if (currentAnim?.currentTime && currentAnim.currentTime < 1) {
      currentAnim.stop();
    }

    const projectionResults = getProjection(subject, target);
    const { toSubject } = projectionResults;

    if ($options.log) {
      console.log(projectionResults);
    }

    currentAnim = animate(
      target,
      { ...toSubject, borderStyle: 'solid' },
      {
        duration: 0.4,
        easing: 'ease-out',
      },
    );
  }

  function subjectClickHandler(subject: HTMLElement): void {
    animateDirect(subject, target);
  }
</script>

<button class="demo-subject" on:click={(e) => subjectClickHandler(e.currentTarget)} />
<button class="demo-subject rotated" on:click={(e) => subjectClickHandler(e.currentTarget)} />
<button class="parent" on:click={(e) => subjectClickHandler(e.currentTarget)}>
  <button
    class="demo-subject child"
    on:click|stopPropagation={(e) => subjectClickHandler(e.currentTarget)}
  />
</button>

<div bind:this={target} class="demo-target" />

<style lang="scss">
  button {
    all: unset;
    -webkit-tap-highlight-color: transparent;
  }

  .demo-subject:focus-visible,
  .parent:focus-visible {
    outline: solid 2px white;
    outline-offset: 4px;
  }

  .demo-target {
    position: absolute; // any positioning works with Projectrix
    top: 0;
    right: 0;

    width: 35px;
    height: 35px;
    border: solid 3px limegreen;

    pointer-events: none;

    opacity: 0;
  }

  .demo-subject {
    position: absolute;
    top: 150px;
    left: 100px;

    width: 100px;
    height: 100px;
    border: dashed 3px yellow;

    cursor: pointer;
  }

  .rotated {
    left: 270px;
    transform: rotate(45deg);
  }

  .parent {
    position: absolute;
    top: 125px;
    left: 440px;

    width: 150px;
    height: 150px;
    border: dashed 3px darkmagenta;

    cursor: pointer;

    transform: skew(-15deg);

    .child {
      width: 75px;
      height: 75px;
      top: 0px;
      left: 0px;
    }
  }
</style>
`;

export const MatchUsageHL = `<pre class="shiki one-dark-pro" style="background-color:#282c34;color:#abb2bf" tabindex="0"><code><span class="line"><span style="color:#C678DD">import</span><span style="color:#ABB2BF"> { </span><span style="color:#E06C75">getProjection</span><span style="color:#ABB2BF"> } </span><span style="color:#C678DD">from</span><span style="color:#98C379"> 'projectrix'</span><span style="color:#ABB2BF">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD">const</span><span style="color:#ABB2BF"> { </span><span style="color:#E5C07B">toSubject</span><span style="color:#ABB2BF"> } </span><span style="color:#56B6C2">=</span><span style="color:#61AFEF"> getProjection</span><span style="color:#ABB2BF">(</span><span style="color:#E06C75">subjectElement</span><span style="color:#ABB2BF">, </span><span style="color:#E06C75">targetElement</span><span style="color:#ABB2BF">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E5C07B">targetElement</span><span style="color:#ABB2BF">.</span><span style="color:#E5C07B">style</span><span style="color:#ABB2BF">.</span><span style="color:#E06C75">width</span><span style="color:#56B6C2"> =</span><span style="color:#E5C07B"> toSubject</span><span style="color:#ABB2BF">.</span><span style="color:#E06C75">width</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#E5C07B">targetElement</span><span style="color:#ABB2BF">.</span><span style="color:#E5C07B">style</span><span style="color:#ABB2BF">.</span><span style="color:#E06C75">height</span><span style="color:#56B6C2"> =</span><span style="color:#E5C07B"> toSubject</span><span style="color:#ABB2BF">.</span><span style="color:#E06C75">height</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#E5C07B">targetElement</span><span style="color:#ABB2BF">.</span><span style="color:#E5C07B">style</span><span style="color:#ABB2BF">.</span><span style="color:#E06C75">borderStyle</span><span style="color:#56B6C2"> =</span><span style="color:#E5C07B"> toSubject</span><span style="color:#ABB2BF">.</span><span style="color:#E06C75">borderStyle</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#E5C07B">targetElement</span><span style="color:#ABB2BF">.</span><span style="color:#E5C07B">style</span><span style="color:#ABB2BF">.</span><span style="color:#E06C75">borderWidth</span><span style="color:#56B6C2"> =</span><span style="color:#E5C07B"> toSubject</span><span style="color:#ABB2BF">.</span><span style="color:#E06C75">borderWidth</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#E5C07B">targetElement</span><span style="color:#ABB2BF">.</span><span style="color:#E5C07B">style</span><span style="color:#ABB2BF">.</span><span style="color:#E06C75">borderRadius</span><span style="color:#56B6C2"> =</span><span style="color:#E5C07B"> toSubject</span><span style="color:#ABB2BF">.</span><span style="color:#E06C75">borderRadius</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#E5C07B">targetElement</span><span style="color:#ABB2BF">.</span><span style="color:#E5C07B">style</span><span style="color:#ABB2BF">.</span><span style="color:#E06C75">transformOrigin</span><span style="color:#56B6C2"> =</span><span style="color:#E5C07B"> toSubject</span><span style="color:#ABB2BF">.</span><span style="color:#E06C75">transformOrigin</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#E5C07B">targetElement</span><span style="color:#ABB2BF">.</span><span style="color:#E5C07B">style</span><span style="color:#ABB2BF">.</span><span style="color:#E06C75">transform</span><span style="color:#56B6C2"> =</span><span style="color:#E5C07B"> toSubject</span><span style="color:#ABB2BF">.</span><span style="color:#E06C75">transform</span><span style="color:#ABB2BF">;</span></span></code></pre>`;

export const MatchCodeHL = `<pre class="shiki one-dark-pro" style="background-color:#282c34;color:#abb2bf" tabindex="0"><code><span class="line"><span style="color:#ABB2BF">&#x3C;</span><span style="color:#E06C75">script</span><span style="color:#D19A66"> lang</span><span style="color:#ABB2BF">=</span><span style="color:#98C379">"ts"</span><span style="color:#ABB2BF">></span></span>
<span class="line"><span style="color:#C678DD">  import</span><span style="color:#C678DD"> type</span><span style="color:#ABB2BF"> { </span><span style="color:#E06C75">Options</span><span style="color:#ABB2BF"> } </span><span style="color:#C678DD">from</span><span style="color:#98C379"> '$lib/options'</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#C678DD">  import</span><span style="color:#ABB2BF"> { </span><span style="color:#E06C75">animate</span><span style="color:#ABB2BF">, </span><span style="color:#C678DD">type</span><span style="color:#E06C75"> AnimationControls</span><span style="color:#ABB2BF"> } </span><span style="color:#C678DD">from</span><span style="color:#98C379"> 'motion'</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#C678DD">  import</span><span style="color:#ABB2BF"> { </span><span style="color:#E06C75">getProjection</span><span style="color:#ABB2BF"> } </span><span style="color:#C678DD">from</span><span style="color:#98C379"> 'projectrix'</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#C678DD">  import</span><span style="color:#ABB2BF"> { </span><span style="color:#E06C75">onMount</span><span style="color:#ABB2BF">, </span><span style="color:#E06C75">tick</span><span style="color:#ABB2BF"> } </span><span style="color:#C678DD">from</span><span style="color:#98C379"> 'svelte'</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#C678DD">  import</span><span style="color:#C678DD"> type</span><span style="color:#ABB2BF"> { </span><span style="color:#E06C75">Writable</span><span style="color:#ABB2BF"> } </span><span style="color:#C678DD">from</span><span style="color:#98C379"> 'svelte/store'</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#C678DD">  import</span><span style="color:#C678DD"> type</span><span style="color:#E06C75"> DemoStartSlot</span><span style="color:#C678DD"> from</span><span style="color:#98C379"> '../DemoStartSlot.svelte'</span><span style="color:#ABB2BF">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic">  // starting slot is part of demos infrastructure</span></span>
<span class="line"><span style="color:#C678DD">  export</span><span style="color:#C678DD"> let</span><span style="color:#E06C75"> startSlot</span><span style="color:#ABB2BF">: </span><span style="color:#E5C07B">DemoStartSlot</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#C678DD">  export</span><span style="color:#C678DD"> let</span><span style="color:#E06C75"> options</span><span style="color:#ABB2BF">: </span><span style="color:#E5C07B">Writable</span><span style="color:#ABB2BF">&#x3C;</span><span style="color:#E5C07B">Options</span><span style="color:#ABB2BF">>;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD">  let</span><span style="color:#E06C75"> target</span><span style="color:#ABB2BF">: </span><span style="color:#E5C07B">HTMLElement</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#C678DD">  let</span><span style="color:#E06C75"> inSlot</span><span style="color:#56B6C2"> =</span><span style="color:#D19A66"> false</span><span style="color:#ABB2BF">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD">  let</span><span style="color:#E06C75"> currentAnim</span><span style="color:#ABB2BF">: </span><span style="color:#E5C07B">AnimationControls</span><span style="color:#ABB2BF"> | </span><span style="color:#E5C07B">undefined</span><span style="color:#ABB2BF">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#61AFEF">  onMount</span><span style="color:#ABB2BF">(</span><span style="color:#C678DD">async</span><span style="color:#ABB2BF"> () </span><span style="color:#C678DD">=></span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#C678DD">    await</span><span style="color:#61AFEF"> tick</span><span style="color:#ABB2BF">();</span></span>
<span class="line"><span style="color:#E5C07B">    startSlot</span><span style="color:#ABB2BF">.</span><span style="color:#61AFEF">show</span><span style="color:#ABB2BF">();</span></span>
<span class="line"><span style="color:#E06C75">    inSlot</span><span style="color:#56B6C2"> =</span><span style="color:#D19A66"> true</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">  });</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD">  function</span><span style="color:#61AFEF"> swapSlotForTarget</span><span style="color:#ABB2BF">(</span><span style="color:#E06C75;font-style:italic">target</span><span style="color:#ABB2BF">: </span><span style="color:#E5C07B">HTMLElement</span><span style="color:#ABB2BF">): </span><span style="color:#E5C07B">void</span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#C678DD">    const</span><span style="color:#ABB2BF"> { </span><span style="color:#E5C07B">toSubject</span><span style="color:#ABB2BF"> } </span><span style="color:#56B6C2">=</span><span style="color:#61AFEF"> getProjection</span><span style="color:#ABB2BF">(</span><span style="color:#E5C07B">startSlot</span><span style="color:#ABB2BF">.</span><span style="color:#61AFEF">getSlotSubject</span><span style="color:#ABB2BF">(), </span><span style="color:#E06C75">target</span><span style="color:#ABB2BF">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E5C07B">    target</span><span style="color:#ABB2BF">.</span><span style="color:#E5C07B">style</span><span style="color:#ABB2BF">.</span><span style="color:#E06C75">transform</span><span style="color:#56B6C2"> =</span><span style="color:#E5C07B"> toSubject</span><span style="color:#ABB2BF">.</span><span style="color:#E06C75">transform</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#E5C07B">    target</span><span style="color:#ABB2BF">.</span><span style="color:#E5C07B">style</span><span style="color:#ABB2BF">.</span><span style="color:#E06C75">width</span><span style="color:#56B6C2"> =</span><span style="color:#E5C07B"> toSubject</span><span style="color:#ABB2BF">.</span><span style="color:#E06C75">width</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#E5C07B">    target</span><span style="color:#ABB2BF">.</span><span style="color:#E5C07B">style</span><span style="color:#ABB2BF">.</span><span style="color:#E06C75">height</span><span style="color:#56B6C2"> =</span><span style="color:#E5C07B"> toSubject</span><span style="color:#ABB2BF">.</span><span style="color:#E06C75">height</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#E5C07B">    target</span><span style="color:#ABB2BF">.</span><span style="color:#E5C07B">style</span><span style="color:#ABB2BF">.</span><span style="color:#E06C75">opacity</span><span style="color:#56B6C2"> =</span><span style="color:#98C379"> '1'</span><span style="color:#ABB2BF">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E5C07B">    startSlot</span><span style="color:#ABB2BF">.</span><span style="color:#61AFEF">hide</span><span style="color:#ABB2BF">();</span></span>
<span class="line"><span style="color:#E06C75">    inSlot</span><span style="color:#56B6C2"> =</span><span style="color:#D19A66"> false</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">  }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD">  function</span><span style="color:#61AFEF"> animateDirect</span><span style="color:#ABB2BF">(</span><span style="color:#E06C75;font-style:italic">subject</span><span style="color:#ABB2BF">: </span><span style="color:#E5C07B">HTMLElement</span><span style="color:#ABB2BF">, </span><span style="color:#E06C75;font-style:italic">target</span><span style="color:#ABB2BF">: </span><span style="color:#E5C07B">HTMLElement</span><span style="color:#ABB2BF">): </span><span style="color:#E5C07B">void</span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#C678DD">    if</span><span style="color:#ABB2BF"> (</span><span style="color:#E06C75">inSlot</span><span style="color:#ABB2BF">) {</span></span>
<span class="line"><span style="color:#61AFEF">      swapSlotForTarget</span><span style="color:#ABB2BF">(</span><span style="color:#E06C75">target</span><span style="color:#ABB2BF">);</span></span>
<span class="line"><span style="color:#ABB2BF">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic">    // stop current animation; motion one will update target's inline styles to mid-animation values</span></span>
<span class="line"><span style="color:#C678DD">    if</span><span style="color:#ABB2BF"> (</span><span style="color:#E5C07B">currentAnim</span><span style="color:#ABB2BF">?.</span><span style="color:#E06C75">currentTime</span><span style="color:#56B6C2"> &#x26;&#x26;</span><span style="color:#E5C07B"> currentAnim</span><span style="color:#ABB2BF">.</span><span style="color:#E06C75">currentTime</span><span style="color:#56B6C2"> &#x3C;</span><span style="color:#D19A66"> 1</span><span style="color:#ABB2BF">) {</span></span>
<span class="line"><span style="color:#E5C07B">      currentAnim</span><span style="color:#ABB2BF">.</span><span style="color:#61AFEF">stop</span><span style="color:#ABB2BF">();</span></span>
<span class="line"><span style="color:#ABB2BF">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD">    const</span><span style="color:#E5C07B"> projectionResults</span><span style="color:#56B6C2"> =</span><span style="color:#61AFEF"> getProjection</span><span style="color:#ABB2BF">(</span><span style="color:#E06C75">subject</span><span style="color:#ABB2BF">, </span><span style="color:#E06C75">target</span><span style="color:#ABB2BF">);</span></span>
<span class="line"><span style="color:#C678DD">    const</span><span style="color:#ABB2BF"> { </span><span style="color:#E5C07B">toSubject</span><span style="color:#ABB2BF"> } </span><span style="color:#56B6C2">=</span><span style="color:#E06C75"> projectionResults</span><span style="color:#ABB2BF">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD">    if</span><span style="color:#ABB2BF"> ($</span><span style="color:#E5C07B">options</span><span style="color:#ABB2BF">.</span><span style="color:#E06C75">log</span><span style="color:#ABB2BF">) {</span></span>
<span class="line"><span style="color:#E5C07B">      console</span><span style="color:#ABB2BF">.</span><span style="color:#61AFEF">log</span><span style="color:#ABB2BF">(</span><span style="color:#E06C75">projectionResults</span><span style="color:#ABB2BF">);</span></span>
<span class="line"><span style="color:#ABB2BF">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75">    currentAnim</span><span style="color:#56B6C2"> =</span><span style="color:#61AFEF"> animate</span><span style="color:#ABB2BF">(</span></span>
<span class="line"><span style="color:#E06C75">      target</span><span style="color:#ABB2BF">,</span></span>
<span class="line"><span style="color:#ABB2BF">      { ...</span><span style="color:#E06C75">toSubject</span><span style="color:#ABB2BF">, </span><span style="color:#E06C75">borderStyle</span><span style="color:#ABB2BF">: </span><span style="color:#98C379">'solid'</span><span style="color:#ABB2BF"> },</span></span>
<span class="line"><span style="color:#ABB2BF">      {</span></span>
<span class="line"><span style="color:#E06C75">        duration</span><span style="color:#ABB2BF">: </span><span style="color:#D19A66">0.4</span><span style="color:#ABB2BF">,</span></span>
<span class="line"><span style="color:#E06C75">        easing</span><span style="color:#ABB2BF">: </span><span style="color:#98C379">'ease-out'</span><span style="color:#ABB2BF">,</span></span>
<span class="line"><span style="color:#ABB2BF">      },</span></span>
<span class="line"><span style="color:#ABB2BF">    );</span></span>
<span class="line"><span style="color:#ABB2BF">  }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD">  function</span><span style="color:#61AFEF"> subjectClickHandler</span><span style="color:#ABB2BF">(</span><span style="color:#E06C75;font-style:italic">subject</span><span style="color:#ABB2BF">: </span><span style="color:#E5C07B">HTMLElement</span><span style="color:#ABB2BF">): </span><span style="color:#E5C07B">void</span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#61AFEF">    animateDirect</span><span style="color:#ABB2BF">(</span><span style="color:#E06C75">subject</span><span style="color:#ABB2BF">, </span><span style="color:#E06C75">target</span><span style="color:#ABB2BF">);</span></span>
<span class="line"><span style="color:#ABB2BF">  }</span></span>
<span class="line"><span style="color:#ABB2BF">&#x3C;/</span><span style="color:#E06C75">script</span><span style="color:#ABB2BF">></span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF">&#x3C;</span><span style="color:#E06C75">button</span><span style="color:#D19A66"> class</span><span style="color:#ABB2BF">=</span><span style="color:#98C379">"demo-subject"</span><span style="color:#C678DD"> on</span><span style="color:#ABB2BF">:</span><span style="color:#E5C07B">click</span><span style="color:#ABB2BF">=</span><span style="color:#C678DD">{</span><span style="color:#ABB2BF">(</span><span style="color:#E06C75;font-style:italic">e</span><span style="color:#ABB2BF">) </span><span style="color:#C678DD">=></span><span style="color:#61AFEF"> subjectClickHandler</span><span style="color:#ABB2BF">(</span><span style="color:#E5C07B">e</span><span style="color:#ABB2BF">.</span><span style="color:#E06C75">currentTarget</span><span style="color:#ABB2BF">)</span><span style="color:#C678DD">}</span><span style="color:#ABB2BF"> /></span></span>
<span class="line"><span style="color:#ABB2BF">&#x3C;</span><span style="color:#E06C75">button</span><span style="color:#D19A66"> class</span><span style="color:#ABB2BF">=</span><span style="color:#98C379">"demo-subject rotated"</span><span style="color:#C678DD"> on</span><span style="color:#ABB2BF">:</span><span style="color:#E5C07B">click</span><span style="color:#ABB2BF">=</span><span style="color:#C678DD">{</span><span style="color:#ABB2BF">(</span><span style="color:#E06C75;font-style:italic">e</span><span style="color:#ABB2BF">) </span><span style="color:#C678DD">=></span><span style="color:#61AFEF"> subjectClickHandler</span><span style="color:#ABB2BF">(</span><span style="color:#E5C07B">e</span><span style="color:#ABB2BF">.</span><span style="color:#E06C75">currentTarget</span><span style="color:#ABB2BF">)</span><span style="color:#C678DD">}</span><span style="color:#ABB2BF"> /></span></span>
<span class="line"><span style="color:#ABB2BF">&#x3C;</span><span style="color:#E06C75">button</span><span style="color:#D19A66"> class</span><span style="color:#ABB2BF">=</span><span style="color:#98C379">"parent"</span><span style="color:#C678DD"> on</span><span style="color:#ABB2BF">:</span><span style="color:#E5C07B">click</span><span style="color:#ABB2BF">=</span><span style="color:#C678DD">{</span><span style="color:#ABB2BF">(</span><span style="color:#E06C75;font-style:italic">e</span><span style="color:#ABB2BF">) </span><span style="color:#C678DD">=></span><span style="color:#61AFEF"> subjectClickHandler</span><span style="color:#ABB2BF">(</span><span style="color:#E5C07B">e</span><span style="color:#ABB2BF">.</span><span style="color:#E06C75">currentTarget</span><span style="color:#ABB2BF">)</span><span style="color:#C678DD">}</span><span style="color:#ABB2BF">></span></span>
<span class="line"><span style="color:#ABB2BF">  &#x3C;</span><span style="color:#E06C75">button</span></span>
<span class="line"><span style="color:#D19A66">    class</span><span style="color:#ABB2BF">=</span><span style="color:#98C379">"demo-subject child"</span></span>
<span class="line"><span style="color:#C678DD">    on</span><span style="color:#ABB2BF">:</span><span style="color:#E5C07B">click</span><span style="color:#ABB2BF">|</span><span style="color:#56B6C2">stopPropagation</span><span style="color:#ABB2BF">=</span><span style="color:#C678DD">{</span><span style="color:#ABB2BF">(</span><span style="color:#E06C75;font-style:italic">e</span><span style="color:#ABB2BF">) </span><span style="color:#C678DD">=></span><span style="color:#61AFEF"> subjectClickHandler</span><span style="color:#ABB2BF">(</span><span style="color:#E5C07B">e</span><span style="color:#ABB2BF">.</span><span style="color:#E06C75">currentTarget</span><span style="color:#ABB2BF">)</span><span style="color:#C678DD">}</span></span>
<span class="line"><span style="color:#ABB2BF">  /></span></span>
<span class="line"><span style="color:#ABB2BF">&#x3C;/</span><span style="color:#E06C75">button</span><span style="color:#ABB2BF">></span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF">&#x3C;</span><span style="color:#E06C75">div</span><span style="color:#C678DD"> bind</span><span style="color:#ABB2BF">:</span><span style="color:#E5C07B">this</span><span style="color:#ABB2BF">=</span><span style="color:#C678DD">{</span><span style="color:#E06C75">target</span><span style="color:#C678DD">}</span><span style="color:#D19A66"> class</span><span style="color:#ABB2BF">=</span><span style="color:#98C379">"demo-target"</span><span style="color:#ABB2BF"> /></span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF">&#x3C;</span><span style="color:#E06C75">style</span><span style="color:#D19A66"> lang</span><span style="color:#ABB2BF">=</span><span style="color:#98C379">"scss"</span><span style="color:#ABB2BF">></span></span>
<span class="line"><span style="color:#E06C75">  button</span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#ABB2BF">    all: </span><span style="color:#D19A66">unset</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#56B6C2">    -webkit-tap-highlight-color</span><span style="color:#ABB2BF">: </span><span style="color:#D19A66">transparent</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">  }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D19A66">  .demo-subject</span><span style="color:#56B6C2">:focus-visible</span><span style="color:#ABB2BF">,</span></span>
<span class="line"><span style="color:#D19A66">  .parent</span><span style="color:#56B6C2">:focus-visible</span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#ABB2BF">    outline: </span><span style="color:#D19A66">solid</span><span style="color:#D19A66"> 2</span><span style="color:#E06C75">px</span><span style="color:#D19A66"> white</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">    outline-offset: </span><span style="color:#D19A66">4</span><span style="color:#E06C75">px</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">  }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D19A66">  .demo-target</span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#ABB2BF">    position: </span><span style="color:#D19A66">absolute</span><span style="color:#ABB2BF">; </span><span style="color:#7F848E;font-style:italic">// any positioning works with Projectrix</span></span>
<span class="line"><span style="color:#ABB2BF">    top: </span><span style="color:#D19A66">0</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">    right: </span><span style="color:#D19A66">0</span><span style="color:#ABB2BF">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF">    width: </span><span style="color:#D19A66">35</span><span style="color:#E06C75">px</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">    height: </span><span style="color:#D19A66">35</span><span style="color:#E06C75">px</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">    border: </span><span style="color:#D19A66">solid</span><span style="color:#D19A66"> 3</span><span style="color:#E06C75">px</span><span style="color:#ABB2BF"> limegreen;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF">    pointer-events: </span><span style="color:#D19A66">none</span><span style="color:#ABB2BF">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF">    opacity: </span><span style="color:#D19A66">0</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">  }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D19A66">  .demo-subject</span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#ABB2BF">    position: </span><span style="color:#D19A66">absolute</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">    top: </span><span style="color:#D19A66">150</span><span style="color:#E06C75">px</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">    left: </span><span style="color:#D19A66">100</span><span style="color:#E06C75">px</span><span style="color:#ABB2BF">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF">    width: </span><span style="color:#D19A66">100</span><span style="color:#E06C75">px</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">    height: </span><span style="color:#D19A66">100</span><span style="color:#E06C75">px</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">    border: </span><span style="color:#D19A66">dashed</span><span style="color:#D19A66"> 3</span><span style="color:#E06C75">px</span><span style="color:#D19A66"> yellow</span><span style="color:#ABB2BF">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75">    cursor</span><span style="color:#ABB2BF">: </span><span style="color:#D19A66">pointer</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">  }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D19A66">  .rotated</span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#ABB2BF">    left: </span><span style="color:#D19A66">270</span><span style="color:#E06C75">px</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">    transform: </span><span style="color:#56B6C2">rotate</span><span style="color:#ABB2BF">(</span><span style="color:#D19A66">45</span><span style="color:#E06C75">deg</span><span style="color:#ABB2BF">);</span></span>
<span class="line"><span style="color:#ABB2BF">  }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D19A66">  .parent</span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#ABB2BF">    position: </span><span style="color:#D19A66">absolute</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">    top: </span><span style="color:#D19A66">125</span><span style="color:#E06C75">px</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">    left: </span><span style="color:#D19A66">440</span><span style="color:#E06C75">px</span><span style="color:#ABB2BF">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF">    width: </span><span style="color:#D19A66">150</span><span style="color:#E06C75">px</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">    height: </span><span style="color:#D19A66">150</span><span style="color:#E06C75">px</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">    border: </span><span style="color:#D19A66">dashed</span><span style="color:#D19A66"> 3</span><span style="color:#E06C75">px</span><span style="color:#ABB2BF"> darkmagenta;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75">    cursor</span><span style="color:#ABB2BF">: </span><span style="color:#D19A66">pointer</span><span style="color:#ABB2BF">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF">    transform: </span><span style="color:#56B6C2">skew</span><span style="color:#ABB2BF">(</span><span style="color:#D19A66">-15</span><span style="color:#E06C75">deg</span><span style="color:#ABB2BF">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D19A66">    .child</span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#ABB2BF">      width: </span><span style="color:#D19A66">75</span><span style="color:#E06C75">px</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">      height: </span><span style="color:#D19A66">75</span><span style="color:#E06C75">px</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">      top: </span><span style="color:#D19A66">0</span><span style="color:#E06C75">px</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">      left: </span><span style="color:#D19A66">0</span><span style="color:#E06C75">px</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">    }</span></span>
<span class="line"><span style="color:#ABB2BF">  }</span></span>
<span class="line"><span style="color:#ABB2BF">&#x3C;/</span><span style="color:#E06C75">style</span><span style="color:#ABB2BF">></span></span>
<span class="line"></span></code></pre>`;
