export const FlipUsage = `<pre class="shiki one-dark-pro" style="background-color:#282c34;color:#abb2bf" tabindex="0"><code><span class="line"><span style="color:#C678DD">import</span><span style="color:#ABB2BF"> { </span><span style="color:#E06C75">getProjection</span><span style="color:#ABB2BF"> } </span><span style="color:#C678DD">from</span><span style="color:#98C379"> 'projectrix'</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#C678DD">import</span><span style="color:#ABB2BF"> { </span><span style="color:#E06C75">animate</span><span style="color:#ABB2BF"> } </span><span style="color:#C678DD">from</span><span style="color:#98C379"> 'motion'</span><span style="color:#ABB2BF">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD">const</span><span style="color:#ABB2BF"> { </span><span style="color:#E5C07B">toSubject</span><span style="color:#ABB2BF">, </span><span style="color:#E5C07B">toTargetOrigin</span><span style="color:#ABB2BF"> } </span><span style="color:#56B6C2">=</span><span style="color:#61AFEF"> getProjection</span><span style="color:#ABB2BF">(</span><span style="color:#E06C75">subject</span><span style="color:#ABB2BF">, </span><span style="color:#E06C75">target</span><span style="color:#ABB2BF">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic">// set to subject</span></span>
<span class="line"><span style="color:#61AFEF">animate</span><span style="color:#ABB2BF">(</span><span style="color:#E06C75">target</span><span style="color:#ABB2BF">, { ...</span><span style="color:#E06C75">toSubject</span><span style="color:#ABB2BF"> }, { </span><span style="color:#E06C75">duration</span><span style="color:#ABB2BF">: </span><span style="color:#D19A66">0</span><span style="color:#ABB2BF"> });</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic">// FLIP back to origin</span></span>
<span class="line"><span style="color:#C678DD">const</span><span style="color:#E5C07B"> flipAnimation</span><span style="color:#56B6C2"> =</span><span style="color:#61AFEF"> animate</span><span style="color:#ABB2BF">(</span></span>
<span class="line"><span style="color:#E06C75">  target</span><span style="color:#ABB2BF">,</span></span>
<span class="line"><span style="color:#ABB2BF">  {</span></span>
<span class="line"><span style="color:#ABB2BF">    ...</span><span style="color:#E06C75">toTargetOrigin</span><span style="color:#ABB2BF">,</span></span>
<span class="line"><span style="color:#ABB2BF">  },</span></span>
<span class="line"><span style="color:#ABB2BF">  {</span></span>
<span class="line"><span style="color:#E06C75">    duration</span><span style="color:#ABB2BF">: </span><span style="color:#D19A66">1</span><span style="color:#ABB2BF">,</span></span>
<span class="line"><span style="color:#E06C75">    easing</span><span style="color:#ABB2BF">: </span><span style="color:#98C379">'ease-out'</span><span style="color:#ABB2BF">,</span></span>
<span class="line"><span style="color:#ABB2BF">  },</span></span>
<span class="line"><span style="color:#ABB2BF">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic">// clear inline styles when FLIP is done, if you care to</span></span>
<span class="line"><span style="color:#E5C07B">flipAnimation</span><span style="color:#ABB2BF">.</span><span style="color:#E5C07B">finished</span><span style="color:#ABB2BF">.</span><span style="color:#61AFEF">then</span><span style="color:#ABB2BF">(() </span><span style="color:#C678DD">=></span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#E5C07B">  target</span><span style="color:#ABB2BF">.</span><span style="color:#E5C07B">style</span><span style="color:#ABB2BF">.</span><span style="color:#E06C75">transform</span><span style="color:#56B6C2"> =</span><span style="color:#98C379"> ''</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic">  // etc...</span></span>
<span class="line"><span style="color:#ABB2BF">});</span></span></code></pre>`;

