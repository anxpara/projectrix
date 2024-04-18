export const CssIsAwesomeUsage = `import { getProjection, setInlineStyles, clearInlineStyles } from 'projectrix';
import { animate } from 'motion';

let currentSide: 'left' | 'right' = 'left';

function flipFromCurrentSide(): void {
  const subject = currentSide === 'left' ? leftTarget : rightTarget;
  const target = currentSide === 'left' ? rightTarget : leftTarget;
  const { toSubject, toTargetOrigin } = getProjection(subject, target);

  setInlineStyles(target, toSubject);
  subject.style.opacity = '0';
  target.style.opacity = '1';

  const flipAnim = animate(
    target,
    { ...toTargetOrigin },
    { duration: 0.75, easing: 'ease-in-out' },
  );

  flipAnim.finished.then(() => {
    clearInlineStyles(target);
    currentSide = otherSide(currentSide);
    toNeutral();
  });
}`;

export const CssIsAwesomeCode = `<script lang="ts">
  import { onMount, onDestroy, tick } from 'svelte';
  import type { Writable } from 'svelte/store';
  import type { Options } from '$lib/options';
  import { getProjection, setInlineStyles, clearInlineStyles } from 'projectrix';
  import { animate, type AnimationControls, type AnimationOptionsWithOverrides } from 'motion';

  // options are part of demos infrastructure
  export let options: Writable<Options>;
  $: log = $options.log;

  let leftOuter: HTMLElement;
  let rightOuter: HTMLElement;

  let leftInner: HTMLElement;
  let rightInner: HTMLElement;

  let leftTarget: HTMLElement;
  let rightTarget: HTMLElement;

  type Side = 'left' | 'right';
  let currentSide: Side = 'left';
  function isLeft(side: Side): boolean {
    return side === 'left';
  }
  function otherSide(side: Side): Side {
    return isLeft(side) ? 'right' : 'left';
  }

  let currentAnim: AnimationControls | undefined = undefined;

  const ToNeutralDurationS = 2;
  const ToFlipAnglesDurationS = 2;
  const FlipDurationS = 0.75;

  onMount(async () => {
    await tick();
    toNeutral();
  });

  onDestroy(() => {
    currentAnim?.pause();
    currentAnim = undefined;
  });

  function toNeutral(): void {
    currentAnim = animate(
      [leftOuter, rightOuter],
      { transform: 'rotateY(0deg)' },
      { duration: ToNeutralDurationS, easing: 'linear' },
    );

    raiseCurrentSideInner(ToNeutralDurationS);

    currentAnim.finished.then(() => {
      toFlipAnglesForCurrentSide();
    });
  }

  function toFlipAnglesForCurrentSide(): void {
    // switch outers' pivot sides
    leftOuter.style.transformOrigin = otherSide(currentSide);
    rightOuter.style.transformOrigin = currentSide;

    currentAnim = animate(
      leftOuter,
      { transform: isLeft(currentSide) ? 'rotateY(-66deg)' : 'rotateY(66deg)' },
      { duration: ToFlipAnglesDurationS, easing: 'linear' },
    );
    animate(
      rightOuter,
      { transform: isLeft(currentSide) ? 'rotateY(66deg)' : 'rotateY(-66deg)' },
      { duration: ToFlipAnglesDurationS, easing: 'linear' },
    );

    lowerCurrentSideInner(ToFlipAnglesDurationS);

    currentAnim.finished.then(() => {
      flipFromCurrentSide();
    });
  }

  function flipFromCurrentSide(): void {
    const subject = isLeft(currentSide) ? leftTarget : rightTarget;
    const target = isLeft(currentSide) ? rightTarget : leftTarget;
    const { toSubject, toTargetOrigin } = getProjection(subject, target, {
      log,
    });

    setInlineStyles(target, toSubject);
    subject.style.opacity = '0';
    target.style.opacity = '1';

    currentAnim = animate(
      target,
      { ...toTargetOrigin },
      { duration: FlipDurationS, easing: 'ease-in-out' },
    );

    currentAnim.finished.then(() => {
      clearInlineStyles(target);
      currentSide = otherSide(currentSide);
      toNeutral();
    });
  }

  function raiseCurrentSideInner(durationS: number): void {
    const inner = isLeft(currentSide) ? leftInner : rightInner;
    const target = isLeft(currentSide) ? leftTarget : rightTarget;

    const animOptions: AnimationOptionsWithOverrides = {
      delay: durationS * 0.25,
      duration: durationS * 0.5,
      easing: 'linear',
    };
    animate(inner, { transform: 'rotateX(47deg)' }, animOptions);
    animate(
      target,
      { transform: 'translateY(1em) rotateX(314deg) rotateY(360deg) translateY(-4em)' },
      animOptions,
    );
  }

  function lowerCurrentSideInner(durationS: number): void {
    const inner = isLeft(currentSide) ? leftInner : rightInner;
    const target = isLeft(currentSide) ? leftTarget : rightTarget;

    const animOptions: AnimationOptionsWithOverrides = {
      delay: durationS * 0.25,
      duration: durationS * 0.75,
      easing: 'linear',
    };
    animate(inner, { transform: 'rotateX(80deg)' }, animOptions);
    animate(
      target,
      { transform: 'translateY(-4em) rotateX(280deg) rotateY(360deg) translateY(-4em)' },
      animOptions,
    );
  }
</script>

<div class="two-sided-flex">
  <div bind:this={leftOuter} class="perspective-container left outer">
    <div bind:this={leftInner} class="perspective-container left inner">
      <div bind:this={leftTarget} class="target left">
        <span>css is awesome</span>
      </div>
    </div>
  </div>
  <div bind:this={rightOuter} class="perspective-container right outer">
    <div bind:this={rightInner} class="perspective-container right inner">
      <div bind:this={rightTarget} class="target right">
        <span>css is awesome</span>
      </div>
    </div>
  </div>
</div>

<style lang="scss">
  .two-sided-flex {
    position: relative;
    margin-top: 1.5em;

    width: 100%;
    aspect-ratio: 3.6 / 1;
    container-type: size;

    display: flex;
    justify-content: space-around;
    align-items: center;
  }

  .perspective-container {
    font-size: 1.6cqw;

    border: solid 3px purple;
    width: 15em;
    height: 15em;

    color: purple;
  }

  .outer {
    position: relative;
    padding: 1em;

    display: flex;
    justify-content: center;
    align-items: center;

    perspective: 200px;
    transform-style: preserve-3d;
  }
  .left.outer {
    transform-origin: left;
    transform: rotateY(66deg);
  }
  .right.outer {
    transform-origin: right;
    transform: rotateY(-66deg);
  }

  .inner {
    width: 14em;
    height: 14em;

    display: flex;
    justify-content: center;
    align-items: center;

    transform-origin: bottom;
    transform: rotateX(80deg);
    transform-style: preserve-3d;
  }

  .target {
    border: solid 3px limegreen;
    padding: 0.4em;
    width: 9.4em;
    height: 12em;

    transform: translateY(-4em) rotateX(280deg) rotateY(360deg) translateY(-4em);

    font-weight: 300;
    color: limegreen;
    background-color: #12415a55;

    span {
      font-size: 3.6em;
    }
  }
  .right.target {
    opacity: 0;
  }
</style>`;

