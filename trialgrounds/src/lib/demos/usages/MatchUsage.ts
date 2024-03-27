export const MatchUsage = `import { getProjection, setInlineStyles, type PartialProjectionResults } from 'projectrix';

function match(subject: HTMLElement, target: HTMLElement): void {
  const { toSubject } = getProjection(subject, target) as PartialProjectionResults;
  delete toSubject.borderStyle; // preserve target border style
  
  setInlineStyles(target, toSubject);
}`;

export const MatchCode = `<script lang="ts">
  import type { Options } from '$lib/options';
  import { getProjection, setInlineStyles, type PartialProjectionResults } from 'projectrix';
  import { onMount, tick } from 'svelte';
  import type { Writable } from 'svelte/store';
  import type DemoStartSlot from '../DemoStartSlot.svelte';

  // start slot and options are part of demos infrastructure
  export let startSlot: DemoStartSlot;
  export let options: Writable<Options>;
  $: log = $options.log;

  let target: HTMLElement;
  let inSlot = false;

  onMount(async () => {
    await tick();
    startSlot.show();
    inSlot = true;
  });

  function match(subject: HTMLElement, target: HTMLElement): void {
    if (inSlot) {
      startSlot.hide();
      target.style.opacity = '1';
      inSlot = false;
    }

    const { toSubject } =
      getProjection(subject, target, { log }) as PartialProjectionResults;
    delete toSubject.borderStyle; // preserve target border style
    
    setInlineStyles(target, toSubject);
  }

  function subjectClickHandler(subject: HTMLElement): void {
    match(subject, target);
  }
</script>

<div class="size-container">
  <div class="subject-container">
    <button class="demo-subject" on:click={(e) => subjectClickHandler(e.currentTarget)} />
    <button class="demo-subject rotated" on:click={(e) => subjectClickHandler(e.currentTarget)} />
    <button class="demo-subject parent" on:click={(e) => subjectClickHandler(e.currentTarget)}>
      <button
        class="demo-subject child"
        on:click|stopPropagation={(e) => subjectClickHandler(e.currentTarget)}
      />
    </button>
  </div>
</div>

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
    // any positioning works with Projectrix
    position: absolute;

    // last i checked, safari webkit can't handle non-integer borders
    // on transformed elements, so i always recommend pixels for borders
    border: solid 3px limegreen;

    opacity: 0;
    pointer-events: none;
  }

  .size-container {
    position: relative;
    width: 100%;
    aspect-ratio: 4 / 1;
    margin-top: 1.5em;

    container-type: size;
  }

  .subject-container {
    width: 100%;
    height: 100%;

    display: flex;
    justify-content: center;
    align-items: center;

    gap: 10cqw;
  }

  .demo-subject {
    width: 14.25cqw;
    height: 14.25cqw;
    border: dashed 3px yellow;

    cursor: pointer;
  }

  .rotated {
    transform: rotate(45deg);
  }

  .parent {
    width: 21cqw;
    height: 21cqw;
    border-color: darkmagenta;

    transform: skew(-15deg);

    .child {
      position: absolute;
      top: 0px;
      left: 0px;

      width: 10.75cqw;
      height: 10.75cqw;
    }
  }
</style>`;

export const MatchUsageHL = `<pre class="shiki one-dark-pro" style="background-color:#282c34;color:#abb2bf" tabindex="0"><code><span class="line"><span style="color:#C678DD">import</span><span style="color:#ABB2BF"> { </span><span style="color:#E06C75">getProjection</span><span style="color:#ABB2BF">, </span><span style="color:#E06C75">setInlineStyles</span><span style="color:#ABB2BF">, </span><span style="color:#C678DD">type</span><span style="color:#E06C75"> PartialProjectionResults</span><span style="color:#ABB2BF"> } </span><span style="color:#C678DD">from</span><span style="color:#98C379"> 'projectrix'</span><span style="color:#ABB2BF">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD">function</span><span style="color:#61AFEF"> match</span><span style="color:#ABB2BF">(</span><span style="color:#E06C75;font-style:italic">subject</span><span style="color:#ABB2BF">: </span><span style="color:#E5C07B">HTMLElement</span><span style="color:#ABB2BF">, </span><span style="color:#E06C75;font-style:italic">target</span><span style="color:#ABB2BF">: </span><span style="color:#E5C07B">HTMLElement</span><span style="color:#ABB2BF">): </span><span style="color:#E5C07B">void</span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#C678DD">  const</span><span style="color:#ABB2BF"> { </span><span style="color:#E5C07B">toSubject</span><span style="color:#ABB2BF"> } </span><span style="color:#56B6C2">=</span><span style="color:#61AFEF"> getProjection</span><span style="color:#ABB2BF">(</span><span style="color:#E06C75">subject</span><span style="color:#ABB2BF">, </span><span style="color:#E06C75">target</span><span style="color:#ABB2BF">) </span><span style="color:#C678DD">as</span><span style="color:#E5C07B"> PartialProjectionResults</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#C678DD">  delete</span><span style="color:#E5C07B"> toSubject</span><span style="color:#ABB2BF">.</span><span style="color:#E06C75">borderStyle</span><span style="color:#ABB2BF">; </span><span style="color:#7F848E;font-style:italic">// preserve target border style</span></span>
<span class="line"><span style="color:#ABB2BF">  </span></span>
<span class="line"><span style="color:#61AFEF">  setInlineStyles</span><span style="color:#ABB2BF">(</span><span style="color:#E06C75">target</span><span style="color:#ABB2BF">, </span><span style="color:#E06C75">toSubject</span><span style="color:#ABB2BF">);</span></span>
<span class="line"><span style="color:#ABB2BF">}</span></span></code></pre>`;