export const FlipCode = `<pre class="shiki one-dark-pro" style="background-color:#282c34;color:#abb2bf" tabindex="0"><code><span class="line"><span style="color:#ABB2BF">&#x3C;</span><span style="color:#E06C75">script</span><span style="color:#D19A66"> lang</span><span style="color:#ABB2BF">=</span><span style="color:#98C379">"ts"</span><span style="color:#ABB2BF">></span></span>
<span class="line"><span style="color:#C678DD">  import</span><span style="color:#ABB2BF"> { </span><span style="color:#E06C75">onDestroy</span><span style="color:#ABB2BF">, </span><span style="color:#E06C75">onMount</span><span style="color:#ABB2BF">, </span><span style="color:#E06C75">tick</span><span style="color:#ABB2BF"> } </span><span style="color:#C678DD">from</span><span style="color:#98C379"> 'svelte'</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#C678DD">  import</span><span style="color:#ABB2BF"> { </span><span style="color:#E06C75">getProjection</span><span style="color:#ABB2BF"> } </span><span style="color:#C678DD">from</span><span style="color:#98C379"> 'projectrix'</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#C678DD">  import</span><span style="color:#ABB2BF"> { </span><span style="color:#E06C75">animate</span><span style="color:#ABB2BF">, </span><span style="color:#C678DD">type</span><span style="color:#E06C75"> AnimationControls</span><span style="color:#ABB2BF"> } </span><span style="color:#C678DD">from</span><span style="color:#98C379"> 'motion'</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#C678DD">  import</span><span style="color:#C678DD"> type</span><span style="color:#ABB2BF"> { </span><span style="color:#E06C75">Writable</span><span style="color:#ABB2BF"> } </span><span style="color:#C678DD">from</span><span style="color:#98C379"> 'svelte/store'</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#C678DD">  import</span><span style="color:#C678DD"> type</span><span style="color:#ABB2BF"> { </span><span style="color:#E06C75">Options</span><span style="color:#ABB2BF"> } </span><span style="color:#C678DD">from</span><span style="color:#98C379"> '$lib/options'</span><span style="color:#ABB2BF">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic">  // starting slot is part of demos infrastructure, not specific to this demo</span></span>
<span class="line"><span style="color:#C678DD">  export</span><span style="color:#C678DD"> let</span><span style="color:#61AFEF"> setTargetToStartingSlot</span><span style="color:#ABB2BF">: (</span><span style="color:#E06C75;font-style:italic">target</span><span style="color:#ABB2BF">: </span><span style="color:#E5C07B">HTMLElement</span><span style="color:#ABB2BF">) </span><span style="color:#C678DD">=></span><span style="color:#E5C07B"> void</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#C678DD">  export</span><span style="color:#C678DD"> let</span><span style="color:#61AFEF"> revertSlotStyleInPlace</span><span style="color:#ABB2BF">: (</span><span style="color:#E06C75;font-style:italic">target</span><span style="color:#ABB2BF">: </span><span style="color:#E5C07B">HTMLElement</span><span style="color:#ABB2BF">) </span><span style="color:#C678DD">=></span><span style="color:#E5C07B"> void</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#C678DD">  export</span><span style="color:#C678DD"> let</span><span style="color:#E06C75"> options</span><span style="color:#ABB2BF">: </span><span style="color:#E5C07B">Writable</span><span style="color:#ABB2BF">&#x3C;</span><span style="color:#E5C07B">Options</span><span style="color:#ABB2BF">>;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD">  let</span><span style="color:#E06C75"> startingTarget</span><span style="color:#ABB2BF">: </span><span style="color:#E5C07B">HTMLElement</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#C678DD">  let</span><span style="color:#E06C75"> leftChildTarget</span><span style="color:#ABB2BF">: </span><span style="color:#E5C07B">HTMLElement</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#C678DD">  let</span><span style="color:#E06C75"> rightChildTarget</span><span style="color:#ABB2BF">: </span><span style="color:#E5C07B">HTMLElement</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#C678DD">  let</span><span style="color:#E06C75"> leftParent</span><span style="color:#ABB2BF">: </span><span style="color:#E5C07B">HTMLElement</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#C678DD">  let</span><span style="color:#E06C75"> rightParent</span><span style="color:#ABB2BF">: </span><span style="color:#E5C07B">HTMLElement</span><span style="color:#ABB2BF">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD">  let</span><span style="color:#E06C75"> currentTarget</span><span style="color:#ABB2BF">: </span><span style="color:#E5C07B">HTMLElement</span><span style="color:#ABB2BF"> | </span><span style="color:#E5C07B">undefined</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#C678DD">  let</span><span style="color:#E06C75"> currentAnim</span><span style="color:#ABB2BF">: </span><span style="color:#E5C07B">AnimationControls</span><span style="color:#ABB2BF"> | </span><span style="color:#E5C07B">undefined</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#C678DD">  let</span><span style="color:#E06C75"> currentTimeout</span><span style="color:#ABB2BF">: </span><span style="color:#E5C07B">NodeJS</span><span style="color:#ABB2BF">.</span><span style="color:#E5C07B">Timeout</span><span style="color:#ABB2BF"> | </span><span style="color:#E5C07B">undefined</span><span style="color:#ABB2BF">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#61AFEF">  onMount</span><span style="color:#ABB2BF">(</span><span style="color:#C678DD">async</span><span style="color:#ABB2BF"> () </span><span style="color:#C678DD">=></span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#C678DD">    await</span><span style="color:#61AFEF"> tick</span><span style="color:#ABB2BF">();</span></span>
<span class="line"></span>
<span class="line"><span style="color:#61AFEF">    setTimeout</span><span style="color:#ABB2BF">(() </span><span style="color:#C678DD">=></span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#61AFEF">      setTargetToStartingSlot</span><span style="color:#ABB2BF">(</span><span style="color:#E06C75">startingTarget</span><span style="color:#ABB2BF">);</span></span>
<span class="line"><span style="color:#E5C07B">      startingTarget</span><span style="color:#ABB2BF">.</span><span style="color:#E5C07B">style</span><span style="color:#ABB2BF">.</span><span style="color:#E06C75">opacity</span><span style="color:#56B6C2"> =</span><span style="color:#98C379"> '1'</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#E06C75">      currentTarget</span><span style="color:#56B6C2"> =</span><span style="color:#E06C75"> startingTarget</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">    }, </span><span style="color:#D19A66">50</span><span style="color:#ABB2BF">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75">    currentTimeout</span><span style="color:#56B6C2"> =</span><span style="color:#61AFEF"> setTimeout</span><span style="color:#ABB2BF">(() </span><span style="color:#C678DD">=></span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#61AFEF">      revertSlotStyleInPlace</span><span style="color:#ABB2BF">(</span><span style="color:#E06C75">startingTarget</span><span style="color:#ABB2BF">);</span></span>
<span class="line"><span style="color:#61AFEF">      flipToRightTarget</span><span style="color:#ABB2BF">();</span></span>
<span class="line"><span style="color:#ABB2BF">    }, </span><span style="color:#D19A66">1000</span><span style="color:#ABB2BF">);</span></span>
<span class="line"><span style="color:#ABB2BF">  });</span></span>
<span class="line"></span>
<span class="line"><span style="color:#61AFEF">  onDestroy</span><span style="color:#ABB2BF">(() </span><span style="color:#C678DD">=></span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#E06C75">    currentTarget</span><span style="color:#56B6C2"> =</span><span style="color:#D19A66"> undefined</span><span style="color:#ABB2BF">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E5C07B">    currentAnim</span><span style="color:#ABB2BF">?.</span><span style="color:#61AFEF">stop</span><span style="color:#ABB2BF">();</span></span>
<span class="line"><span style="color:#E06C75">    currentAnim</span><span style="color:#56B6C2"> =</span><span style="color:#D19A66"> undefined</span><span style="color:#ABB2BF">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#61AFEF">    clearTimeout</span><span style="color:#ABB2BF">(</span><span style="color:#E06C75">currentTimeout</span><span style="color:#ABB2BF">);</span></span>
<span class="line"><span style="color:#E06C75">    currentTimeout</span><span style="color:#56B6C2"> =</span><span style="color:#D19A66"> undefined</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">  });</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD">  function</span><span style="color:#61AFEF"> flipToLeftTarget</span><span style="color:#ABB2BF">(): </span><span style="color:#E5C07B">void</span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#61AFEF">    flipToTarget</span><span style="color:#ABB2BF">(</span><span style="color:#E06C75">leftParent</span><span style="color:#ABB2BF">, </span><span style="color:#E06C75">leftChildTarget</span><span style="color:#ABB2BF">, </span><span style="color:#D19A66">1</span><span style="color:#ABB2BF">, </span><span style="color:#E06C75">flipToRightTarget</span><span style="color:#ABB2BF">);</span></span>
<span class="line"><span style="color:#ABB2BF">  }</span></span>
<span class="line"><span style="color:#C678DD">  function</span><span style="color:#61AFEF"> flipToRightTarget</span><span style="color:#ABB2BF">(): </span><span style="color:#E5C07B">void</span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#61AFEF">    flipToTarget</span><span style="color:#ABB2BF">(</span><span style="color:#E06C75">rightParent</span><span style="color:#ABB2BF">, </span><span style="color:#E06C75">rightChildTarget</span><span style="color:#ABB2BF">, </span><span style="color:#56B6C2">-</span><span style="color:#D19A66">1</span><span style="color:#ABB2BF">, </span><span style="color:#E06C75">flipToLeftTarget</span><span style="color:#ABB2BF">);</span></span>
<span class="line"><span style="color:#ABB2BF">  }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD">  function</span><span style="color:#61AFEF"> flipToTarget</span><span style="color:#ABB2BF">(</span></span>
<span class="line"><span style="color:#E06C75;font-style:italic">    nextParent</span><span style="color:#ABB2BF">: </span><span style="color:#E5C07B">HTMLElement</span><span style="color:#ABB2BF">,</span></span>
<span class="line"><span style="color:#E06C75;font-style:italic">    nextTarget</span><span style="color:#ABB2BF">: </span><span style="color:#E5C07B">HTMLElement</span><span style="color:#ABB2BF">,</span></span>
<span class="line"><span style="color:#E06C75;font-style:italic">    dir</span><span style="color:#ABB2BF">: </span><span style="color:#E5C07B">number</span><span style="color:#ABB2BF">,</span></span>
<span class="line"><span style="color:#61AFEF">    nextFlip</span><span style="color:#ABB2BF">: () </span><span style="color:#C678DD">=></span><span style="color:#E5C07B"> void</span><span style="color:#ABB2BF">,</span></span>
<span class="line"><span style="color:#ABB2BF">  ): </span><span style="color:#E5C07B">void</span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#C678DD">    if</span><span style="color:#ABB2BF"> (</span><span style="color:#56B6C2">!</span><span style="color:#E06C75">currentTarget</span><span style="color:#ABB2BF">) </span><span style="color:#C678DD">return</span><span style="color:#ABB2BF">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD">    const</span><span style="color:#E5C07B"> projectionResults</span><span style="color:#56B6C2"> =</span><span style="color:#61AFEF"> getProjection</span><span style="color:#ABB2BF">(</span><span style="color:#E06C75">currentTarget</span><span style="color:#ABB2BF">, </span><span style="color:#E06C75">nextTarget</span><span style="color:#ABB2BF">);</span></span>
<span class="line"><span style="color:#C678DD">    const</span><span style="color:#ABB2BF"> { </span><span style="color:#E5C07B">toSubject</span><span style="color:#ABB2BF">, </span><span style="color:#E5C07B">toTargetOrigin</span><span style="color:#ABB2BF"> } </span><span style="color:#56B6C2">=</span><span style="color:#E06C75"> projectionResults</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#C678DD">    if</span><span style="color:#ABB2BF"> ($</span><span style="color:#E5C07B">options</span><span style="color:#ABB2BF">.</span><span style="color:#E06C75">log</span><span style="color:#ABB2BF">) {</span></span>
<span class="line"><span style="color:#E5C07B">      console</span><span style="color:#ABB2BF">.</span><span style="color:#61AFEF">log</span><span style="color:#ABB2BF">(</span><span style="color:#E06C75">projectionResults</span><span style="color:#ABB2BF">);</span></span>
<span class="line"><span style="color:#ABB2BF">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic">    // set next target to current target's projection</span></span>
<span class="line"><span style="color:#61AFEF">    animate</span><span style="color:#ABB2BF">(</span><span style="color:#E06C75">nextTarget</span><span style="color:#ABB2BF">, { ...</span><span style="color:#E06C75">toSubject</span><span style="color:#ABB2BF">, </span><span style="color:#E06C75">opacity</span><span style="color:#ABB2BF">: </span><span style="color:#98C379">'1'</span><span style="color:#ABB2BF"> }, { </span><span style="color:#E06C75">duration</span><span style="color:#ABB2BF">: </span><span style="color:#D19A66">0</span><span style="color:#ABB2BF"> });</span></span>
<span class="line"><span style="color:#E5C07B">    currentTarget</span><span style="color:#ABB2BF">.</span><span style="color:#E5C07B">style</span><span style="color:#ABB2BF">.</span><span style="color:#E06C75">opacity</span><span style="color:#56B6C2"> =</span><span style="color:#98C379"> '0'</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#E06C75">    currentTarget</span><span style="color:#56B6C2"> =</span><span style="color:#E06C75"> nextTarget</span><span style="color:#ABB2BF">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic">    // FLIP next target back to its origin</span></span>
<span class="line"><span style="color:#E06C75">    currentAnim</span><span style="color:#56B6C2"> =</span><span style="color:#61AFEF"> animate</span><span style="color:#ABB2BF">(</span></span>
<span class="line"><span style="color:#E06C75">      nextTarget</span><span style="color:#ABB2BF">,</span></span>
<span class="line"><span style="color:#ABB2BF">      {</span></span>
<span class="line"><span style="color:#ABB2BF">        ...</span><span style="color:#E06C75">toTargetOrigin</span><span style="color:#ABB2BF">,</span></span>
<span class="line"><span style="color:#ABB2BF">      },</span></span>
<span class="line"><span style="color:#ABB2BF">      {</span></span>
<span class="line"><span style="color:#E06C75">        duration</span><span style="color:#ABB2BF">: </span><span style="color:#D19A66">1</span><span style="color:#ABB2BF">,</span></span>
<span class="line"><span style="color:#E06C75">        easing</span><span style="color:#ABB2BF">: </span><span style="color:#98C379">'ease-out'</span><span style="color:#ABB2BF">,</span></span>
<span class="line"><span style="color:#ABB2BF">      },</span></span>
<span class="line"><span style="color:#ABB2BF">    );</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic">    // play parent animation</span></span>
<span class="line"><span style="color:#E5C07B">    currentAnim</span><span style="color:#ABB2BF">.</span><span style="color:#E5C07B">finished</span><span style="color:#ABB2BF">.</span><span style="color:#61AFEF">then</span><span style="color:#ABB2BF">(() </span><span style="color:#C678DD">=></span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#E06C75">      currentAnim</span><span style="color:#56B6C2"> =</span><span style="color:#61AFEF"> animate</span><span style="color:#ABB2BF">(</span></span>
<span class="line"><span style="color:#E06C75">        nextParent</span><span style="color:#ABB2BF">,</span></span>
<span class="line"><span style="color:#ABB2BF">        {</span></span>
<span class="line"><span style="color:#E06C75">          transform</span><span style="color:#ABB2BF">: [</span></span>
<span class="line"><span style="color:#98C379">            \`skew(</span><span style="color:#C678DD">\${</span><span style="color:#D19A66">15</span><span style="color:#56B6C2"> *</span><span style="color:#E06C75"> dir</span><span style="color:#C678DD">}</span><span style="color:#98C379">deg)\`</span><span style="color:#ABB2BF">,</span></span>
<span class="line"><span style="color:#98C379">            \`skew(</span><span style="color:#C678DD">\${</span><span style="color:#D19A66">15</span><span style="color:#56B6C2"> *</span><span style="color:#E06C75"> dir</span><span style="color:#C678DD">}</span><span style="color:#98C379">deg) rotate(</span><span style="color:#C678DD">\${</span><span style="color:#56B6C2">-</span><span style="color:#D19A66">20</span><span style="color:#56B6C2"> *</span><span style="color:#E06C75"> dir</span><span style="color:#C678DD">}</span><span style="color:#98C379">deg)\`</span><span style="color:#ABB2BF">,</span></span>
<span class="line"><span style="color:#98C379">            \`skew(</span><span style="color:#C678DD">\${</span><span style="color:#D19A66">15</span><span style="color:#56B6C2"> *</span><span style="color:#E06C75"> dir</span><span style="color:#C678DD">}</span><span style="color:#98C379">deg) rotate(</span><span style="color:#C678DD">\${</span><span style="color:#D19A66">20</span><span style="color:#56B6C2"> *</span><span style="color:#E06C75"> dir</span><span style="color:#C678DD">}</span><span style="color:#98C379">deg)\`</span><span style="color:#ABB2BF">,</span></span>
<span class="line"><span style="color:#98C379">            \`skew(</span><span style="color:#C678DD">\${</span><span style="color:#D19A66">15</span><span style="color:#56B6C2"> *</span><span style="color:#E06C75"> dir</span><span style="color:#C678DD">}</span><span style="color:#98C379">deg)\`</span><span style="color:#ABB2BF">,</span></span>
<span class="line"><span style="color:#ABB2BF">          ],</span></span>
<span class="line"><span style="color:#ABB2BF">        },</span></span>
<span class="line"><span style="color:#ABB2BF">        {</span></span>
<span class="line"><span style="color:#E06C75">          duration</span><span style="color:#ABB2BF">: </span><span style="color:#D19A66">1</span><span style="color:#ABB2BF">,</span></span>
<span class="line"><span style="color:#E06C75">          easing</span><span style="color:#ABB2BF">: </span><span style="color:#98C379">'ease-in-out'</span><span style="color:#ABB2BF">,</span></span>
<span class="line"><span style="color:#ABB2BF">        },</span></span>
<span class="line"><span style="color:#ABB2BF">      );</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic">      // schedule next flip</span></span>
<span class="line"><span style="color:#E5C07B">      currentAnim</span><span style="color:#ABB2BF">.</span><span style="color:#E5C07B">finished</span><span style="color:#ABB2BF">.</span><span style="color:#61AFEF">then</span><span style="color:#ABB2BF">(() </span><span style="color:#C678DD">=></span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#E06C75">        currentTimeout</span><span style="color:#56B6C2"> =</span><span style="color:#61AFEF"> setTimeout</span><span style="color:#ABB2BF">(() </span><span style="color:#C678DD">=></span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#61AFEF">          nextFlip</span><span style="color:#ABB2BF">();</span></span>
<span class="line"><span style="color:#ABB2BF">        }, </span><span style="color:#D19A66">1000</span><span style="color:#ABB2BF">);</span></span>
<span class="line"><span style="color:#ABB2BF">      });</span></span>
<span class="line"><span style="color:#ABB2BF">    });</span></span>
<span class="line"><span style="color:#ABB2BF">  }</span></span>
<span class="line"><span style="color:#ABB2BF">&#x3C;/</span><span style="color:#E06C75">script</span><span style="color:#ABB2BF">></span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF">&#x3C;</span><span style="color:#E06C75">div</span><span style="color:#C678DD"> bind</span><span style="color:#ABB2BF">:</span><span style="color:#E5C07B">this</span><span style="color:#ABB2BF">=</span><span style="color:#C678DD">{</span><span style="color:#E06C75">leftParent</span><span style="color:#C678DD">}</span><span style="color:#D19A66"> class</span><span style="color:#ABB2BF">=</span><span style="color:#98C379">"parent left"</span><span style="color:#ABB2BF">></span></span>
<span class="line"><span style="color:#ABB2BF">  &#x3C;</span><span style="color:#E06C75">div</span><span style="color:#C678DD"> bind</span><span style="color:#ABB2BF">:</span><span style="color:#E5C07B">this</span><span style="color:#ABB2BF">=</span><span style="color:#C678DD">{</span><span style="color:#E06C75">leftChildTarget</span><span style="color:#C678DD">}</span><span style="color:#D19A66"> class</span><span style="color:#ABB2BF">=</span><span style="color:#98C379">"demo-target child-target"</span><span style="color:#ABB2BF"> /></span></span>
<span class="line"><span style="color:#ABB2BF">&#x3C;/</span><span style="color:#E06C75">div</span><span style="color:#ABB2BF">></span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF">&#x3C;</span><span style="color:#E06C75">div</span><span style="color:#C678DD"> bind</span><span style="color:#ABB2BF">:</span><span style="color:#E5C07B">this</span><span style="color:#ABB2BF">=</span><span style="color:#C678DD">{</span><span style="color:#E06C75">rightParent</span><span style="color:#C678DD">}</span><span style="color:#D19A66"> class</span><span style="color:#ABB2BF">=</span><span style="color:#98C379">"parent right"</span><span style="color:#ABB2BF">></span></span>
<span class="line"><span style="color:#ABB2BF">  &#x3C;</span><span style="color:#E06C75">div</span><span style="color:#C678DD"> bind</span><span style="color:#ABB2BF">:</span><span style="color:#E5C07B">this</span><span style="color:#ABB2BF">=</span><span style="color:#C678DD">{</span><span style="color:#E06C75">rightChildTarget</span><span style="color:#C678DD">}</span><span style="color:#D19A66"> class</span><span style="color:#ABB2BF">=</span><span style="color:#98C379">"demo-target child-target"</span><span style="color:#ABB2BF"> /></span></span>
<span class="line"><span style="color:#ABB2BF">&#x3C;/</span><span style="color:#E06C75">div</span><span style="color:#ABB2BF">></span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF">&#x3C;</span><span style="color:#E06C75">div</span><span style="color:#C678DD"> bind</span><span style="color:#ABB2BF">:</span><span style="color:#E5C07B">this</span><span style="color:#ABB2BF">=</span><span style="color:#C678DD">{</span><span style="color:#E06C75">startingTarget</span><span style="color:#C678DD">}</span><span style="color:#D19A66"> class</span><span style="color:#ABB2BF">=</span><span style="color:#98C379">"demo-target"</span><span style="color:#ABB2BF"> /></span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF">&#x3C;</span><span style="color:#E06C75">style</span><span style="color:#D19A66"> lang</span><span style="color:#ABB2BF">=</span><span style="color:#98C379">"scss"</span><span style="color:#ABB2BF">></span></span>
<span class="line"><span style="color:#E06C75">  button</span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#ABB2BF">    all: </span><span style="color:#D19A66">unset</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">  }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D19A66">  .demo-subject</span><span style="color:#56B6C2">:focus-visible</span><span style="color:#ABB2BF">,</span></span>
<span class="line"><span style="color:#D19A66">  .parent</span><span style="color:#56B6C2">:focus-visible</span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#ABB2BF">    outline: </span><span style="color:#D19A66">solid</span><span style="color:#D19A66"> 2</span><span style="color:#E06C75">px</span><span style="color:#D19A66"> white</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">    outline-offset: </span><span style="color:#D19A66">4</span><span style="color:#E06C75">px</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">  }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D19A66">  .demo-target</span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#ABB2BF">    position: </span><span style="color:#D19A66">absolute</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">    width: </span><span style="color:#D19A66">70</span><span style="color:#E06C75">px</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">    height: </span><span style="color:#D19A66">70</span><span style="color:#E06C75">px</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">    border: </span><span style="color:#D19A66">solid</span><span style="color:#D19A66"> 3</span><span style="color:#E06C75">px</span><span style="color:#ABB2BF"> limegreen;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF">    opacity: </span><span style="color:#D19A66">0</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">  }</span></span>
<span class="line"><span style="color:#D19A66">  .child-target</span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#ABB2BF">    position: </span><span style="color:#D19A66">default</span><span style="color:#ABB2BF">;</span></span>
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
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF">    width: </span><span style="color:#D19A66">150</span><span style="color:#E06C75">px</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">    height: </span><span style="color:#D19A66">150</span><span style="color:#E06C75">px</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">    border: </span><span style="color:#D19A66">dashed</span><span style="color:#D19A66"> 3</span><span style="color:#E06C75">px</span><span style="color:#ABB2BF"> darkmagenta;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D19A66">    .child</span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#ABB2BF">      width: </span><span style="color:#D19A66">75</span><span style="color:#E06C75">px</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">      height: </span><span style="color:#D19A66">75</span><span style="color:#E06C75">px</span><span style="color:#ABB2BF">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF">      top: </span><span style="color:#D19A66">0</span><span style="color:#E06C75">px</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">      left: </span><span style="color:#D19A66">0</span><span style="color:#E06C75">px</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">    }</span></span>
<span class="line"><span style="color:#ABB2BF">  }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D19A66">  .left</span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#ABB2BF">    left: </span><span style="color:#D19A66">100</span><span style="color:#E06C75">px</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">    transform: </span><span style="color:#56B6C2">skew</span><span style="color:#ABB2BF">(</span><span style="color:#D19A66">15</span><span style="color:#E06C75">deg</span><span style="color:#ABB2BF">);</span></span>
<span class="line"><span style="color:#ABB2BF">  }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D19A66">  .right</span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#ABB2BF">    left: </span><span style="color:#D19A66">440</span><span style="color:#E06C75">px</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">    transform: </span><span style="color:#56B6C2">skew</span><span style="color:#ABB2BF">(</span><span style="color:#D19A66">-15</span><span style="color:#E06C75">deg</span><span style="color:#ABB2BF">);</span></span>
<span class="line"><span style="color:#ABB2BF">  }</span></span>
<span class="line"><span style="color:#ABB2BF">&#x3C;/</span><span style="color:#E06C75">style</span><span style="color:#ABB2BF">></span></span>
<span class="line"></span></code></pre>
`;