export const CssIsAwesomeUsageHL = `<pre class="shiki one-dark-pro" style="background-color:#282c34;color:#abb2bf" tabindex="0"><code><span class="line"><span style="color:#C678DD">import</span><span style="color:#ABB2BF"> { </span><span style="color:#E06C75">getProjection</span><span style="color:#ABB2BF">, </span><span style="color:#E06C75">setInlineStyles</span><span style="color:#ABB2BF">, </span><span style="color:#E06C75">clearInlineStyles</span><span style="color:#ABB2BF"> } </span><span style="color:#C678DD">from</span><span style="color:#98C379"> 'projectrix'</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#C678DD">import</span><span style="color:#ABB2BF"> { </span><span style="color:#E06C75">animate</span><span style="color:#ABB2BF"> } </span><span style="color:#C678DD">from</span><span style="color:#98C379"> 'motion'</span><span style="color:#ABB2BF">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD">let</span><span style="color:#E06C75"> currentSide</span><span style="color:#ABB2BF">: </span><span style="color:#98C379">'left'</span><span style="color:#ABB2BF"> | </span><span style="color:#98C379">'right'</span><span style="color:#56B6C2"> =</span><span style="color:#98C379"> 'left'</span><span style="color:#ABB2BF">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD">function</span><span style="color:#61AFEF"> flipFromCurrentSide</span><span style="color:#ABB2BF">(): </span><span style="color:#E5C07B">void</span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#C678DD">  const</span><span style="color:#E5C07B"> subject</span><span style="color:#56B6C2"> =</span><span style="color:#E06C75"> currentSide</span><span style="color:#56B6C2"> ===</span><span style="color:#98C379"> 'left'</span><span style="color:#C678DD"> ?</span><span style="color:#E06C75"> leftTarget</span><span style="color:#C678DD"> :</span><span style="color:#E06C75"> rightTarget</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#C678DD">  const</span><span style="color:#E5C07B"> target</span><span style="color:#56B6C2"> =</span><span style="color:#E06C75"> currentSide</span><span style="color:#56B6C2"> ===</span><span style="color:#98C379"> 'left'</span><span style="color:#C678DD"> ?</span><span style="color:#E06C75"> rightTarget</span><span style="color:#C678DD"> :</span><span style="color:#E06C75"> leftTarget</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#C678DD">  const</span><span style="color:#ABB2BF"> { </span><span style="color:#E5C07B">toSubject</span><span style="color:#ABB2BF">, </span><span style="color:#E5C07B">toTargetOrigin</span><span style="color:#ABB2BF"> } </span><span style="color:#56B6C2">=</span><span style="color:#61AFEF"> getProjection</span><span style="color:#ABB2BF">(</span><span style="color:#E06C75">subject</span><span style="color:#ABB2BF">, </span><span style="color:#E06C75">target</span><span style="color:#ABB2BF">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#61AFEF">  setInlineStyles</span><span style="color:#ABB2BF">(</span><span style="color:#E06C75">target</span><span style="color:#ABB2BF">, </span><span style="color:#E06C75">toSubject</span><span style="color:#ABB2BF">);</span></span>
<span class="line"><span style="color:#E5C07B">  subject</span><span style="color:#ABB2BF">.</span><span style="color:#E5C07B">style</span><span style="color:#ABB2BF">.</span><span style="color:#E06C75">opacity</span><span style="color:#56B6C2"> =</span><span style="color:#98C379"> '0'</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#E5C07B">  target</span><span style="color:#ABB2BF">.</span><span style="color:#E5C07B">style</span><span style="color:#ABB2BF">.</span><span style="color:#E06C75">opacity</span><span style="color:#56B6C2"> =</span><span style="color:#98C379"> '1'</span><span style="color:#ABB2BF">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD">  const</span><span style="color:#E5C07B"> flipAnim</span><span style="color:#56B6C2"> =</span><span style="color:#61AFEF"> animate</span><span style="color:#ABB2BF">(</span></span>
<span class="line"><span style="color:#E06C75">    target</span><span style="color:#ABB2BF">,</span></span>
<span class="line"><span style="color:#ABB2BF">    { ...</span><span style="color:#E06C75">toTargetOrigin</span><span style="color:#ABB2BF"> },</span></span>
<span class="line"><span style="color:#ABB2BF">    { </span><span style="color:#E06C75">duration</span><span style="color:#ABB2BF">: </span><span style="color:#D19A66">0.75</span><span style="color:#ABB2BF">, </span><span style="color:#E06C75">easing</span><span style="color:#ABB2BF">: </span><span style="color:#98C379">'ease-in-out'</span><span style="color:#ABB2BF"> },</span></span>
<span class="line"><span style="color:#ABB2BF">  );</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E5C07B">  flipAnim</span><span style="color:#ABB2BF">.</span><span style="color:#E5C07B">finished</span><span style="color:#ABB2BF">.</span><span style="color:#61AFEF">then</span><span style="color:#ABB2BF">(() </span><span style="color:#C678DD">=></span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#61AFEF">    clearInlineStyles</span><span style="color:#ABB2BF">(</span><span style="color:#E06C75">target</span><span style="color:#ABB2BF">);</span></span>
<span class="line"><span style="color:#E06C75">    currentSide</span><span style="color:#56B6C2"> =</span><span style="color:#61AFEF"> otherSide</span><span style="color:#ABB2BF">(</span><span style="color:#E06C75">currentSide</span><span style="color:#ABB2BF">);</span></span>
<span class="line"><span style="color:#61AFEF">    toNeutral</span><span style="color:#ABB2BF">();</span></span>
<span class="line"><span style="color:#ABB2BF">  });</span></span>
<span class="line"><span style="color:#ABB2BF">}</span></span></code></pre>`;