export const MatchCodeHL = `<pre class="shiki one-dark-pro" style="background-color:#282c34;color:#abb2bf" tabindex="0"><code><span class="line"><span style="color:#ABB2BF">&#x3C;</span><span style="color:#E06C75">script</span><span style="color:#D19A66"> lang</span><span style="color:#ABB2BF">=</span><span style="color:#98C379">"ts"</span><span style="color:#ABB2BF">></span></span>
<span class="line"><span style="color:#C678DD">  import</span><span style="color:#C678DD"> type</span><span style="color:#ABB2BF"> { </span><span style="color:#E06C75">Options</span><span style="color:#ABB2BF"> } </span><span style="color:#C678DD">from</span><span style="color:#98C379"> '$lib/options'</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#C678DD">  import</span><span style="color:#ABB2BF"> { </span><span style="color:#E06C75">getProjection</span><span style="color:#ABB2BF">, </span><span style="color:#E06C75">setInlineStyles</span><span style="color:#ABB2BF">, </span><span style="color:#C678DD">type</span><span style="color:#E06C75"> PartialProjectionResults</span><span style="color:#ABB2BF"> } </span><span style="color:#C678DD">from</span><span style="color:#98C379"> 'projectrix'</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#C678DD">  import</span><span style="color:#ABB2BF"> { </span><span style="color:#E06C75">onMount</span><span style="color:#ABB2BF">, </span><span style="color:#E06C75">tick</span><span style="color:#ABB2BF"> } </span><span style="color:#C678DD">from</span><span style="color:#98C379"> 'svelte'</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#C678DD">  import</span><span style="color:#C678DD"> type</span><span style="color:#ABB2BF"> { </span><span style="color:#E06C75">Writable</span><span style="color:#ABB2BF"> } </span><span style="color:#C678DD">from</span><span style="color:#98C379"> 'svelte/store'</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#C678DD">  import</span><span style="color:#C678DD"> type</span><span style="color:#E06C75"> DemoStartSlot</span><span style="color:#C678DD"> from</span><span style="color:#98C379"> '../DemoStartSlot.svelte'</span><span style="color:#ABB2BF">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic">  // start slot and options are part of demos infrastructure</span></span>
<span class="line"><span style="color:#C678DD">  export</span><span style="color:#C678DD"> let</span><span style="color:#E06C75"> startSlot</span><span style="color:#ABB2BF">: </span><span style="color:#E5C07B">DemoStartSlot</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#C678DD">  export</span><span style="color:#C678DD"> let</span><span style="color:#E06C75"> options</span><span style="color:#ABB2BF">: </span><span style="color:#E5C07B">Writable</span><span style="color:#ABB2BF">&#x3C;</span><span style="color:#E5C07B">Options</span><span style="color:#ABB2BF">>;</span></span>
<span class="line"><span style="color:#E06C75">  $</span><span style="color:#ABB2BF">: </span><span style="color:#E06C75">log</span><span style="color:#56B6C2"> =</span><span style="color:#ABB2BF"> $</span><span style="color:#E5C07B">options</span><span style="color:#ABB2BF">.</span><span style="color:#E06C75">log</span><span style="color:#ABB2BF">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD">  let</span><span style="color:#E06C75"> target</span><span style="color:#ABB2BF">: </span><span style="color:#E5C07B">HTMLElement</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#C678DD">  let</span><span style="color:#E06C75"> inSlot</span><span style="color:#56B6C2"> =</span><span style="color:#D19A66"> false</span><span style="color:#ABB2BF">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#61AFEF">  onMount</span><span style="color:#ABB2BF">(</span><span style="color:#C678DD">async</span><span style="color:#ABB2BF"> () </span><span style="color:#C678DD">=></span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#C678DD">    await</span><span style="color:#61AFEF"> tick</span><span style="color:#ABB2BF">();</span></span>
<span class="line"><span style="color:#E5C07B">    startSlot</span><span style="color:#ABB2BF">.</span><span style="color:#61AFEF">show</span><span style="color:#ABB2BF">();</span></span>
<span class="line"><span style="color:#E06C75">    inSlot</span><span style="color:#56B6C2"> =</span><span style="color:#D19A66"> true</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">  });</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD">  function</span><span style="color:#61AFEF"> match</span><span style="color:#ABB2BF">(</span><span style="color:#E06C75;font-style:italic">subject</span><span style="color:#ABB2BF">: </span><span style="color:#E5C07B">HTMLElement</span><span style="color:#ABB2BF">, </span><span style="color:#E06C75;font-style:italic">target</span><span style="color:#ABB2BF">: </span><span style="color:#E5C07B">HTMLElement</span><span style="color:#ABB2BF">): </span><span style="color:#E5C07B">void</span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#C678DD">    if</span><span style="color:#ABB2BF"> (</span><span style="color:#E06C75">inSlot</span><span style="color:#ABB2BF">) {</span></span>
<span class="line"><span style="color:#E5C07B">      startSlot</span><span style="color:#ABB2BF">.</span><span style="color:#61AFEF">hide</span><span style="color:#ABB2BF">();</span></span>
<span class="line"><span style="color:#E5C07B">      target</span><span style="color:#ABB2BF">.</span><span style="color:#E5C07B">style</span><span style="color:#ABB2BF">.</span><span style="color:#E06C75">opacity</span><span style="color:#56B6C2"> =</span><span style="color:#98C379"> '1'</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#E06C75">      inSlot</span><span style="color:#56B6C2"> =</span><span style="color:#D19A66"> false</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD">    const</span><span style="color:#ABB2BF"> { </span><span style="color:#E5C07B">toSubject</span><span style="color:#ABB2BF"> } </span><span style="color:#56B6C2">=</span></span>
<span class="line"><span style="color:#61AFEF">      getProjection</span><span style="color:#ABB2BF">(</span><span style="color:#E06C75">subject</span><span style="color:#ABB2BF">, </span><span style="color:#E06C75">target</span><span style="color:#ABB2BF">, { </span><span style="color:#E06C75">log</span><span style="color:#ABB2BF"> }) </span><span style="color:#C678DD">as</span><span style="color:#E5C07B"> PartialProjectionResults</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#C678DD">    delete</span><span style="color:#E5C07B"> toSubject</span><span style="color:#ABB2BF">.</span><span style="color:#E06C75">borderStyle</span><span style="color:#ABB2BF">; </span><span style="color:#7F848E;font-style:italic">// preserve target border style</span></span>
<span class="line"><span style="color:#ABB2BF">    </span></span>
<span class="line"><span style="color:#61AFEF">    setInlineStyles</span><span style="color:#ABB2BF">(</span><span style="color:#E06C75">target</span><span style="color:#ABB2BF">, </span><span style="color:#E06C75">toSubject</span><span style="color:#ABB2BF">);</span></span>
<span class="line"><span style="color:#ABB2BF">  }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD">  function</span><span style="color:#61AFEF"> subjectClickHandler</span><span style="color:#ABB2BF">(</span><span style="color:#E06C75;font-style:italic">subject</span><span style="color:#ABB2BF">: </span><span style="color:#E5C07B">HTMLElement</span><span style="color:#ABB2BF">): </span><span style="color:#E5C07B">void</span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#61AFEF">    match</span><span style="color:#ABB2BF">(</span><span style="color:#E06C75">subject</span><span style="color:#ABB2BF">, </span><span style="color:#E06C75">target</span><span style="color:#ABB2BF">);</span></span>
<span class="line"><span style="color:#ABB2BF">  }</span></span>
<span class="line"><span style="color:#ABB2BF">&#x3C;/</span><span style="color:#E06C75">script</span><span style="color:#ABB2BF">></span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF">&#x3C;</span><span style="color:#E06C75">div</span><span style="color:#D19A66"> class</span><span style="color:#ABB2BF">=</span><span style="color:#98C379">"size-container"</span><span style="color:#ABB2BF">></span></span>
<span class="line"><span style="color:#ABB2BF">  &#x3C;</span><span style="color:#E06C75">div</span><span style="color:#D19A66"> class</span><span style="color:#ABB2BF">=</span><span style="color:#98C379">"subject-container"</span><span style="color:#ABB2BF">></span></span>
<span class="line"><span style="color:#ABB2BF">    &#x3C;</span><span style="color:#E06C75">button</span><span style="color:#D19A66"> class</span><span style="color:#ABB2BF">=</span><span style="color:#98C379">"demo-subject"</span><span style="color:#C678DD"> on</span><span style="color:#ABB2BF">:</span><span style="color:#E5C07B">click</span><span style="color:#ABB2BF">=</span><span style="color:#C678DD">{</span><span style="color:#ABB2BF">(</span><span style="color:#E06C75;font-style:italic">e</span><span style="color:#ABB2BF">) </span><span style="color:#C678DD">=></span><span style="color:#61AFEF"> subjectClickHandler</span><span style="color:#ABB2BF">(</span><span style="color:#E5C07B">e</span><span style="color:#ABB2BF">.</span><span style="color:#E06C75">currentTarget</span><span style="color:#ABB2BF">)</span><span style="color:#C678DD">}</span><span style="color:#ABB2BF"> /></span></span>
<span class="line"><span style="color:#ABB2BF">    &#x3C;</span><span style="color:#E06C75">button</span><span style="color:#D19A66"> class</span><span style="color:#ABB2BF">=</span><span style="color:#98C379">"demo-subject rotated"</span><span style="color:#C678DD"> on</span><span style="color:#ABB2BF">:</span><span style="color:#E5C07B">click</span><span style="color:#ABB2BF">=</span><span style="color:#C678DD">{</span><span style="color:#ABB2BF">(</span><span style="color:#E06C75;font-style:italic">e</span><span style="color:#ABB2BF">) </span><span style="color:#C678DD">=></span><span style="color:#61AFEF"> subjectClickHandler</span><span style="color:#ABB2BF">(</span><span style="color:#E5C07B">e</span><span style="color:#ABB2BF">.</span><span style="color:#E06C75">currentTarget</span><span style="color:#ABB2BF">)</span><span style="color:#C678DD">}</span><span style="color:#ABB2BF"> /></span></span>
<span class="line"><span style="color:#ABB2BF">    &#x3C;</span><span style="color:#E06C75">button</span><span style="color:#D19A66"> class</span><span style="color:#ABB2BF">=</span><span style="color:#98C379">"demo-subject parent"</span><span style="color:#C678DD"> on</span><span style="color:#ABB2BF">:</span><span style="color:#E5C07B">click</span><span style="color:#ABB2BF">=</span><span style="color:#C678DD">{</span><span style="color:#ABB2BF">(</span><span style="color:#E06C75;font-style:italic">e</span><span style="color:#ABB2BF">) </span><span style="color:#C678DD">=></span><span style="color:#61AFEF"> subjectClickHandler</span><span style="color:#ABB2BF">(</span><span style="color:#E5C07B">e</span><span style="color:#ABB2BF">.</span><span style="color:#E06C75">currentTarget</span><span style="color:#ABB2BF">)</span><span style="color:#C678DD">}</span><span style="color:#ABB2BF">></span></span>
<span class="line"><span style="color:#ABB2BF">      &#x3C;</span><span style="color:#E06C75">button</span></span>
<span class="line"><span style="color:#D19A66">        class</span><span style="color:#ABB2BF">=</span><span style="color:#98C379">"demo-subject child"</span></span>
<span class="line"><span style="color:#C678DD">        on</span><span style="color:#ABB2BF">:</span><span style="color:#E5C07B">click</span><span style="color:#ABB2BF">|</span><span style="color:#56B6C2">stopPropagation</span><span style="color:#ABB2BF">=</span><span style="color:#C678DD">{</span><span style="color:#ABB2BF">(</span><span style="color:#E06C75;font-style:italic">e</span><span style="color:#ABB2BF">) </span><span style="color:#C678DD">=></span><span style="color:#61AFEF"> subjectClickHandler</span><span style="color:#ABB2BF">(</span><span style="color:#E5C07B">e</span><span style="color:#ABB2BF">.</span><span style="color:#E06C75">currentTarget</span><span style="color:#ABB2BF">)</span><span style="color:#C678DD">}</span></span>
<span class="line"><span style="color:#ABB2BF">      /></span></span>
<span class="line"><span style="color:#ABB2BF">    &#x3C;/</span><span style="color:#E06C75">button</span><span style="color:#ABB2BF">></span></span>
<span class="line"><span style="color:#ABB2BF">  &#x3C;/</span><span style="color:#E06C75">div</span><span style="color:#ABB2BF">></span></span>
<span class="line"><span style="color:#ABB2BF">&#x3C;/</span><span style="color:#E06C75">div</span><span style="color:#ABB2BF">></span></span>
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
<span class="line"><span style="color:#7F848E;font-style:italic">    // any positioning works with Projectrix</span></span>
<span class="line"><span style="color:#ABB2BF">    position: </span><span style="color:#D19A66">absolute</span><span style="color:#ABB2BF">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic">    // last i checked, safari webkit can't handle non-integer borders</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic">    // on transformed elements, so i always recommend pixels for borders</span></span>
<span class="line"><span style="color:#ABB2BF">    border: </span><span style="color:#D19A66">solid</span><span style="color:#D19A66"> 3</span><span style="color:#E06C75">px</span><span style="color:#ABB2BF"> limegreen;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF">    opacity: </span><span style="color:#D19A66">0</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">    pointer-events: </span><span style="color:#D19A66">none</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">  }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D19A66">  .size-container</span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#ABB2BF">    position: </span><span style="color:#D19A66">relative</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">    width: </span><span style="color:#D19A66">100</span><span style="color:#E06C75">%</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">    aspect-ratio: </span><span style="color:#D19A66">4</span><span style="color:#56B6C2"> /</span><span style="color:#D19A66"> 1</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">    margin-top: </span><span style="color:#D19A66">1.5</span><span style="color:#E06C75">em</span><span style="color:#ABB2BF">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF">    container-type: size;</span></span>
<span class="line"><span style="color:#ABB2BF">  }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D19A66">  .subject-container</span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#ABB2BF">    width: </span><span style="color:#D19A66">100</span><span style="color:#E06C75">%</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">    height: </span><span style="color:#D19A66">100</span><span style="color:#E06C75">%</span><span style="color:#ABB2BF">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF">    display: </span><span style="color:#D19A66">flex</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">    justify-content: </span><span style="color:#D19A66">center</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">    align-items: </span><span style="color:#D19A66">center</span><span style="color:#ABB2BF">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF">    gap: </span><span style="color:#D19A66">10</span><span style="color:#E06C75">cqw</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">  }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D19A66">  .demo-subject</span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#ABB2BF">    width: </span><span style="color:#D19A66">14.25</span><span style="color:#E06C75">cqw</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">    height: </span><span style="color:#D19A66">14.25</span><span style="color:#E06C75">cqw</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">    border: </span><span style="color:#D19A66">dashed</span><span style="color:#D19A66"> 3</span><span style="color:#E06C75">px</span><span style="color:#D19A66"> yellow</span><span style="color:#ABB2BF">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75">    cursor</span><span style="color:#ABB2BF">: </span><span style="color:#D19A66">pointer</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">  }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D19A66">  .rotated</span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#ABB2BF">    transform: </span><span style="color:#56B6C2">rotate</span><span style="color:#ABB2BF">(</span><span style="color:#D19A66">45</span><span style="color:#E06C75">deg</span><span style="color:#ABB2BF">);</span></span>
<span class="line"><span style="color:#ABB2BF">  }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D19A66">  .parent</span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#ABB2BF">    width: </span><span style="color:#D19A66">21</span><span style="color:#E06C75">cqw</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">    height: </span><span style="color:#D19A66">21</span><span style="color:#E06C75">cqw</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">    border-color: darkmagenta;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF">    transform: </span><span style="color:#56B6C2">skew</span><span style="color:#ABB2BF">(</span><span style="color:#D19A66">-15</span><span style="color:#E06C75">deg</span><span style="color:#ABB2BF">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D19A66">    .child</span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#ABB2BF">      position: </span><span style="color:#D19A66">absolute</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">      top: </span><span style="color:#D19A66">0</span><span style="color:#E06C75">px</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">      left: </span><span style="color:#D19A66">0</span><span style="color:#E06C75">px</span><span style="color:#ABB2BF">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF">      width: </span><span style="color:#D19A66">10.75</span><span style="color:#E06C75">cqw</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">      height: </span><span style="color:#D19A66">10.75</span><span style="color:#E06C75">cqw</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">    }</span></span>
<span class="line"><span style="color:#ABB2BF">  }</span></span>
<span class="line"><span style="color:#ABB2BF">&#x3C;/</span><span style="color:#E06C75">style</span><span style="color:#ABB2BF">></span></span></code></pre>`;