export const CssIsAwesomeCodeHL = `<pre class="shiki one-dark-pro" style="background-color:#282c34;color:#abb2bf" tabindex="0"><code><span class="line"><span style="color:#ABB2BF">&#x3C;</span><span style="color:#E06C75">script</span><span style="color:#D19A66"> lang</span><span style="color:#ABB2BF">=</span><span style="color:#98C379">"ts"</span><span style="color:#ABB2BF">></span></span>
<span class="line"><span style="color:#C678DD">  import</span><span style="color:#ABB2BF"> { </span><span style="color:#E06C75">onMount</span><span style="color:#ABB2BF">, </span><span style="color:#E06C75">onDestroy</span><span style="color:#ABB2BF">, </span><span style="color:#E06C75">tick</span><span style="color:#ABB2BF"> } </span><span style="color:#C678DD">from</span><span style="color:#98C379"> 'svelte'</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#C678DD">  import</span><span style="color:#C678DD"> type</span><span style="color:#ABB2BF"> { </span><span style="color:#E06C75">Writable</span><span style="color:#ABB2BF"> } </span><span style="color:#C678DD">from</span><span style="color:#98C379"> 'svelte/store'</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#C678DD">  import</span><span style="color:#C678DD"> type</span><span style="color:#ABB2BF"> { </span><span style="color:#E06C75">Options</span><span style="color:#ABB2BF"> } </span><span style="color:#C678DD">from</span><span style="color:#98C379"> '$lib/options'</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#C678DD">  import</span><span style="color:#ABB2BF"> { </span><span style="color:#E06C75">getProjection</span><span style="color:#ABB2BF">, </span><span style="color:#E06C75">setInlineStyles</span><span style="color:#ABB2BF">, </span><span style="color:#E06C75">clearInlineStyles</span><span style="color:#ABB2BF"> } </span><span style="color:#C678DD">from</span><span style="color:#98C379"> 'projectrix'</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#C678DD">  import</span><span style="color:#ABB2BF"> { </span><span style="color:#E06C75">animate</span><span style="color:#ABB2BF">, </span><span style="color:#C678DD">type</span><span style="color:#E06C75"> AnimationControls</span><span style="color:#ABB2BF">, </span><span style="color:#C678DD">type</span><span style="color:#E06C75"> AnimationOptionsWithOverrides</span><span style="color:#ABB2BF"> } </span><span style="color:#C678DD">from</span><span style="color:#98C379"> 'motion'</span><span style="color:#ABB2BF">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic">  // options are part of demos infrastructure</span></span>
<span class="line"><span style="color:#C678DD">  export</span><span style="color:#C678DD"> let</span><span style="color:#E06C75"> options</span><span style="color:#ABB2BF">: </span><span style="color:#E5C07B">Writable</span><span style="color:#ABB2BF">&#x3C;</span><span style="color:#E5C07B">Options</span><span style="color:#ABB2BF">>;</span></span>
<span class="line"><span style="color:#E06C75">  $</span><span style="color:#ABB2BF">: </span><span style="color:#E06C75">log</span><span style="color:#56B6C2"> =</span><span style="color:#ABB2BF"> $</span><span style="color:#E5C07B">options</span><span style="color:#ABB2BF">.</span><span style="color:#E06C75">log</span><span style="color:#ABB2BF">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD">  let</span><span style="color:#E06C75"> leftOuter</span><span style="color:#ABB2BF">: </span><span style="color:#E5C07B">HTMLElement</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#C678DD">  let</span><span style="color:#E06C75"> rightOuter</span><span style="color:#ABB2BF">: </span><span style="color:#E5C07B">HTMLElement</span><span style="color:#ABB2BF">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD">  let</span><span style="color:#E06C75"> leftInner</span><span style="color:#ABB2BF">: </span><span style="color:#E5C07B">HTMLElement</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#C678DD">  let</span><span style="color:#E06C75"> rightInner</span><span style="color:#ABB2BF">: </span><span style="color:#E5C07B">HTMLElement</span><span style="color:#ABB2BF">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD">  let</span><span style="color:#E06C75"> leftTarget</span><span style="color:#ABB2BF">: </span><span style="color:#E5C07B">HTMLElement</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#C678DD">  let</span><span style="color:#E06C75"> rightTarget</span><span style="color:#ABB2BF">: </span><span style="color:#E5C07B">HTMLElement</span><span style="color:#ABB2BF">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD">  type</span><span style="color:#E5C07B"> Side</span><span style="color:#56B6C2"> =</span><span style="color:#98C379"> 'left'</span><span style="color:#ABB2BF"> | </span><span style="color:#98C379">'right'</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#C678DD">  let</span><span style="color:#E06C75"> currentSide</span><span style="color:#ABB2BF">: </span><span style="color:#E5C07B">Side</span><span style="color:#56B6C2"> =</span><span style="color:#98C379"> 'left'</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#C678DD">  function</span><span style="color:#61AFEF"> isLeft</span><span style="color:#ABB2BF">(</span><span style="color:#E06C75;font-style:italic">side</span><span style="color:#ABB2BF">: </span><span style="color:#E5C07B">Side</span><span style="color:#ABB2BF">): </span><span style="color:#E5C07B">boolean</span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#C678DD">    return</span><span style="color:#E06C75"> side</span><span style="color:#56B6C2"> ===</span><span style="color:#98C379"> 'left'</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">  }</span></span>
<span class="line"><span style="color:#C678DD">  function</span><span style="color:#61AFEF"> otherSide</span><span style="color:#ABB2BF">(</span><span style="color:#E06C75;font-style:italic">side</span><span style="color:#ABB2BF">: </span><span style="color:#E5C07B">Side</span><span style="color:#ABB2BF">): </span><span style="color:#E5C07B">Side</span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#C678DD">    return</span><span style="color:#61AFEF"> isLeft</span><span style="color:#ABB2BF">(</span><span style="color:#E06C75">side</span><span style="color:#ABB2BF">) </span><span style="color:#C678DD">?</span><span style="color:#98C379"> 'right'</span><span style="color:#C678DD"> :</span><span style="color:#98C379"> 'left'</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">  }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD">  let</span><span style="color:#E06C75"> currentAnim</span><span style="color:#ABB2BF">: </span><span style="color:#E5C07B">AnimationControls</span><span style="color:#ABB2BF"> | </span><span style="color:#E5C07B">undefined</span><span style="color:#56B6C2"> =</span><span style="color:#D19A66"> undefined</span><span style="color:#ABB2BF">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD">  const</span><span style="color:#E5C07B"> ToNeutralDurationS</span><span style="color:#56B6C2"> =</span><span style="color:#D19A66"> 2</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#C678DD">  const</span><span style="color:#E5C07B"> ToFlipAnglesDurationS</span><span style="color:#56B6C2"> =</span><span style="color:#D19A66"> 2</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#C678DD">  const</span><span style="color:#E5C07B"> FlipDurationS</span><span style="color:#56B6C2"> =</span><span style="color:#D19A66"> 0.75</span><span style="color:#ABB2BF">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#61AFEF">  onMount</span><span style="color:#ABB2BF">(</span><span style="color:#C678DD">async</span><span style="color:#ABB2BF"> () </span><span style="color:#C678DD">=></span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#C678DD">    await</span><span style="color:#61AFEF"> tick</span><span style="color:#ABB2BF">();</span></span>
<span class="line"><span style="color:#61AFEF">    toNeutral</span><span style="color:#ABB2BF">();</span></span>
<span class="line"><span style="color:#ABB2BF">  });</span></span>
<span class="line"></span>
<span class="line"><span style="color:#61AFEF">  onDestroy</span><span style="color:#ABB2BF">(() </span><span style="color:#C678DD">=></span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#E5C07B">    currentAnim</span><span style="color:#ABB2BF">?.</span><span style="color:#61AFEF">pause</span><span style="color:#ABB2BF">();</span></span>
<span class="line"><span style="color:#E06C75">    currentAnim</span><span style="color:#56B6C2"> =</span><span style="color:#D19A66"> undefined</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">  });</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD">  function</span><span style="color:#61AFEF"> toNeutral</span><span style="color:#ABB2BF">(): </span><span style="color:#E5C07B">void</span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#E06C75">    currentAnim</span><span style="color:#56B6C2"> =</span><span style="color:#61AFEF"> animate</span><span style="color:#ABB2BF">(</span></span>
<span class="line"><span style="color:#ABB2BF">      [</span><span style="color:#E06C75">leftOuter</span><span style="color:#ABB2BF">, </span><span style="color:#E06C75">rightOuter</span><span style="color:#ABB2BF">],</span></span>
<span class="line"><span style="color:#ABB2BF">      { </span><span style="color:#E06C75">transform</span><span style="color:#ABB2BF">: </span><span style="color:#98C379">'rotateY(0deg)'</span><span style="color:#ABB2BF"> },</span></span>
<span class="line"><span style="color:#ABB2BF">      { </span><span style="color:#E06C75">duration</span><span style="color:#ABB2BF">: </span><span style="color:#E06C75">ToNeutralDurationS</span><span style="color:#ABB2BF">, </span><span style="color:#E06C75">easing</span><span style="color:#ABB2BF">: </span><span style="color:#98C379">'linear'</span><span style="color:#ABB2BF"> },</span></span>
<span class="line"><span style="color:#ABB2BF">    );</span></span>
<span class="line"></span>
<span class="line"><span style="color:#61AFEF">    raiseCurrentSideInner</span><span style="color:#ABB2BF">(</span><span style="color:#E06C75">ToNeutralDurationS</span><span style="color:#ABB2BF">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E5C07B">    currentAnim</span><span style="color:#ABB2BF">.</span><span style="color:#E5C07B">finished</span><span style="color:#ABB2BF">.</span><span style="color:#61AFEF">then</span><span style="color:#ABB2BF">(() </span><span style="color:#C678DD">=></span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#61AFEF">      toFlipAnglesForCurrentSide</span><span style="color:#ABB2BF">();</span></span>
<span class="line"><span style="color:#ABB2BF">    });</span></span>
<span class="line"><span style="color:#ABB2BF">  }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD">  function</span><span style="color:#61AFEF"> toFlipAnglesForCurrentSide</span><span style="color:#ABB2BF">(): </span><span style="color:#E5C07B">void</span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic">    // switch outers' pivot sides</span></span>
<span class="line"><span style="color:#E5C07B">    leftOuter</span><span style="color:#ABB2BF">.</span><span style="color:#E5C07B">style</span><span style="color:#ABB2BF">.</span><span style="color:#E06C75">transformOrigin</span><span style="color:#56B6C2"> =</span><span style="color:#61AFEF"> otherSide</span><span style="color:#ABB2BF">(</span><span style="color:#E06C75">currentSide</span><span style="color:#ABB2BF">);</span></span>
<span class="line"><span style="color:#E5C07B">    rightOuter</span><span style="color:#ABB2BF">.</span><span style="color:#E5C07B">style</span><span style="color:#ABB2BF">.</span><span style="color:#E06C75">transformOrigin</span><span style="color:#56B6C2"> =</span><span style="color:#E06C75"> currentSide</span><span style="color:#ABB2BF">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75">    currentAnim</span><span style="color:#56B6C2"> =</span><span style="color:#61AFEF"> animate</span><span style="color:#ABB2BF">(</span></span>
<span class="line"><span style="color:#E06C75">      leftOuter</span><span style="color:#ABB2BF">,</span></span>
<span class="line"><span style="color:#ABB2BF">      { </span><span style="color:#E06C75">transform</span><span style="color:#ABB2BF">: </span><span style="color:#61AFEF">isLeft</span><span style="color:#ABB2BF">(</span><span style="color:#E06C75">currentSide</span><span style="color:#ABB2BF">) </span><span style="color:#C678DD">?</span><span style="color:#98C379"> 'rotateY(-66deg)'</span><span style="color:#C678DD"> :</span><span style="color:#98C379"> 'rotateY(66deg)'</span><span style="color:#ABB2BF"> },</span></span>
<span class="line"><span style="color:#ABB2BF">      { </span><span style="color:#E06C75">duration</span><span style="color:#ABB2BF">: </span><span style="color:#E06C75">ToFlipAnglesDurationS</span><span style="color:#ABB2BF">, </span><span style="color:#E06C75">easing</span><span style="color:#ABB2BF">: </span><span style="color:#98C379">'linear'</span><span style="color:#ABB2BF"> },</span></span>
<span class="line"><span style="color:#ABB2BF">    );</span></span>
<span class="line"><span style="color:#61AFEF">    animate</span><span style="color:#ABB2BF">(</span></span>
<span class="line"><span style="color:#E06C75">      rightOuter</span><span style="color:#ABB2BF">,</span></span>
<span class="line"><span style="color:#ABB2BF">      { </span><span style="color:#E06C75">transform</span><span style="color:#ABB2BF">: </span><span style="color:#61AFEF">isLeft</span><span style="color:#ABB2BF">(</span><span style="color:#E06C75">currentSide</span><span style="color:#ABB2BF">) </span><span style="color:#C678DD">?</span><span style="color:#98C379"> 'rotateY(66deg)'</span><span style="color:#C678DD"> :</span><span style="color:#98C379"> 'rotateY(-66deg)'</span><span style="color:#ABB2BF"> },</span></span>
<span class="line"><span style="color:#ABB2BF">      { </span><span style="color:#E06C75">duration</span><span style="color:#ABB2BF">: </span><span style="color:#E06C75">ToFlipAnglesDurationS</span><span style="color:#ABB2BF">, </span><span style="color:#E06C75">easing</span><span style="color:#ABB2BF">: </span><span style="color:#98C379">'linear'</span><span style="color:#ABB2BF"> },</span></span>
<span class="line"><span style="color:#ABB2BF">    );</span></span>
<span class="line"></span>
<span class="line"><span style="color:#61AFEF">    lowerCurrentSideInner</span><span style="color:#ABB2BF">(</span><span style="color:#E06C75">ToFlipAnglesDurationS</span><span style="color:#ABB2BF">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E5C07B">    currentAnim</span><span style="color:#ABB2BF">.</span><span style="color:#E5C07B">finished</span><span style="color:#ABB2BF">.</span><span style="color:#61AFEF">then</span><span style="color:#ABB2BF">(() </span><span style="color:#C678DD">=></span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#61AFEF">      flipFromCurrentSide</span><span style="color:#ABB2BF">();</span></span>
<span class="line"><span style="color:#ABB2BF">    });</span></span>
<span class="line"><span style="color:#ABB2BF">  }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD">  function</span><span style="color:#61AFEF"> flipFromCurrentSide</span><span style="color:#ABB2BF">(): </span><span style="color:#E5C07B">void</span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#C678DD">    const</span><span style="color:#E5C07B"> subject</span><span style="color:#56B6C2"> =</span><span style="color:#61AFEF"> isLeft</span><span style="color:#ABB2BF">(</span><span style="color:#E06C75">currentSide</span><span style="color:#ABB2BF">) </span><span style="color:#C678DD">?</span><span style="color:#E06C75"> leftTarget</span><span style="color:#C678DD"> :</span><span style="color:#E06C75"> rightTarget</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#C678DD">    const</span><span style="color:#E5C07B"> target</span><span style="color:#56B6C2"> =</span><span style="color:#61AFEF"> isLeft</span><span style="color:#ABB2BF">(</span><span style="color:#E06C75">currentSide</span><span style="color:#ABB2BF">) </span><span style="color:#C678DD">?</span><span style="color:#E06C75"> rightTarget</span><span style="color:#C678DD"> :</span><span style="color:#E06C75"> leftTarget</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#C678DD">    const</span><span style="color:#ABB2BF"> { </span><span style="color:#E5C07B">toSubject</span><span style="color:#ABB2BF">, </span><span style="color:#E5C07B">toTargetOrigin</span><span style="color:#ABB2BF"> } </span><span style="color:#56B6C2">=</span><span style="color:#61AFEF"> getProjection</span><span style="color:#ABB2BF">(</span><span style="color:#E06C75">subject</span><span style="color:#ABB2BF">, </span><span style="color:#E06C75">target</span><span style="color:#ABB2BF">, {</span></span>
<span class="line"><span style="color:#E06C75">      log</span><span style="color:#ABB2BF">,</span></span>
<span class="line"><span style="color:#ABB2BF">    });</span></span>
<span class="line"></span>
<span class="line"><span style="color:#61AFEF">    setInlineStyles</span><span style="color:#ABB2BF">(</span><span style="color:#E06C75">target</span><span style="color:#ABB2BF">, </span><span style="color:#E06C75">toSubject</span><span style="color:#ABB2BF">);</span></span>
<span class="line"><span style="color:#E5C07B">    subject</span><span style="color:#ABB2BF">.</span><span style="color:#E5C07B">style</span><span style="color:#ABB2BF">.</span><span style="color:#E06C75">opacity</span><span style="color:#56B6C2"> =</span><span style="color:#98C379"> '0'</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#E5C07B">    target</span><span style="color:#ABB2BF">.</span><span style="color:#E5C07B">style</span><span style="color:#ABB2BF">.</span><span style="color:#E06C75">opacity</span><span style="color:#56B6C2"> =</span><span style="color:#98C379"> '1'</span><span style="color:#ABB2BF">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75">    currentAnim</span><span style="color:#56B6C2"> =</span><span style="color:#61AFEF"> animate</span><span style="color:#ABB2BF">(</span></span>
<span class="line"><span style="color:#E06C75">      target</span><span style="color:#ABB2BF">,</span></span>
<span class="line"><span style="color:#ABB2BF">      { ...</span><span style="color:#E06C75">toTargetOrigin</span><span style="color:#ABB2BF"> },</span></span>
<span class="line"><span style="color:#ABB2BF">      { </span><span style="color:#E06C75">duration</span><span style="color:#ABB2BF">: </span><span style="color:#E06C75">FlipDurationS</span><span style="color:#ABB2BF">, </span><span style="color:#E06C75">easing</span><span style="color:#ABB2BF">: </span><span style="color:#98C379">'ease-in-out'</span><span style="color:#ABB2BF"> },</span></span>
<span class="line"><span style="color:#ABB2BF">    );</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E5C07B">    currentAnim</span><span style="color:#ABB2BF">.</span><span style="color:#E5C07B">finished</span><span style="color:#ABB2BF">.</span><span style="color:#61AFEF">then</span><span style="color:#ABB2BF">(() </span><span style="color:#C678DD">=></span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#61AFEF">      clearInlineStyles</span><span style="color:#ABB2BF">(</span><span style="color:#E06C75">target</span><span style="color:#ABB2BF">);</span></span>
<span class="line"><span style="color:#E06C75">      currentSide</span><span style="color:#56B6C2"> =</span><span style="color:#61AFEF"> otherSide</span><span style="color:#ABB2BF">(</span><span style="color:#E06C75">currentSide</span><span style="color:#ABB2BF">);</span></span>
<span class="line"><span style="color:#61AFEF">      toNeutral</span><span style="color:#ABB2BF">();</span></span>
<span class="line"><span style="color:#ABB2BF">    });</span></span>
<span class="line"><span style="color:#ABB2BF">  }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD">  function</span><span style="color:#61AFEF"> raiseCurrentSideInner</span><span style="color:#ABB2BF">(</span><span style="color:#E06C75;font-style:italic">durationS</span><span style="color:#ABB2BF">: </span><span style="color:#E5C07B">number</span><span style="color:#ABB2BF">): </span><span style="color:#E5C07B">void</span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#C678DD">    const</span><span style="color:#E5C07B"> inner</span><span style="color:#56B6C2"> =</span><span style="color:#61AFEF"> isLeft</span><span style="color:#ABB2BF">(</span><span style="color:#E06C75">currentSide</span><span style="color:#ABB2BF">) </span><span style="color:#C678DD">?</span><span style="color:#E06C75"> leftInner</span><span style="color:#C678DD"> :</span><span style="color:#E06C75"> rightInner</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#C678DD">    const</span><span style="color:#E5C07B"> target</span><span style="color:#56B6C2"> =</span><span style="color:#61AFEF"> isLeft</span><span style="color:#ABB2BF">(</span><span style="color:#E06C75">currentSide</span><span style="color:#ABB2BF">) </span><span style="color:#C678DD">?</span><span style="color:#E06C75"> leftTarget</span><span style="color:#C678DD"> :</span><span style="color:#E06C75"> rightTarget</span><span style="color:#ABB2BF">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD">    const</span><span style="color:#E5C07B"> animOptions</span><span style="color:#ABB2BF">: </span><span style="color:#E5C07B">AnimationOptionsWithOverrides</span><span style="color:#56B6C2"> =</span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#E06C75">      delay</span><span style="color:#ABB2BF">: </span><span style="color:#E06C75">durationS</span><span style="color:#56B6C2"> *</span><span style="color:#D19A66"> 0.25</span><span style="color:#ABB2BF">,</span></span>
<span class="line"><span style="color:#E06C75">      duration</span><span style="color:#ABB2BF">: </span><span style="color:#E06C75">durationS</span><span style="color:#56B6C2"> *</span><span style="color:#D19A66"> 0.5</span><span style="color:#ABB2BF">,</span></span>
<span class="line"><span style="color:#E06C75">      easing</span><span style="color:#ABB2BF">: </span><span style="color:#98C379">'linear'</span><span style="color:#ABB2BF">,</span></span>
<span class="line"><span style="color:#ABB2BF">    };</span></span>
<span class="line"><span style="color:#61AFEF">    animate</span><span style="color:#ABB2BF">(</span><span style="color:#E06C75">inner</span><span style="color:#ABB2BF">, { </span><span style="color:#E06C75">transform</span><span style="color:#ABB2BF">: </span><span style="color:#98C379">'rotateX(47deg)'</span><span style="color:#ABB2BF"> }, </span><span style="color:#E06C75">animOptions</span><span style="color:#ABB2BF">);</span></span>
<span class="line"><span style="color:#61AFEF">    animate</span><span style="color:#ABB2BF">(</span></span>
<span class="line"><span style="color:#E06C75">      target</span><span style="color:#ABB2BF">,</span></span>
<span class="line"><span style="color:#ABB2BF">      { </span><span style="color:#E06C75">transform</span><span style="color:#ABB2BF">: </span><span style="color:#98C379">'translateY(1em) rotateX(314deg) rotateY(360deg) translateY(-4em)'</span><span style="color:#ABB2BF"> },</span></span>
<span class="line"><span style="color:#E06C75">      animOptions</span><span style="color:#ABB2BF">,</span></span>
<span class="line"><span style="color:#ABB2BF">    );</span></span>
<span class="line"><span style="color:#ABB2BF">  }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD">  function</span><span style="color:#61AFEF"> lowerCurrentSideInner</span><span style="color:#ABB2BF">(</span><span style="color:#E06C75;font-style:italic">durationS</span><span style="color:#ABB2BF">: </span><span style="color:#E5C07B">number</span><span style="color:#ABB2BF">): </span><span style="color:#E5C07B">void</span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#C678DD">    const</span><span style="color:#E5C07B"> inner</span><span style="color:#56B6C2"> =</span><span style="color:#61AFEF"> isLeft</span><span style="color:#ABB2BF">(</span><span style="color:#E06C75">currentSide</span><span style="color:#ABB2BF">) </span><span style="color:#C678DD">?</span><span style="color:#E06C75"> leftInner</span><span style="color:#C678DD"> :</span><span style="color:#E06C75"> rightInner</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#C678DD">    const</span><span style="color:#E5C07B"> target</span><span style="color:#56B6C2"> =</span><span style="color:#61AFEF"> isLeft</span><span style="color:#ABB2BF">(</span><span style="color:#E06C75">currentSide</span><span style="color:#ABB2BF">) </span><span style="color:#C678DD">?</span><span style="color:#E06C75"> leftTarget</span><span style="color:#C678DD"> :</span><span style="color:#E06C75"> rightTarget</span><span style="color:#ABB2BF">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD">    const</span><span style="color:#E5C07B"> animOptions</span><span style="color:#ABB2BF">: </span><span style="color:#E5C07B">AnimationOptionsWithOverrides</span><span style="color:#56B6C2"> =</span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#E06C75">      delay</span><span style="color:#ABB2BF">: </span><span style="color:#E06C75">durationS</span><span style="color:#56B6C2"> *</span><span style="color:#D19A66"> 0.25</span><span style="color:#ABB2BF">,</span></span>
<span class="line"><span style="color:#E06C75">      duration</span><span style="color:#ABB2BF">: </span><span style="color:#E06C75">durationS</span><span style="color:#56B6C2"> *</span><span style="color:#D19A66"> 0.75</span><span style="color:#ABB2BF">,</span></span>
<span class="line"><span style="color:#E06C75">      easing</span><span style="color:#ABB2BF">: </span><span style="color:#98C379">'linear'</span><span style="color:#ABB2BF">,</span></span>
<span class="line"><span style="color:#ABB2BF">    };</span></span>
<span class="line"><span style="color:#61AFEF">    animate</span><span style="color:#ABB2BF">(</span><span style="color:#E06C75">inner</span><span style="color:#ABB2BF">, { </span><span style="color:#E06C75">transform</span><span style="color:#ABB2BF">: </span><span style="color:#98C379">'rotateX(80deg)'</span><span style="color:#ABB2BF"> }, </span><span style="color:#E06C75">animOptions</span><span style="color:#ABB2BF">);</span></span>
<span class="line"><span style="color:#61AFEF">    animate</span><span style="color:#ABB2BF">(</span></span>
<span class="line"><span style="color:#E06C75">      target</span><span style="color:#ABB2BF">,</span></span>
<span class="line"><span style="color:#ABB2BF">      { </span><span style="color:#E06C75">transform</span><span style="color:#ABB2BF">: </span><span style="color:#98C379">'translateY(-4em) rotateX(280deg) rotateY(360deg) translateY(-4em)'</span><span style="color:#ABB2BF"> },</span></span>
<span class="line"><span style="color:#E06C75">      animOptions</span><span style="color:#ABB2BF">,</span></span>
<span class="line"><span style="color:#ABB2BF">    );</span></span>
<span class="line"><span style="color:#ABB2BF">  }</span></span>
<span class="line"><span style="color:#ABB2BF">&#x3C;/</span><span style="color:#E06C75">script</span><span style="color:#ABB2BF">></span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF">&#x3C;</span><span style="color:#E06C75">div</span><span style="color:#D19A66"> class</span><span style="color:#ABB2BF">=</span><span style="color:#98C379">"two-sided-flex"</span><span style="color:#ABB2BF">></span></span>
<span class="line"><span style="color:#ABB2BF">  &#x3C;</span><span style="color:#E06C75">div</span><span style="color:#C678DD"> bind</span><span style="color:#ABB2BF">:</span><span style="color:#E5C07B">this</span><span style="color:#ABB2BF">=</span><span style="color:#C678DD">{</span><span style="color:#E06C75">leftOuter</span><span style="color:#C678DD">}</span><span style="color:#D19A66"> class</span><span style="color:#ABB2BF">=</span><span style="color:#98C379">"perspective-container left outer"</span><span style="color:#ABB2BF">></span></span>
<span class="line"><span style="color:#ABB2BF">    &#x3C;</span><span style="color:#E06C75">div</span><span style="color:#C678DD"> bind</span><span style="color:#ABB2BF">:</span><span style="color:#E5C07B">this</span><span style="color:#ABB2BF">=</span><span style="color:#C678DD">{</span><span style="color:#E06C75">leftInner</span><span style="color:#C678DD">}</span><span style="color:#D19A66"> class</span><span style="color:#ABB2BF">=</span><span style="color:#98C379">"perspective-container left inner"</span><span style="color:#ABB2BF">></span></span>
<span class="line"><span style="color:#ABB2BF">      &#x3C;</span><span style="color:#E06C75">div</span><span style="color:#C678DD"> bind</span><span style="color:#ABB2BF">:</span><span style="color:#E5C07B">this</span><span style="color:#ABB2BF">=</span><span style="color:#C678DD">{</span><span style="color:#E06C75">leftTarget</span><span style="color:#C678DD">}</span><span style="color:#D19A66"> class</span><span style="color:#ABB2BF">=</span><span style="color:#98C379">"target left"</span><span style="color:#ABB2BF">></span></span>
<span class="line"><span style="color:#ABB2BF">        &#x3C;</span><span style="color:#E06C75">span</span><span style="color:#ABB2BF">>css is awesome&#x3C;/</span><span style="color:#E06C75">span</span><span style="color:#ABB2BF">></span></span>
<span class="line"><span style="color:#ABB2BF">      &#x3C;/</span><span style="color:#E06C75">div</span><span style="color:#ABB2BF">></span></span>
<span class="line"><span style="color:#ABB2BF">    &#x3C;/</span><span style="color:#E06C75">div</span><span style="color:#ABB2BF">></span></span>
<span class="line"><span style="color:#ABB2BF">  &#x3C;/</span><span style="color:#E06C75">div</span><span style="color:#ABB2BF">></span></span>
<span class="line"><span style="color:#ABB2BF">  &#x3C;</span><span style="color:#E06C75">div</span><span style="color:#C678DD"> bind</span><span style="color:#ABB2BF">:</span><span style="color:#E5C07B">this</span><span style="color:#ABB2BF">=</span><span style="color:#C678DD">{</span><span style="color:#E06C75">rightOuter</span><span style="color:#C678DD">}</span><span style="color:#D19A66"> class</span><span style="color:#ABB2BF">=</span><span style="color:#98C379">"perspective-container right outer"</span><span style="color:#ABB2BF">></span></span>
<span class="line"><span style="color:#ABB2BF">    &#x3C;</span><span style="color:#E06C75">div</span><span style="color:#C678DD"> bind</span><span style="color:#ABB2BF">:</span><span style="color:#E5C07B">this</span><span style="color:#ABB2BF">=</span><span style="color:#C678DD">{</span><span style="color:#E06C75">rightInner</span><span style="color:#C678DD">}</span><span style="color:#D19A66"> class</span><span style="color:#ABB2BF">=</span><span style="color:#98C379">"perspective-container right inner"</span><span style="color:#ABB2BF">></span></span>
<span class="line"><span style="color:#ABB2BF">      &#x3C;</span><span style="color:#E06C75">div</span><span style="color:#C678DD"> bind</span><span style="color:#ABB2BF">:</span><span style="color:#E5C07B">this</span><span style="color:#ABB2BF">=</span><span style="color:#C678DD">{</span><span style="color:#E06C75">rightTarget</span><span style="color:#C678DD">}</span><span style="color:#D19A66"> class</span><span style="color:#ABB2BF">=</span><span style="color:#98C379">"target right"</span><span style="color:#ABB2BF">></span></span>
<span class="line"><span style="color:#ABB2BF">        &#x3C;</span><span style="color:#E06C75">span</span><span style="color:#ABB2BF">>css is awesome&#x3C;/</span><span style="color:#E06C75">span</span><span style="color:#ABB2BF">></span></span>
<span class="line"><span style="color:#ABB2BF">      &#x3C;/</span><span style="color:#E06C75">div</span><span style="color:#ABB2BF">></span></span>
<span class="line"><span style="color:#ABB2BF">    &#x3C;/</span><span style="color:#E06C75">div</span><span style="color:#ABB2BF">></span></span>
<span class="line"><span style="color:#ABB2BF">  &#x3C;/</span><span style="color:#E06C75">div</span><span style="color:#ABB2BF">></span></span>
<span class="line"><span style="color:#ABB2BF">&#x3C;/</span><span style="color:#E06C75">div</span><span style="color:#ABB2BF">></span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF">&#x3C;</span><span style="color:#E06C75">style</span><span style="color:#D19A66"> lang</span><span style="color:#ABB2BF">=</span><span style="color:#98C379">"scss"</span><span style="color:#ABB2BF">></span></span>
<span class="line"><span style="color:#D19A66">  .two-sided-flex</span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#ABB2BF">    position: </span><span style="color:#D19A66">relative</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">    margin-top: </span><span style="color:#D19A66">1.5</span><span style="color:#E06C75">em</span><span style="color:#ABB2BF">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF">    width: </span><span style="color:#D19A66">100</span><span style="color:#E06C75">%</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">    aspect-ratio: </span><span style="color:#D19A66">3.6</span><span style="color:#56B6C2"> /</span><span style="color:#D19A66"> 1</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">    container-type: size;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF">    display: </span><span style="color:#D19A66">flex</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">    justify-content: </span><span style="color:#D19A66">space-around</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">    align-items: </span><span style="color:#D19A66">center</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">  }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D19A66">  .perspective-container</span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#ABB2BF">    font-size: </span><span style="color:#D19A66">1.6</span><span style="color:#E06C75">cqw</span><span style="color:#ABB2BF">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF">    border: </span><span style="color:#D19A66">solid</span><span style="color:#D19A66"> 3</span><span style="color:#E06C75">px</span><span style="color:#D19A66"> purple</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">    width: </span><span style="color:#D19A66">15</span><span style="color:#E06C75">em</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">    height: </span><span style="color:#D19A66">15</span><span style="color:#E06C75">em</span><span style="color:#ABB2BF">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF">    color: </span><span style="color:#D19A66">purple</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">  }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D19A66">  .outer</span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#ABB2BF">    position: </span><span style="color:#D19A66">relative</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">    padding: </span><span style="color:#D19A66">1</span><span style="color:#E06C75">em</span><span style="color:#ABB2BF">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF">    display: </span><span style="color:#D19A66">flex</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">    justify-content: </span><span style="color:#D19A66">center</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">    align-items: </span><span style="color:#D19A66">center</span><span style="color:#ABB2BF">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF">    perspective: </span><span style="color:#D19A66">200</span><span style="color:#E06C75">px</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">    transform-style: </span><span style="color:#D19A66">preserve-3d</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">  }</span></span>
<span class="line"><span style="color:#D19A66">  .left.outer</span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#ABB2BF">    transform-origin: </span><span style="color:#D19A66">left</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">    transform: </span><span style="color:#56B6C2">rotateY</span><span style="color:#ABB2BF">(</span><span style="color:#D19A66">66</span><span style="color:#E06C75">deg</span><span style="color:#ABB2BF">);</span></span>
<span class="line"><span style="color:#ABB2BF">  }</span></span>
<span class="line"><span style="color:#D19A66">  .right.outer</span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#ABB2BF">    transform-origin: </span><span style="color:#D19A66">right</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">    transform: </span><span style="color:#56B6C2">rotateY</span><span style="color:#ABB2BF">(</span><span style="color:#D19A66">-66</span><span style="color:#E06C75">deg</span><span style="color:#ABB2BF">);</span></span>
<span class="line"><span style="color:#ABB2BF">  }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D19A66">  .inner</span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#ABB2BF">    width: </span><span style="color:#D19A66">14</span><span style="color:#E06C75">em</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">    height: </span><span style="color:#D19A66">14</span><span style="color:#E06C75">em</span><span style="color:#ABB2BF">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF">    display: </span><span style="color:#D19A66">flex</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">    justify-content: </span><span style="color:#D19A66">center</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">    align-items: </span><span style="color:#D19A66">center</span><span style="color:#ABB2BF">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF">    transform-origin: </span><span style="color:#D19A66">bottom</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">    transform: </span><span style="color:#56B6C2">rotateX</span><span style="color:#ABB2BF">(</span><span style="color:#D19A66">80</span><span style="color:#E06C75">deg</span><span style="color:#ABB2BF">);</span></span>
<span class="line"><span style="color:#ABB2BF">    transform-style: </span><span style="color:#D19A66">preserve-3d</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">  }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D19A66">  .target</span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#ABB2BF">    border: </span><span style="color:#D19A66">solid</span><span style="color:#D19A66"> 3</span><span style="color:#E06C75">px</span><span style="color:#ABB2BF"> limegreen;</span></span>
<span class="line"><span style="color:#ABB2BF">    padding: </span><span style="color:#D19A66">0.4</span><span style="color:#E06C75">em</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">    width: </span><span style="color:#D19A66">9.4</span><span style="color:#E06C75">em</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">    height: </span><span style="color:#D19A66">12</span><span style="color:#E06C75">em</span><span style="color:#ABB2BF">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF">    transform: </span><span style="color:#56B6C2">translateY</span><span style="color:#ABB2BF">(</span><span style="color:#D19A66">-4</span><span style="color:#E06C75">em</span><span style="color:#ABB2BF">) </span><span style="color:#56B6C2">rotateX</span><span style="color:#ABB2BF">(</span><span style="color:#D19A66">280</span><span style="color:#E06C75">deg</span><span style="color:#ABB2BF">) </span><span style="color:#56B6C2">rotateY</span><span style="color:#ABB2BF">(</span><span style="color:#D19A66">360</span><span style="color:#E06C75">deg</span><span style="color:#ABB2BF">) </span><span style="color:#56B6C2">translateY</span><span style="color:#ABB2BF">(</span><span style="color:#D19A66">-4</span><span style="color:#E06C75">em</span><span style="color:#ABB2BF">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF">    font-weight: </span><span style="color:#D19A66">300</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">    color: limegreen;</span></span>
<span class="line"><span style="color:#ABB2BF">    background-color: </span><span style="color:#D19A66">#12415a55</span><span style="color:#ABB2BF">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75">    span</span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#ABB2BF">      font-size: </span><span style="color:#D19A66">3.6</span><span style="color:#E06C75">em</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">    }</span></span>
<span class="line"><span style="color:#ABB2BF">  }</span></span>
<span class="line"><span style="color:#D19A66">  .right.target</span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#ABB2BF">    opacity: </span><span style="color:#D19A66">0</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">  }</span></span>
<span class="line"><span style="color:#ABB2BF">&#x3C;/</span><span style="color:#E06C75">style</span><span style="color:#ABB2BF">></span></span></code></pre>`;
