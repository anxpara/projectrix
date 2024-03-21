export const DivGolfUsage = `<pre class="shiki one-dark-pro" style="background-color:#282c34;color:#abb2bf" tabindex="0"><code><span class="line"><span style="color:#C678DD">let</span><span style="color:#E06C75"> currentTarget</span><span style="color:#ABB2BF">: </span><span style="color:#E5C07B">HTMLElement</span><span style="color:#ABB2BF">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic">// each modifier contains a unique green target. match the next target to</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic">// the current target and update their opacities to create the illusion of</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic">// a single green target being passed between the modifiers</span></span>
<span class="line"><span style="color:#C678DD">function</span><span style="color:#61AFEF"> moveCurrentTargetToModifier</span><span style="color:#ABB2BF">(</span><span style="color:#E06C75;font-style:italic">modifier</span><span style="color:#ABB2BF">: </span><span style="color:#E5C07B">HTMLElement</span><span style="color:#ABB2BF">): </span><span style="color:#E5C07B">void</span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#C678DD">  const</span><span style="color:#E5C07B"> nextTarget</span><span style="color:#56B6C2"> =</span><span style="color:#E5C07B"> modifier</span><span style="color:#ABB2BF">.</span><span style="color:#E06C75">firstElementChild</span><span style="color:#C678DD"> as</span><span style="color:#E5C07B"> HTMLElement</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#C678DD">  if</span><span style="color:#ABB2BF"> (</span><span style="color:#E5C07B">currentTarget</span><span style="color:#ABB2BF">.</span><span style="color:#61AFEF">isSameNode</span><span style="color:#ABB2BF">(</span><span style="color:#E06C75">nextTarget</span><span style="color:#ABB2BF">)) </span><span style="color:#C678DD">return</span><span style="color:#ABB2BF">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic">  // Anime.js v3 takes matrix3d</span></span>
<span class="line"><span style="color:#C678DD">  const</span><span style="color:#ABB2BF"> { </span><span style="color:#E5C07B">toSubject</span><span style="color:#ABB2BF"> } </span><span style="color:#56B6C2">=</span><span style="color:#61AFEF"> getProjection</span><span style="color:#ABB2BF">(</span><span style="color:#E06C75">currentTarget</span><span style="color:#ABB2BF">, </span><span style="color:#E06C75">nextTarget</span><span style="color:#ABB2BF">, {</span></span>
<span class="line"><span style="color:#E06C75">    transformType</span><span style="color:#ABB2BF">: </span><span style="color:#98C379">'matrix3d'</span><span style="color:#ABB2BF">,</span></span>
<span class="line"><span style="color:#ABB2BF">  });</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic">  // match next target to current target's projection</span></span>
<span class="line"><span style="color:#E5C07B">  anime</span><span style="color:#ABB2BF">.</span><span style="color:#61AFEF">set</span><span style="color:#ABB2BF">(</span><span style="color:#E06C75">nextTarget</span><span style="color:#ABB2BF">, {</span></span>
<span class="line"><span style="color:#ABB2BF">    ...</span><span style="color:#E06C75">toSubject</span><span style="color:#ABB2BF">,</span></span>
<span class="line"><span style="color:#ABB2BF">  });</span></span>
<span class="line"></span>
<span class="line"><span style="color:#61AFEF">  setCurrentTarget</span><span style="color:#ABB2BF">(</span><span style="color:#E06C75">nextTarget</span><span style="color:#ABB2BF">);</span></span>
<span class="line"><span style="color:#ABB2BF">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD">function</span><span style="color:#61AFEF"> setCurrentTarget</span><span style="color:#ABB2BF">(</span><span style="color:#E06C75;font-style:italic">target</span><span style="color:#ABB2BF">: </span><span style="color:#E5C07B">HTMLElement</span><span style="color:#ABB2BF">): </span><span style="color:#E5C07B">void</span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#E5C07B">  currentTarget</span><span style="color:#ABB2BF">.</span><span style="color:#E5C07B">style</span><span style="color:#ABB2BF">.</span><span style="color:#E06C75">opacity</span><span style="color:#56B6C2"> =</span><span style="color:#98C379"> '0'</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#E5C07B">  target</span><span style="color:#ABB2BF">.</span><span style="color:#E5C07B">style</span><span style="color:#ABB2BF">.</span><span style="color:#E06C75">opacity</span><span style="color:#56B6C2"> =</span><span style="color:#98C379"> '1'</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#E06C75">  currentTarget</span><span style="color:#56B6C2"> =</span><span style="color:#E06C75"> target</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">}</span></span></code></pre>`;

export const DivGolfCode = `<pre class="shiki one-dark-pro" style="background-color:#282c34;color:#abb2bf" tabindex="0"><code><span class="line"><span style="color:#ABB2BF">&#x3C;</span><span style="color:#E06C75">script</span><span style="color:#D19A66"> lang</span><span style="color:#ABB2BF">=</span><span style="color:#98C379">"ts"</span><span style="color:#ABB2BF">></span></span>
<span class="line"><span style="color:#C678DD">  import</span><span style="color:#ABB2BF"> { </span><span style="color:#E06C75">onMount</span><span style="color:#ABB2BF">, </span><span style="color:#E06C75">tick</span><span style="color:#ABB2BF"> } </span><span style="color:#C678DD">from</span><span style="color:#98C379"> 'svelte'</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#C678DD">  import</span><span style="color:#ABB2BF"> { </span><span style="color:#E06C75">mat4</span><span style="color:#ABB2BF">, </span><span style="color:#E06C75">quat</span><span style="color:#ABB2BF">, </span><span style="color:#E06C75">vec3</span><span style="color:#ABB2BF"> } </span><span style="color:#C678DD">from</span><span style="color:#98C379"> 'gl-matrix'</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#C678DD">  import</span><span style="color:#ABB2BF"> { </span><span style="color:#E06C75">getActualClientRect</span><span style="color:#ABB2BF"> } </span><span style="color:#C678DD">from</span><span style="color:#98C379"> 'actual-client-rect'</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#C678DD">  import</span><span style="color:#ABB2BF"> { </span><span style="color:#E06C75">getProjection</span><span style="color:#ABB2BF"> } </span><span style="color:#C678DD">from</span><span style="color:#98C379"> 'projectrix'</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#C678DD">  import</span><span style="color:#E06C75"> anime</span><span style="color:#C678DD"> from</span><span style="color:#98C379"> 'animejs'</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#C678DD">  import</span><span style="color:#C678DD"> type</span><span style="color:#ABB2BF"> { </span><span style="color:#E06C75">Writable</span><span style="color:#ABB2BF"> } </span><span style="color:#C678DD">from</span><span style="color:#98C379"> 'svelte/store'</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#C678DD">  import</span><span style="color:#C678DD"> type</span><span style="color:#ABB2BF"> { </span><span style="color:#E06C75">Options</span><span style="color:#ABB2BF"> } </span><span style="color:#C678DD">from</span><span style="color:#98C379"> '$lib/options'</span><span style="color:#ABB2BF">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD">  export</span><span style="color:#C678DD"> let</span><span style="color:#E06C75"> options</span><span style="color:#ABB2BF">: </span><span style="color:#E5C07B">Writable</span><span style="color:#ABB2BF">&#x3C;</span><span style="color:#E5C07B">Options</span><span style="color:#ABB2BF">>;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD">  let</span><span style="color:#E06C75"> startingTarget</span><span style="color:#ABB2BF">: </span><span style="color:#E5C07B">HTMLElement</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#C678DD">  let</span><span style="color:#E06C75"> currentTarget</span><span style="color:#ABB2BF">: </span><span style="color:#E5C07B">HTMLElement</span><span style="color:#ABB2BF"> | </span><span style="color:#E5C07B">undefined</span><span style="color:#ABB2BF">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD">  let</span><span style="color:#E06C75"> spinnerModifier</span><span style="color:#ABB2BF">: </span><span style="color:#E5C07B">HTMLElement</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#C678DD">  let</span><span style="color:#E06C75"> slider1Modifier</span><span style="color:#ABB2BF">: </span><span style="color:#E5C07B">HTMLElement</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#C678DD">  let</span><span style="color:#E06C75"> slider2Modifier</span><span style="color:#ABB2BF">: </span><span style="color:#E5C07B">HTMLElement</span><span style="color:#ABB2BF">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD">  let</span><span style="color:#E06C75"> goals</span><span style="color:#ABB2BF">: </span><span style="color:#E5C07B">HTMLElement</span><span style="color:#ABB2BF">[] </span><span style="color:#56B6C2">=</span><span style="color:#ABB2BF"> [];</span></span>
<span class="line"><span style="color:#C678DD">  let</span><span style="color:#E06C75"> winnerTarget</span><span style="color:#ABB2BF">: </span><span style="color:#E5C07B">HTMLElement</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#C678DD">  let</span><span style="color:#E06C75"> winAnim</span><span style="color:#ABB2BF">: </span><span style="color:#E5C07B">anime</span><span style="color:#ABB2BF">.</span><span style="color:#E5C07B">AnimeInstance</span><span style="color:#ABB2BF"> | </span><span style="color:#E5C07B">undefined</span><span style="color:#ABB2BF">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD">  let</span><span style="color:#E06C75"> pulseContainer</span><span style="color:#ABB2BF">: </span><span style="color:#E5C07B">HTMLElement</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#C678DD">  let</span><span style="color:#E06C75"> pulseTemplate</span><span style="color:#ABB2BF">: </span><span style="color:#E5C07B">HTMLElement</span><span style="color:#ABB2BF">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#61AFEF">  onMount</span><span style="color:#ABB2BF">(</span><span style="color:#C678DD">async</span><span style="color:#ABB2BF"> () </span><span style="color:#C678DD">=></span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#C678DD">    await</span><span style="color:#61AFEF"> tick</span><span style="color:#ABB2BF">();</span></span>
<span class="line"><span style="color:#61AFEF">    restart</span><span style="color:#ABB2BF">();</span></span>
<span class="line"><span style="color:#ABB2BF">  });</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD">  function</span><span style="color:#61AFEF"> restart</span><span style="color:#ABB2BF">(): </span><span style="color:#E5C07B">void</span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#61AFEF">    setCurrentTarget</span><span style="color:#ABB2BF">(</span><span style="color:#E06C75">startingTarget</span><span style="color:#ABB2BF">);</span></span>
<span class="line"><span style="color:#61AFEF">    startModifiers</span><span style="color:#ABB2BF">();</span></span>
<span class="line"><span style="color:#ABB2BF">  }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD">  function</span><span style="color:#61AFEF"> setCurrentTarget</span><span style="color:#ABB2BF">(</span><span style="color:#E06C75;font-style:italic">target</span><span style="color:#ABB2BF">: </span><span style="color:#E5C07B">HTMLElement</span><span style="color:#ABB2BF">): </span><span style="color:#E5C07B">void</span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#C678DD">    if</span><span style="color:#ABB2BF"> (</span><span style="color:#E06C75">currentTarget</span><span style="color:#ABB2BF">) {</span></span>
<span class="line"><span style="color:#E5C07B">      currentTarget</span><span style="color:#ABB2BF">.</span><span style="color:#E5C07B">style</span><span style="color:#ABB2BF">.</span><span style="color:#E06C75">opacity</span><span style="color:#56B6C2"> =</span><span style="color:#98C379"> '0'</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">    }</span></span>
<span class="line"><span style="color:#E5C07B">    target</span><span style="color:#ABB2BF">.</span><span style="color:#E5C07B">style</span><span style="color:#ABB2BF">.</span><span style="color:#E06C75">opacity</span><span style="color:#56B6C2"> =</span><span style="color:#98C379"> '1'</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#E06C75">    currentTarget</span><span style="color:#56B6C2"> =</span><span style="color:#E06C75"> target</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">  }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD">  function</span><span style="color:#61AFEF"> startModifiers</span><span style="color:#ABB2BF">(): </span><span style="color:#E5C07B">void</span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#E5C07B">    anime</span><span style="color:#ABB2BF">.</span><span style="color:#61AFEF">set</span><span style="color:#ABB2BF">(</span><span style="color:#E06C75">spinnerModifier</span><span style="color:#ABB2BF">, {</span></span>
<span class="line"><span style="color:#E06C75">      rotate</span><span style="color:#ABB2BF">: </span><span style="color:#98C379">'0deg'</span><span style="color:#ABB2BF">,</span></span>
<span class="line"><span style="color:#ABB2BF">    });</span></span>
<span class="line"><span style="color:#61AFEF">    anime</span><span style="color:#ABB2BF">({</span></span>
<span class="line"><span style="color:#E06C75">      targets</span><span style="color:#ABB2BF">: </span><span style="color:#E06C75">spinnerModifier</span><span style="color:#ABB2BF">,</span></span>
<span class="line"><span style="color:#E06C75">      duration</span><span style="color:#ABB2BF">: </span><span style="color:#D19A66">3000</span><span style="color:#ABB2BF">,</span></span>
<span class="line"><span style="color:#E06C75">      easing</span><span style="color:#ABB2BF">: </span><span style="color:#98C379">'linear'</span><span style="color:#ABB2BF">,</span></span>
<span class="line"><span style="color:#E06C75">      loop</span><span style="color:#ABB2BF">: </span><span style="color:#D19A66">true</span><span style="color:#ABB2BF">,</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75">      rotate</span><span style="color:#ABB2BF">: </span><span style="color:#98C379">'-360deg'</span><span style="color:#ABB2BF">,</span></span>
<span class="line"><span style="color:#ABB2BF">    });</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E5C07B">    anime</span><span style="color:#ABB2BF">.</span><span style="color:#61AFEF">set</span><span style="color:#ABB2BF">(</span><span style="color:#E06C75">slider1Modifier</span><span style="color:#ABB2BF">, {</span></span>
<span class="line"><span style="color:#E06C75">      rotate</span><span style="color:#ABB2BF">: </span><span style="color:#98C379">'-45deg'</span><span style="color:#ABB2BF">,</span></span>
<span class="line"><span style="color:#E06C75">      translateX</span><span style="color:#ABB2BF">: </span><span style="color:#98C379">'0px'</span><span style="color:#ABB2BF">,</span></span>
<span class="line"><span style="color:#ABB2BF">    });</span></span>
<span class="line"><span style="color:#E5C07B">    anime</span><span style="color:#ABB2BF">.</span><span style="color:#61AFEF">set</span><span style="color:#ABB2BF">(</span><span style="color:#E06C75">slider2Modifier</span><span style="color:#ABB2BF">, {</span></span>
<span class="line"><span style="color:#E06C75">      rotate</span><span style="color:#ABB2BF">: </span><span style="color:#98C379">'225deg'</span><span style="color:#ABB2BF">,</span></span>
<span class="line"><span style="color:#E06C75">      translateX</span><span style="color:#ABB2BF">: </span><span style="color:#98C379">'0px'</span><span style="color:#ABB2BF">,</span></span>
<span class="line"><span style="color:#ABB2BF">    });</span></span>
<span class="line"><span style="color:#C678DD">    const</span><span style="color:#E5C07B"> sliderAnimParams</span><span style="color:#56B6C2"> =</span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#E06C75">      easing</span><span style="color:#ABB2BF">: </span><span style="color:#98C379">'linear'</span><span style="color:#ABB2BF">,</span></span>
<span class="line"><span style="color:#E06C75">      loop</span><span style="color:#ABB2BF">: </span><span style="color:#D19A66">true</span><span style="color:#ABB2BF">,</span></span>
<span class="line"><span style="color:#E06C75">      direction</span><span style="color:#ABB2BF">: </span><span style="color:#98C379">'alternate'</span><span style="color:#ABB2BF">,</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75">      translateX</span><span style="color:#ABB2BF">: </span><span style="color:#98C379">'170px'</span><span style="color:#ABB2BF">,</span></span>
<span class="line"><span style="color:#ABB2BF">    };</span></span>
<span class="line"><span style="color:#61AFEF">    anime</span><span style="color:#ABB2BF">({</span></span>
<span class="line"><span style="color:#E06C75">      targets</span><span style="color:#ABB2BF">: </span><span style="color:#E06C75">slider1Modifier</span><span style="color:#ABB2BF">,</span></span>
<span class="line"><span style="color:#E06C75">      duration</span><span style="color:#ABB2BF">: </span><span style="color:#D19A66">1400</span><span style="color:#ABB2BF">,</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF">      ...</span><span style="color:#E06C75">sliderAnimParams</span><span style="color:#ABB2BF">,</span></span>
<span class="line"><span style="color:#ABB2BF">    });</span></span>
<span class="line"><span style="color:#61AFEF">    anime</span><span style="color:#ABB2BF">({</span></span>
<span class="line"><span style="color:#E06C75">      targets</span><span style="color:#ABB2BF">: </span><span style="color:#E06C75">slider2Modifier</span><span style="color:#ABB2BF">,</span></span>
<span class="line"><span style="color:#E06C75">      duration</span><span style="color:#ABB2BF">: </span><span style="color:#D19A66">700</span><span style="color:#ABB2BF">,</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF">      ...</span><span style="color:#E06C75">sliderAnimParams</span><span style="color:#ABB2BF">,</span></span>
<span class="line"><span style="color:#ABB2BF">    });</span></span>
<span class="line"><span style="color:#ABB2BF">  }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD">  function</span><span style="color:#61AFEF"> moveCurrentTargetToModifier</span><span style="color:#ABB2BF">(</span><span style="color:#E06C75;font-style:italic">modifier</span><span style="color:#ABB2BF">: </span><span style="color:#E5C07B">HTMLElement</span><span style="color:#ABB2BF">): </span><span style="color:#E5C07B">void</span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#C678DD">    if</span><span style="color:#ABB2BF"> (</span><span style="color:#E06C75">winAnim</span><span style="color:#ABB2BF">) </span><span style="color:#C678DD">return</span><span style="color:#ABB2BF">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD">    const</span><span style="color:#E5C07B"> nextTarget</span><span style="color:#56B6C2"> =</span><span style="color:#E5C07B"> modifier</span><span style="color:#ABB2BF">.</span><span style="color:#E06C75">firstElementChild</span><span style="color:#C678DD"> as</span><span style="color:#E5C07B"> HTMLElement</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#C678DD">    if</span><span style="color:#ABB2BF"> (</span><span style="color:#56B6C2">!</span><span style="color:#E06C75">currentTarget</span><span style="color:#ABB2BF">) </span><span style="color:#C678DD">return</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#C678DD">    if</span><span style="color:#ABB2BF"> (</span><span style="color:#E5C07B">currentTarget</span><span style="color:#ABB2BF">.</span><span style="color:#61AFEF">isSameNode</span><span style="color:#ABB2BF">(</span><span style="color:#E06C75">nextTarget</span><span style="color:#ABB2BF">)) {</span></span>
<span class="line"><span style="color:#61AFEF">      animateClonedpulse</span><span style="color:#ABB2BF">(</span><span style="color:#E06C75">currentTarget</span><span style="color:#ABB2BF">);</span></span>
<span class="line"><span style="color:#E5C07B">      goals</span><span style="color:#ABB2BF">.</span><span style="color:#61AFEF">forEach</span><span style="color:#ABB2BF">((</span><span style="color:#E06C75;font-style:italic">goal</span><span style="color:#ABB2BF">) </span><span style="color:#C678DD">=></span><span style="color:#61AFEF"> checkWin</span><span style="color:#ABB2BF">(</span><span style="color:#E06C75">goal</span><span style="color:#ABB2BF">, </span><span style="color:#D19A66">false</span><span style="color:#ABB2BF">));</span></span>
<span class="line"><span style="color:#C678DD">      return</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic">    // Anime.js v3 takes matrix3d</span></span>
<span class="line"><span style="color:#C678DD">    const</span><span style="color:#E5C07B"> projectionResults</span><span style="color:#56B6C2"> =</span><span style="color:#61AFEF"> getProjection</span><span style="color:#ABB2BF">(</span><span style="color:#E06C75">currentTarget</span><span style="color:#ABB2BF">, </span><span style="color:#E06C75">nextTarget</span><span style="color:#ABB2BF">, {</span></span>
<span class="line"><span style="color:#E06C75">      transformType</span><span style="color:#ABB2BF">: </span><span style="color:#98C379">'matrix3d'</span><span style="color:#ABB2BF">,</span></span>
<span class="line"><span style="color:#ABB2BF">    });</span></span>
<span class="line"><span style="color:#C678DD">    const</span><span style="color:#ABB2BF"> { </span><span style="color:#E5C07B">toSubject</span><span style="color:#ABB2BF"> } </span><span style="color:#56B6C2">=</span><span style="color:#E06C75"> projectionResults</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#C678DD">    if</span><span style="color:#ABB2BF"> ($</span><span style="color:#E5C07B">options</span><span style="color:#ABB2BF">.</span><span style="color:#E06C75">log</span><span style="color:#ABB2BF">) {</span></span>
<span class="line"><span style="color:#E5C07B">      console</span><span style="color:#ABB2BF">.</span><span style="color:#61AFEF">log</span><span style="color:#ABB2BF">(</span><span style="color:#E06C75">projectionResults</span><span style="color:#ABB2BF">);</span></span>
<span class="line"><span style="color:#ABB2BF">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic">    // match next target to current target's projection</span></span>
<span class="line"><span style="color:#E5C07B">    anime</span><span style="color:#ABB2BF">.</span><span style="color:#61AFEF">set</span><span style="color:#ABB2BF">(</span><span style="color:#E06C75">nextTarget</span><span style="color:#ABB2BF">, {</span></span>
<span class="line"><span style="color:#ABB2BF">      ...</span><span style="color:#E06C75">toSubject</span><span style="color:#ABB2BF">,</span></span>
<span class="line"><span style="color:#ABB2BF">    });</span></span>
<span class="line"></span>
<span class="line"><span style="color:#61AFEF">    setCurrentTarget</span><span style="color:#ABB2BF">(</span><span style="color:#E06C75">nextTarget</span><span style="color:#ABB2BF">);</span></span>
<span class="line"><span style="color:#61AFEF">    animateClonedpulse</span><span style="color:#ABB2BF">(</span><span style="color:#E06C75">nextTarget</span><span style="color:#ABB2BF">);</span></span>
<span class="line"><span style="color:#ABB2BF">  }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD">  const</span><span style="color:#E5C07B"> distanceTolerancePx</span><span style="color:#56B6C2"> =</span><span style="color:#D19A66"> 10</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#C678DD">  const</span><span style="color:#E5C07B"> rotationToleranceDeg</span><span style="color:#56B6C2"> =</span><span style="color:#D19A66"> 8</span><span style="color:#ABB2BF">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD">  function</span><span style="color:#61AFEF"> checkWin</span><span style="color:#ABB2BF">(</span><span style="color:#E06C75;font-style:italic">goal</span><span style="color:#ABB2BF">: </span><span style="color:#E5C07B">HTMLElement</span><span style="color:#ABB2BF">, </span><span style="color:#E06C75;font-style:italic">goalClicked</span><span style="color:#56B6C2"> =</span><span style="color:#D19A66"> true</span><span style="color:#ABB2BF">): </span><span style="color:#E5C07B">void</span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#C678DD">    const</span><span style="color:#E5C07B"> win</span><span style="color:#56B6C2"> =</span><span style="color:#61AFEF"> checkIfTolerancesWin</span><span style="color:#ABB2BF">(</span><span style="color:#E06C75">goal</span><span style="color:#ABB2BF">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD">    if</span><span style="color:#ABB2BF"> (</span><span style="color:#E06C75">win</span><span style="color:#ABB2BF">) {</span></span>
<span class="line"><span style="color:#61AFEF">      animateWin</span><span style="color:#ABB2BF">(</span><span style="color:#E06C75">goal</span><span style="color:#ABB2BF">);</span></span>
<span class="line"><span style="color:#C678DD">      return</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD">    if</span><span style="color:#ABB2BF"> (</span><span style="color:#E06C75">goalClicked</span><span style="color:#ABB2BF">) {</span></span>
<span class="line"><span style="color:#61AFEF">      animateMiss</span><span style="color:#ABB2BF">(</span><span style="color:#E06C75">goal</span><span style="color:#ABB2BF">);</span></span>
<span class="line"><span style="color:#ABB2BF">    }</span></span>
<span class="line"><span style="color:#ABB2BF">  }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD">  function</span><span style="color:#61AFEF"> checkIfTolerancesWin</span><span style="color:#ABB2BF">(</span><span style="color:#E06C75;font-style:italic">goal</span><span style="color:#ABB2BF">: </span><span style="color:#E5C07B">HTMLElement</span><span style="color:#ABB2BF">): </span><span style="color:#E5C07B">boolean</span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#C678DD">    const</span><span style="color:#E5C07B"> goalAcr</span><span style="color:#56B6C2"> =</span><span style="color:#61AFEF"> getActualClientRect</span><span style="color:#ABB2BF">(</span><span style="color:#E06C75">goal</span><span style="color:#ABB2BF">, {</span></span>
<span class="line"><span style="color:#E06C75">      bakePositionIntoTransform</span><span style="color:#ABB2BF">: </span><span style="color:#D19A66">true</span><span style="color:#ABB2BF">,</span></span>
<span class="line"><span style="color:#ABB2BF">    });</span></span>
<span class="line"><span style="color:#C678DD">    const</span><span style="color:#E5C07B"> currentAcr</span><span style="color:#56B6C2"> =</span><span style="color:#61AFEF"> getActualClientRect</span><span style="color:#ABB2BF">(</span><span style="color:#E06C75">currentTarget</span><span style="color:#56B6C2">!</span><span style="color:#ABB2BF">, {</span></span>
<span class="line"><span style="color:#E06C75">      bakePositionIntoTransform</span><span style="color:#ABB2BF">: </span><span style="color:#D19A66">true</span><span style="color:#ABB2BF">,</span></span>
<span class="line"><span style="color:#ABB2BF">    });</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD">    const</span><span style="color:#E5C07B"> Mvc</span><span style="color:#56B6C2"> =</span><span style="color:#E5C07B"> currentAcr</span><span style="color:#ABB2BF">.</span><span style="color:#E06C75">transformMat4</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#C678DD">    const</span><span style="color:#E5C07B"> Mcv</span><span style="color:#56B6C2"> =</span><span style="color:#E5C07B"> mat4</span><span style="color:#ABB2BF">.</span><span style="color:#61AFEF">create</span><span style="color:#ABB2BF">();</span></span>
<span class="line"><span style="color:#E5C07B">    mat4</span><span style="color:#ABB2BF">.</span><span style="color:#61AFEF">invert</span><span style="color:#ABB2BF">(</span><span style="color:#E06C75">Mcv</span><span style="color:#ABB2BF">, </span><span style="color:#E06C75">Mvc</span><span style="color:#ABB2BF">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD">    const</span><span style="color:#E5C07B"> Mvg</span><span style="color:#56B6C2"> =</span><span style="color:#E5C07B"> goalAcr</span><span style="color:#ABB2BF">.</span><span style="color:#E06C75">transformMat4</span><span style="color:#ABB2BF">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD">    const</span><span style="color:#E5C07B"> Mcg</span><span style="color:#56B6C2"> =</span><span style="color:#E5C07B"> mat4</span><span style="color:#ABB2BF">.</span><span style="color:#61AFEF">create</span><span style="color:#ABB2BF">();</span></span>
<span class="line"><span style="color:#E5C07B">    mat4</span><span style="color:#ABB2BF">.</span><span style="color:#61AFEF">multiply</span><span style="color:#ABB2BF">(</span><span style="color:#E06C75">Mcg</span><span style="color:#ABB2BF">, </span><span style="color:#E06C75">Mcv</span><span style="color:#ABB2BF">, </span><span style="color:#E06C75">Mvg</span><span style="color:#ABB2BF">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic">    // check distance</span></span>
<span class="line"><span style="color:#C678DD">    const</span><span style="color:#E5C07B"> distancePx</span><span style="color:#56B6C2"> =</span><span style="color:#E5C07B"> Math</span><span style="color:#ABB2BF">.</span><span style="color:#61AFEF">sqrt</span><span style="color:#ABB2BF">(</span><span style="color:#E06C75">Mcg</span><span style="color:#ABB2BF">[</span><span style="color:#D19A66">12</span><span style="color:#ABB2BF">] </span><span style="color:#56B6C2">*</span><span style="color:#E06C75"> Mcg</span><span style="color:#ABB2BF">[</span><span style="color:#D19A66">12</span><span style="color:#ABB2BF">] </span><span style="color:#56B6C2">+</span><span style="color:#E06C75"> Mcg</span><span style="color:#ABB2BF">[</span><span style="color:#D19A66">13</span><span style="color:#ABB2BF">] </span><span style="color:#56B6C2">*</span><span style="color:#E06C75"> Mcg</span><span style="color:#ABB2BF">[</span><span style="color:#D19A66">13</span><span style="color:#ABB2BF">]);</span></span>
<span class="line"><span style="color:#C678DD">    if</span><span style="color:#ABB2BF"> (</span><span style="color:#E06C75">distancePx</span><span style="color:#56B6C2"> ></span><span style="color:#E06C75"> distanceTolerancePx</span><span style="color:#ABB2BF">) {</span></span>
<span class="line"><span style="color:#C678DD">      return</span><span style="color:#D19A66"> false</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD">    const</span><span style="color:#E5C07B"> rotationQuat</span><span style="color:#56B6C2"> =</span><span style="color:#E5C07B"> quat</span><span style="color:#ABB2BF">.</span><span style="color:#61AFEF">create</span><span style="color:#ABB2BF">();</span></span>
<span class="line"><span style="color:#E5C07B">    mat4</span><span style="color:#ABB2BF">.</span><span style="color:#61AFEF">getRotation</span><span style="color:#ABB2BF">(</span><span style="color:#E06C75">rotationQuat</span><span style="color:#ABB2BF">, </span><span style="color:#E06C75">Mcg</span><span style="color:#ABB2BF">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD">    const</span><span style="color:#E5C07B"> rotationVec3</span><span style="color:#56B6C2"> =</span><span style="color:#E5C07B"> vec3</span><span style="color:#ABB2BF">.</span><span style="color:#61AFEF">create</span><span style="color:#ABB2BF">();</span></span>
<span class="line"><span style="color:#C678DD">    const</span><span style="color:#E5C07B"> rotationDeg</span><span style="color:#56B6C2"> =</span></span>
<span class="line"><span style="color:#ABB2BF">      (</span><span style="color:#E5C07B">quat</span><span style="color:#ABB2BF">.</span><span style="color:#61AFEF">getAxisAngle</span><span style="color:#ABB2BF">(</span><span style="color:#E06C75">rotationVec3</span><span style="color:#ABB2BF">, </span><span style="color:#E06C75">rotationQuat</span><span style="color:#ABB2BF">) </span><span style="color:#56B6C2">*</span><span style="color:#D19A66"> 180</span><span style="color:#ABB2BF">) </span><span style="color:#56B6C2">/</span><span style="color:#E5C07B"> Math</span><span style="color:#ABB2BF">.</span><span style="color:#E06C75">PI</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#C678DD">    const</span><span style="color:#E5C07B"> rotationDiff</span><span style="color:#56B6C2"> =</span><span style="color:#D19A66"> 45</span><span style="color:#56B6C2"> -</span><span style="color:#E5C07B"> Math</span><span style="color:#ABB2BF">.</span><span style="color:#61AFEF">abs</span><span style="color:#ABB2BF">((</span><span style="color:#E06C75">rotationDeg</span><span style="color:#56B6C2"> %</span><span style="color:#D19A66"> 90</span><span style="color:#ABB2BF">) </span><span style="color:#56B6C2">-</span><span style="color:#D19A66"> 45</span><span style="color:#ABB2BF">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic">    // check rotation</span></span>
<span class="line"><span style="color:#C678DD">    if</span><span style="color:#ABB2BF"> (</span><span style="color:#E06C75">rotationDiff</span><span style="color:#56B6C2"> ></span><span style="color:#E06C75"> rotationToleranceDeg</span><span style="color:#ABB2BF">) {</span></span>
<span class="line"><span style="color:#C678DD">      return</span><span style="color:#D19A66"> false</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD">    return</span><span style="color:#D19A66"> true</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">  }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD">  function</span><span style="color:#61AFEF"> animateWin</span><span style="color:#ABB2BF">(</span><span style="color:#E06C75;font-style:italic">goal</span><span style="color:#ABB2BF">: </span><span style="color:#E5C07B">HTMLElement</span><span style="color:#ABB2BF">): </span><span style="color:#E5C07B">void</span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic">    // match winner target to current target</span></span>
<span class="line"><span style="color:#E5C07B">    anime</span><span style="color:#ABB2BF">.</span><span style="color:#61AFEF">set</span><span style="color:#ABB2BF">(</span><span style="color:#E06C75">winnerTarget</span><span style="color:#ABB2BF">, {</span></span>
<span class="line"><span style="color:#ABB2BF">      ...</span><span style="color:#61AFEF">getProjection</span><span style="color:#ABB2BF">(</span><span style="color:#E06C75">currentTarget</span><span style="color:#56B6C2">!</span><span style="color:#ABB2BF">, </span><span style="color:#E06C75">winnerTarget</span><span style="color:#ABB2BF">, {</span></span>
<span class="line"><span style="color:#E06C75">        transformType</span><span style="color:#ABB2BF">: </span><span style="color:#98C379">'matrix3d'</span><span style="color:#ABB2BF">,</span></span>
<span class="line"><span style="color:#ABB2BF">      }).</span><span style="color:#E06C75">toSubject</span><span style="color:#ABB2BF">,</span></span>
<span class="line"><span style="color:#ABB2BF">    });</span></span>
<span class="line"></span>
<span class="line"><span style="color:#61AFEF">    setCurrentTarget</span><span style="color:#ABB2BF">(</span><span style="color:#E06C75">winnerTarget</span><span style="color:#ABB2BF">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic">    // animate rest of way to goal</span></span>
<span class="line"><span style="color:#E06C75">    winAnim</span><span style="color:#56B6C2"> =</span><span style="color:#61AFEF"> anime</span><span style="color:#ABB2BF">({</span></span>
<span class="line"><span style="color:#E06C75">      targets</span><span style="color:#ABB2BF">: </span><span style="color:#E06C75">winnerTarget</span><span style="color:#ABB2BF">,</span></span>
<span class="line"><span style="color:#E06C75">      duration</span><span style="color:#ABB2BF">: </span><span style="color:#D19A66">300</span><span style="color:#ABB2BF">,</span></span>
<span class="line"><span style="color:#E06C75">      easing</span><span style="color:#ABB2BF">: </span><span style="color:#98C379">'easeOutQuad'</span><span style="color:#ABB2BF">,</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF">      ...</span><span style="color:#61AFEF">getProjection</span><span style="color:#ABB2BF">(</span></span>
<span class="line"><span style="color:#E06C75">           goal</span><span style="color:#ABB2BF">,</span></span>
<span class="line"><span style="color:#E06C75">           winnerTarget</span><span style="color:#ABB2BF">,</span></span>
<span class="line"><span style="color:#ABB2BF">           { </span><span style="color:#E06C75">transformType</span><span style="color:#ABB2BF">: </span><span style="color:#98C379">'matrix3d'</span><span style="color:#ABB2BF"> }).</span><span style="color:#E06C75">toSubject</span><span style="color:#ABB2BF">,</span></span>
<span class="line"></span>
<span class="line"><span style="color:#61AFEF">      complete</span><span style="color:#ABB2BF">: () </span><span style="color:#C678DD">=></span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#61AFEF">        markGoalCompleted</span><span style="color:#ABB2BF">(</span><span style="color:#E06C75">goal</span><span style="color:#ABB2BF">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#61AFEF">        animateClonedpulse</span><span style="color:#ABB2BF">(</span><span style="color:#E06C75">winnerTarget</span><span style="color:#ABB2BF">);</span></span>
<span class="line"><span style="color:#61AFEF">        setTimeout</span><span style="color:#ABB2BF">(() </span><span style="color:#C678DD">=></span><span style="color:#61AFEF"> animateClonedpulse</span><span style="color:#ABB2BF">(</span><span style="color:#E06C75">winnerTarget</span><span style="color:#ABB2BF">), </span><span style="color:#D19A66">350</span><span style="color:#ABB2BF">);</span></span>
<span class="line"><span style="color:#61AFEF">        setTimeout</span><span style="color:#ABB2BF">(() </span><span style="color:#C678DD">=></span><span style="color:#61AFEF"> animateClonedpulse</span><span style="color:#ABB2BF">(</span><span style="color:#E06C75">winnerTarget</span><span style="color:#ABB2BF">), </span><span style="color:#D19A66">700</span><span style="color:#ABB2BF">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75">        winAnim</span><span style="color:#56B6C2"> =</span><span style="color:#D19A66"> undefined</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">      },</span></span>
<span class="line"><span style="color:#ABB2BF">    });</span></span>
<span class="line"><span style="color:#ABB2BF">  }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD">  function</span><span style="color:#61AFEF"> animateMiss</span><span style="color:#ABB2BF">(</span><span style="color:#E06C75;font-style:italic">goal</span><span style="color:#ABB2BF">: </span><span style="color:#E5C07B">HTMLElement</span><span style="color:#ABB2BF">): </span><span style="color:#E5C07B">void</span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#E5C07B">    anime</span><span style="color:#ABB2BF">.</span><span style="color:#61AFEF">set</span><span style="color:#ABB2BF">(</span><span style="color:#E06C75">goal</span><span style="color:#ABB2BF">, {</span></span>
<span class="line"><span style="color:#E06C75">      backgroundColor</span><span style="color:#ABB2BF">: </span><span style="color:#98C379">'rgba(255, 0, 0, 1)'</span><span style="color:#ABB2BF">,</span></span>
<span class="line"><span style="color:#ABB2BF">    });</span></span>
<span class="line"><span style="color:#61AFEF">    anime</span><span style="color:#ABB2BF">({</span></span>
<span class="line"><span style="color:#E06C75">      targets</span><span style="color:#ABB2BF">: </span><span style="color:#E06C75">goal</span><span style="color:#ABB2BF">,</span></span>
<span class="line"><span style="color:#E06C75">      duration</span><span style="color:#ABB2BF">: </span><span style="color:#D19A66">300</span><span style="color:#ABB2BF">,</span></span>
<span class="line"><span style="color:#E06C75">      easing</span><span style="color:#ABB2BF">: </span><span style="color:#98C379">'easeOutQuad'</span><span style="color:#ABB2BF">,</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75">      backgroundColor</span><span style="color:#ABB2BF">: </span><span style="color:#98C379">'rgba(255, 0, 0, 0)'</span><span style="color:#ABB2BF">,</span></span>
<span class="line"><span style="color:#ABB2BF">    });</span></span>
<span class="line"><span style="color:#ABB2BF">  }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD">  function</span><span style="color:#61AFEF"> markGoalCompleted</span><span style="color:#ABB2BF">(</span><span style="color:#E06C75;font-style:italic">goal</span><span style="color:#ABB2BF">: </span><span style="color:#E5C07B">HTMLElement</span><span style="color:#ABB2BF">): </span><span style="color:#E5C07B">void</span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#E5C07B">    anime</span><span style="color:#ABB2BF">.</span><span style="color:#61AFEF">set</span><span style="color:#ABB2BF">(</span><span style="color:#E06C75">goal</span><span style="color:#ABB2BF">, {</span></span>
<span class="line"><span style="color:#E06C75">      borderStyle</span><span style="color:#ABB2BF">: </span><span style="color:#98C379">'dotted'</span><span style="color:#ABB2BF">,</span></span>
<span class="line"><span style="color:#E06C75">      borderColor</span><span style="color:#ABB2BF">: </span><span style="color:#98C379">'#32cd32'</span><span style="color:#ABB2BF">,</span></span>
<span class="line"><span style="color:#ABB2BF">    });</span></span>
<span class="line"><span style="color:#ABB2BF">  }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD">  function</span><span style="color:#61AFEF"> animateClonedpulse</span><span style="color:#ABB2BF">(</span><span style="color:#E06C75;font-style:italic">subject</span><span style="color:#ABB2BF">: </span><span style="color:#E5C07B">HTMLElement</span><span style="color:#ABB2BF">): </span><span style="color:#E5C07B">void</span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#C678DD">    const</span><span style="color:#E5C07B"> pulseClone</span><span style="color:#56B6C2"> =</span><span style="color:#ABB2BF"> &#x3C;</span><span style="color:#E5C07B">HTMLElement</span><span style="color:#ABB2BF">></span><span style="color:#E5C07B">pulseTemplate</span><span style="color:#ABB2BF">.</span><span style="color:#61AFEF">cloneNode</span><span style="color:#ABB2BF">();</span></span>
<span class="line"><span style="color:#E5C07B">    pulseContainer</span><span style="color:#ABB2BF">.</span><span style="color:#61AFEF">append</span><span style="color:#ABB2BF">(</span><span style="color:#E06C75">pulseClone</span><span style="color:#ABB2BF">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD">    const</span><span style="color:#ABB2BF"> { </span><span style="color:#E5C07B">toSubject</span><span style="color:#ABB2BF"> } </span><span style="color:#56B6C2">=</span><span style="color:#61AFEF"> getProjection</span><span style="color:#ABB2BF">(</span><span style="color:#E06C75">subject</span><span style="color:#ABB2BF">, </span><span style="color:#E06C75">pulseClone</span><span style="color:#ABB2BF">, {</span></span>
<span class="line"><span style="color:#E06C75">      transformType</span><span style="color:#ABB2BF">: </span><span style="color:#98C379">'matrix3d'</span><span style="color:#ABB2BF">,</span></span>
<span class="line"><span style="color:#ABB2BF">    });</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E5C07B">    anime</span><span style="color:#ABB2BF">.</span><span style="color:#61AFEF">set</span><span style="color:#ABB2BF">(</span><span style="color:#E06C75">pulseClone</span><span style="color:#ABB2BF">, {</span></span>
<span class="line"><span style="color:#ABB2BF">      ...</span><span style="color:#E06C75">toSubject</span><span style="color:#ABB2BF">,</span></span>
<span class="line"><span style="color:#E06C75">      outlineOffset</span><span style="color:#ABB2BF">: </span><span style="color:#98C379">'0px'</span><span style="color:#ABB2BF">,</span></span>
<span class="line"><span style="color:#E06C75">      outlineColor</span><span style="color:#ABB2BF">: </span><span style="color:#98C379">'rgba(50, 205, 50, 1)'</span><span style="color:#ABB2BF">,</span></span>
<span class="line"><span style="color:#ABB2BF">    });</span></span>
<span class="line"><span style="color:#61AFEF">    anime</span><span style="color:#ABB2BF">({</span></span>
<span class="line"><span style="color:#E06C75">      targets</span><span style="color:#ABB2BF">: </span><span style="color:#E06C75">pulseClone</span><span style="color:#ABB2BF">,</span></span>
<span class="line"><span style="color:#E06C75">      duration</span><span style="color:#ABB2BF">: </span><span style="color:#D19A66">300</span><span style="color:#ABB2BF">,</span></span>
<span class="line"><span style="color:#E06C75">      easing</span><span style="color:#ABB2BF">: </span><span style="color:#98C379">'easeOutQuad'</span><span style="color:#ABB2BF">,</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75">      outlineOffset</span><span style="color:#ABB2BF">: </span><span style="color:#98C379">'18px'</span><span style="color:#ABB2BF">,</span></span>
<span class="line"><span style="color:#E06C75">      outlineColor</span><span style="color:#ABB2BF">: </span><span style="color:#98C379">'rgba(50, 205, 50, 0)'</span><span style="color:#ABB2BF">,</span></span>
<span class="line"></span>
<span class="line"><span style="color:#61AFEF">      complete</span><span style="color:#ABB2BF">: () </span><span style="color:#C678DD">=></span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#E5C07B">        pulseClone</span><span style="color:#ABB2BF">.</span><span style="color:#61AFEF">remove</span><span style="color:#ABB2BF">();</span></span>
<span class="line"><span style="color:#ABB2BF">      },</span></span>
<span class="line"><span style="color:#ABB2BF">    });</span></span>
<span class="line"><span style="color:#ABB2BF">  }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD">  function</span><span style="color:#61AFEF"> isEnterKey</span><span style="color:#ABB2BF">(</span><span style="color:#E06C75;font-style:italic">key</span><span style="color:#ABB2BF">: </span><span style="color:#E5C07B">string</span><span style="color:#ABB2BF">): </span><span style="color:#E5C07B">boolean</span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#C678DD">    const</span><span style="color:#E5C07B"> SpaceKey</span><span style="color:#56B6C2"> =</span><span style="color:#98C379"> ' '</span><span style="color:#ABB2BF">; </span><span style="color:#7F848E;font-style:italic">// wut</span></span>
<span class="line"><span style="color:#C678DD">    if</span><span style="color:#ABB2BF"> ([</span><span style="color:#98C379">'Enter'</span><span style="color:#ABB2BF">, </span><span style="color:#E06C75">SpaceKey</span><span style="color:#ABB2BF">].</span><span style="color:#61AFEF">includes</span><span style="color:#ABB2BF">(</span><span style="color:#E06C75">key</span><span style="color:#ABB2BF">)) </span><span style="color:#C678DD">return</span><span style="color:#D19A66"> true</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#C678DD">    return</span><span style="color:#D19A66"> false</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">  }</span></span>
<span class="line"><span style="color:#ABB2BF">&#x3C;/</span><span style="color:#E06C75">script</span><span style="color:#ABB2BF">></span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF">&#x3C;</span><span style="color:#E06C75">button</span></span>
<span class="line"><span style="color:#C678DD">  bind</span><span style="color:#ABB2BF">:</span><span style="color:#E5C07B">this</span><span style="color:#ABB2BF">=</span><span style="color:#C678DD">{</span><span style="color:#E06C75">goals</span><span style="color:#ABB2BF">[</span><span style="color:#D19A66">0</span><span style="color:#ABB2BF">]</span><span style="color:#C678DD">}</span></span>
<span class="line"><span style="color:#D19A66">  class</span><span style="color:#ABB2BF">=</span><span style="color:#98C379">"modifier goal goal-0"</span></span>
<span class="line"><span style="color:#C678DD">  on</span><span style="color:#ABB2BF">:</span><span style="color:#E5C07B">mousedown</span><span style="color:#ABB2BF">=</span><span style="color:#C678DD">{</span><span style="color:#ABB2BF">(</span><span style="color:#E06C75;font-style:italic">e</span><span style="color:#ABB2BF">) </span><span style="color:#C678DD">=></span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#61AFEF">    checkWin</span><span style="color:#ABB2BF">(</span><span style="color:#E5C07B">e</span><span style="color:#ABB2BF">.</span><span style="color:#E06C75">currentTarget</span><span style="color:#ABB2BF">);</span></span>
<span class="line"><span style="color:#ABB2BF">  }</span><span style="color:#C678DD">}</span></span>
<span class="line"><span style="color:#C678DD">  on</span><span style="color:#ABB2BF">:</span><span style="color:#E5C07B">keydown</span><span style="color:#ABB2BF">=</span><span style="color:#C678DD">{</span><span style="color:#ABB2BF">(</span><span style="color:#E06C75;font-style:italic">e</span><span style="color:#ABB2BF">) </span><span style="color:#C678DD">=></span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#C678DD">    if</span><span style="color:#ABB2BF"> (</span><span style="color:#61AFEF">isEnterKey</span><span style="color:#ABB2BF">(</span><span style="color:#E5C07B">e</span><span style="color:#ABB2BF">.</span><span style="color:#E06C75">key</span><span style="color:#ABB2BF">)) </span><span style="color:#61AFEF">checkWin</span><span style="color:#ABB2BF">(</span><span style="color:#E5C07B">e</span><span style="color:#ABB2BF">.</span><span style="color:#E06C75">currentTarget</span><span style="color:#ABB2BF">);</span></span>
<span class="line"><span style="color:#ABB2BF">  }</span><span style="color:#C678DD">}</span></span>
<span class="line"><span style="color:#ABB2BF">></span></span>
<span class="line"><span style="color:#ABB2BF">  &#x3C;</span><span style="color:#E06C75">div</span><span style="color:#D19A66"> class</span><span style="color:#ABB2BF">=</span><span style="color:#98C379">"golf-target child-target"</span><span style="color:#ABB2BF"> /></span></span>
<span class="line"><span style="color:#ABB2BF">&#x3C;/</span><span style="color:#E06C75">button</span><span style="color:#ABB2BF">></span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF">&#x3C;</span><span style="color:#E06C75">button</span></span>
<span class="line"><span style="color:#C678DD">  bind</span><span style="color:#ABB2BF">:</span><span style="color:#E5C07B">this</span><span style="color:#ABB2BF">=</span><span style="color:#C678DD">{</span><span style="color:#E06C75">goals</span><span style="color:#ABB2BF">[</span><span style="color:#D19A66">1</span><span style="color:#ABB2BF">]</span><span style="color:#C678DD">}</span></span>
<span class="line"><span style="color:#D19A66">  class</span><span style="color:#ABB2BF">=</span><span style="color:#98C379">"modifier goal goal-1"</span></span>
<span class="line"><span style="color:#C678DD">  on</span><span style="color:#ABB2BF">:</span><span style="color:#E5C07B">mousedown</span><span style="color:#ABB2BF">=</span><span style="color:#C678DD">{</span><span style="color:#ABB2BF">(</span><span style="color:#E06C75;font-style:italic">e</span><span style="color:#ABB2BF">) </span><span style="color:#C678DD">=></span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#61AFEF">    checkWin</span><span style="color:#ABB2BF">(</span><span style="color:#E5C07B">e</span><span style="color:#ABB2BF">.</span><span style="color:#E06C75">currentTarget</span><span style="color:#ABB2BF">);</span></span>
<span class="line"><span style="color:#ABB2BF">  }</span><span style="color:#C678DD">}</span></span>
<span class="line"><span style="color:#C678DD">  on</span><span style="color:#ABB2BF">:</span><span style="color:#E5C07B">keydown</span><span style="color:#ABB2BF">=</span><span style="color:#C678DD">{</span><span style="color:#ABB2BF">(</span><span style="color:#E06C75;font-style:italic">e</span><span style="color:#ABB2BF">) </span><span style="color:#C678DD">=></span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#C678DD">    if</span><span style="color:#ABB2BF"> (</span><span style="color:#61AFEF">isEnterKey</span><span style="color:#ABB2BF">(</span><span style="color:#E5C07B">e</span><span style="color:#ABB2BF">.</span><span style="color:#E06C75">key</span><span style="color:#ABB2BF">)) </span><span style="color:#61AFEF">checkWin</span><span style="color:#ABB2BF">(</span><span style="color:#E5C07B">e</span><span style="color:#ABB2BF">.</span><span style="color:#E06C75">currentTarget</span><span style="color:#ABB2BF">);</span></span>
<span class="line"><span style="color:#ABB2BF">  }</span><span style="color:#C678DD">}</span></span>
<span class="line"><span style="color:#ABB2BF">></span></span>
<span class="line"><span style="color:#ABB2BF">  &#x3C;</span><span style="color:#E06C75">div</span><span style="color:#D19A66"> class</span><span style="color:#ABB2BF">=</span><span style="color:#98C379">"golf-target child-target"</span><span style="color:#ABB2BF"> /></span></span>
<span class="line"><span style="color:#ABB2BF">&#x3C;/</span><span style="color:#E06C75">button</span><span style="color:#ABB2BF">></span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF">&#x3C;</span><span style="color:#E06C75">button</span></span>
<span class="line"><span style="color:#C678DD">  bind</span><span style="color:#ABB2BF">:</span><span style="color:#E5C07B">this</span><span style="color:#ABB2BF">=</span><span style="color:#C678DD">{</span><span style="color:#E06C75">goals</span><span style="color:#ABB2BF">[</span><span style="color:#D19A66">2</span><span style="color:#ABB2BF">]</span><span style="color:#C678DD">}</span></span>
<span class="line"><span style="color:#D19A66">  class</span><span style="color:#ABB2BF">=</span><span style="color:#98C379">"modifier goal goal-2"</span></span>
<span class="line"><span style="color:#C678DD">  on</span><span style="color:#ABB2BF">:</span><span style="color:#E5C07B">mousedown</span><span style="color:#ABB2BF">=</span><span style="color:#C678DD">{</span><span style="color:#ABB2BF">(</span><span style="color:#E06C75;font-style:italic">e</span><span style="color:#ABB2BF">) </span><span style="color:#C678DD">=></span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#61AFEF">    checkWin</span><span style="color:#ABB2BF">(</span><span style="color:#E5C07B">e</span><span style="color:#ABB2BF">.</span><span style="color:#E06C75">currentTarget</span><span style="color:#ABB2BF">);</span></span>
<span class="line"><span style="color:#ABB2BF">  }</span><span style="color:#C678DD">}</span></span>
<span class="line"><span style="color:#C678DD">  on</span><span style="color:#ABB2BF">:</span><span style="color:#E5C07B">keydown</span><span style="color:#ABB2BF">=</span><span style="color:#C678DD">{</span><span style="color:#ABB2BF">(</span><span style="color:#E06C75;font-style:italic">e</span><span style="color:#ABB2BF">) </span><span style="color:#C678DD">=></span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#C678DD">    if</span><span style="color:#ABB2BF"> (</span><span style="color:#61AFEF">isEnterKey</span><span style="color:#ABB2BF">(</span><span style="color:#E5C07B">e</span><span style="color:#ABB2BF">.</span><span style="color:#E06C75">key</span><span style="color:#ABB2BF">)) </span><span style="color:#61AFEF">checkWin</span><span style="color:#ABB2BF">(</span><span style="color:#E5C07B">e</span><span style="color:#ABB2BF">.</span><span style="color:#E06C75">currentTarget</span><span style="color:#ABB2BF">);</span></span>
<span class="line"><span style="color:#ABB2BF">  }</span><span style="color:#C678DD">}</span></span>
<span class="line"><span style="color:#ABB2BF">></span></span>
<span class="line"><span style="color:#ABB2BF">  &#x3C;</span><span style="color:#E06C75">div</span><span style="color:#D19A66"> class</span><span style="color:#ABB2BF">=</span><span style="color:#98C379">"golf-target child-target"</span><span style="color:#ABB2BF"> /></span></span>
<span class="line"><span style="color:#ABB2BF">&#x3C;/</span><span style="color:#E06C75">button</span><span style="color:#ABB2BF">></span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF">&#x3C;</span><span style="color:#E06C75">button</span></span>
<span class="line"><span style="color:#C678DD">  bind</span><span style="color:#ABB2BF">:</span><span style="color:#E5C07B">this</span><span style="color:#ABB2BF">=</span><span style="color:#C678DD">{</span><span style="color:#E06C75">goals</span><span style="color:#ABB2BF">[</span><span style="color:#D19A66">3</span><span style="color:#ABB2BF">]</span><span style="color:#C678DD">}</span></span>
<span class="line"><span style="color:#D19A66">  class</span><span style="color:#ABB2BF">=</span><span style="color:#98C379">"modifier goal goal-3"</span></span>
<span class="line"><span style="color:#C678DD">  on</span><span style="color:#ABB2BF">:</span><span style="color:#E5C07B">mousedown</span><span style="color:#ABB2BF">=</span><span style="color:#C678DD">{</span><span style="color:#ABB2BF">(</span><span style="color:#E06C75;font-style:italic">e</span><span style="color:#ABB2BF">) </span><span style="color:#C678DD">=></span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#61AFEF">    checkWin</span><span style="color:#ABB2BF">(</span><span style="color:#E5C07B">e</span><span style="color:#ABB2BF">.</span><span style="color:#E06C75">currentTarget</span><span style="color:#ABB2BF">);</span></span>
<span class="line"><span style="color:#ABB2BF">  }</span><span style="color:#C678DD">}</span></span>
<span class="line"><span style="color:#C678DD">  on</span><span style="color:#ABB2BF">:</span><span style="color:#E5C07B">keydown</span><span style="color:#ABB2BF">=</span><span style="color:#C678DD">{</span><span style="color:#ABB2BF">(</span><span style="color:#E06C75;font-style:italic">e</span><span style="color:#ABB2BF">) </span><span style="color:#C678DD">=></span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#C678DD">    if</span><span style="color:#ABB2BF"> (</span><span style="color:#61AFEF">isEnterKey</span><span style="color:#ABB2BF">(</span><span style="color:#E5C07B">e</span><span style="color:#ABB2BF">.</span><span style="color:#E06C75">key</span><span style="color:#ABB2BF">)) </span><span style="color:#61AFEF">checkWin</span><span style="color:#ABB2BF">(</span><span style="color:#E5C07B">e</span><span style="color:#ABB2BF">.</span><span style="color:#E06C75">currentTarget</span><span style="color:#ABB2BF">);</span></span>
<span class="line"><span style="color:#ABB2BF">  }</span><span style="color:#C678DD">}</span></span>
<span class="line"><span style="color:#ABB2BF">></span></span>
<span class="line"><span style="color:#ABB2BF">  &#x3C;</span><span style="color:#E06C75">div</span><span style="color:#D19A66"> class</span><span style="color:#ABB2BF">=</span><span style="color:#98C379">"golf-target child-target"</span><span style="color:#ABB2BF"> /></span></span>
<span class="line"><span style="color:#ABB2BF">&#x3C;/</span><span style="color:#E06C75">button</span><span style="color:#ABB2BF">></span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF">&#x3C;</span><span style="color:#E06C75">button</span></span>
<span class="line"><span style="color:#C678DD">  bind</span><span style="color:#ABB2BF">:</span><span style="color:#E5C07B">this</span><span style="color:#ABB2BF">=</span><span style="color:#C678DD">{</span><span style="color:#E06C75">goals</span><span style="color:#ABB2BF">[</span><span style="color:#D19A66">4</span><span style="color:#ABB2BF">]</span><span style="color:#C678DD">}</span></span>
<span class="line"><span style="color:#D19A66">  class</span><span style="color:#ABB2BF">=</span><span style="color:#98C379">"modifier goal goal-4"</span></span>
<span class="line"><span style="color:#C678DD">  on</span><span style="color:#ABB2BF">:</span><span style="color:#E5C07B">mousedown</span><span style="color:#ABB2BF">=</span><span style="color:#C678DD">{</span><span style="color:#ABB2BF">(</span><span style="color:#E06C75;font-style:italic">e</span><span style="color:#ABB2BF">) </span><span style="color:#C678DD">=></span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#61AFEF">    checkWin</span><span style="color:#ABB2BF">(</span><span style="color:#E5C07B">e</span><span style="color:#ABB2BF">.</span><span style="color:#E06C75">currentTarget</span><span style="color:#ABB2BF">);</span></span>
<span class="line"><span style="color:#ABB2BF">  }</span><span style="color:#C678DD">}</span></span>
<span class="line"><span style="color:#C678DD">  on</span><span style="color:#ABB2BF">:</span><span style="color:#E5C07B">keydown</span><span style="color:#ABB2BF">=</span><span style="color:#C678DD">{</span><span style="color:#ABB2BF">(</span><span style="color:#E06C75;font-style:italic">e</span><span style="color:#ABB2BF">) </span><span style="color:#C678DD">=></span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#C678DD">    if</span><span style="color:#ABB2BF"> (</span><span style="color:#61AFEF">isEnterKey</span><span style="color:#ABB2BF">(</span><span style="color:#E5C07B">e</span><span style="color:#ABB2BF">.</span><span style="color:#E06C75">key</span><span style="color:#ABB2BF">)) </span><span style="color:#61AFEF">checkWin</span><span style="color:#ABB2BF">(</span><span style="color:#E5C07B">e</span><span style="color:#ABB2BF">.</span><span style="color:#E06C75">currentTarget</span><span style="color:#ABB2BF">);</span></span>
<span class="line"><span style="color:#ABB2BF">  }</span><span style="color:#C678DD">}</span></span>
<span class="line"><span style="color:#ABB2BF">></span></span>
<span class="line"><span style="color:#ABB2BF">  &#x3C;</span><span style="color:#E06C75">div</span><span style="color:#D19A66"> class</span><span style="color:#ABB2BF">=</span><span style="color:#98C379">"golf-target child-target"</span><span style="color:#ABB2BF"> /></span></span>
<span class="line"><span style="color:#ABB2BF">&#x3C;/</span><span style="color:#E06C75">button</span><span style="color:#ABB2BF">></span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF">&#x3C;</span><span style="color:#E06C75">div</span><span style="color:#C678DD"> bind</span><span style="color:#ABB2BF">:</span><span style="color:#E5C07B">this</span><span style="color:#ABB2BF">=</span><span style="color:#C678DD">{</span><span style="color:#E06C75">startingTarget</span><span style="color:#C678DD">}</span><span style="color:#D19A66"> class</span><span style="color:#ABB2BF">=</span><span style="color:#98C379">"golf-target starting-target"</span><span style="color:#ABB2BF"> /></span></span>
<span class="line"><span style="color:#ABB2BF">&#x3C;</span><span style="color:#E06C75">div</span><span style="color:#C678DD"> bind</span><span style="color:#ABB2BF">:</span><span style="color:#E5C07B">this</span><span style="color:#ABB2BF">=</span><span style="color:#C678DD">{</span><span style="color:#E06C75">winnerTarget</span><span style="color:#C678DD">}</span><span style="color:#D19A66"> class</span><span style="color:#ABB2BF">=</span><span style="color:#98C379">"golf-target winner-target"</span><span style="color:#ABB2BF"> /></span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF">&#x3C;</span><span style="color:#E06C75">button</span></span>
<span class="line"><span style="color:#C678DD">  bind</span><span style="color:#ABB2BF">:</span><span style="color:#E5C07B">this</span><span style="color:#ABB2BF">=</span><span style="color:#C678DD">{</span><span style="color:#E06C75">spinnerModifier</span><span style="color:#C678DD">}</span></span>
<span class="line"><span style="color:#D19A66">  class</span><span style="color:#ABB2BF">=</span><span style="color:#98C379">"modifier spinner"</span></span>
<span class="line"><span style="color:#C678DD">  on</span><span style="color:#ABB2BF">:</span><span style="color:#E5C07B">mousedown</span><span style="color:#ABB2BF">=</span><span style="color:#C678DD">{</span><span style="color:#ABB2BF">(</span><span style="color:#E06C75;font-style:italic">e</span><span style="color:#ABB2BF">) </span><span style="color:#C678DD">=></span><span style="color:#61AFEF"> moveCurrentTargetToModifier</span><span style="color:#ABB2BF">(</span><span style="color:#E5C07B">e</span><span style="color:#ABB2BF">.</span><span style="color:#E06C75">currentTarget</span><span style="color:#ABB2BF">)</span><span style="color:#C678DD">}</span></span>
<span class="line"><span style="color:#C678DD">  on</span><span style="color:#ABB2BF">:</span><span style="color:#E5C07B">keydown</span><span style="color:#ABB2BF">=</span><span style="color:#C678DD">{</span><span style="color:#ABB2BF">(</span><span style="color:#E06C75;font-style:italic">e</span><span style="color:#ABB2BF">) </span><span style="color:#C678DD">=></span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#C678DD">    if</span><span style="color:#ABB2BF"> (</span><span style="color:#61AFEF">isEnterKey</span><span style="color:#ABB2BF">(</span><span style="color:#E5C07B">e</span><span style="color:#ABB2BF">.</span><span style="color:#E06C75">key</span><span style="color:#ABB2BF">)) </span><span style="color:#61AFEF">moveCurrentTargetToModifier</span><span style="color:#ABB2BF">(</span><span style="color:#E5C07B">e</span><span style="color:#ABB2BF">.</span><span style="color:#E06C75">currentTarget</span><span style="color:#ABB2BF">);</span></span>
<span class="line"><span style="color:#ABB2BF">  }</span><span style="color:#C678DD">}</span></span>
<span class="line"><span style="color:#ABB2BF">></span></span>
<span class="line"><span style="color:#ABB2BF">  &#x3C;</span><span style="color:#E06C75">div</span><span style="color:#D19A66"> class</span><span style="color:#ABB2BF">=</span><span style="color:#98C379">"golf-target child-target"</span><span style="color:#ABB2BF"> /></span></span>
<span class="line"><span style="color:#ABB2BF">&#x3C;/</span><span style="color:#E06C75">button</span><span style="color:#ABB2BF">></span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF">&#x3C;</span><span style="color:#E06C75">button</span></span>
<span class="line"><span style="color:#C678DD">  bind</span><span style="color:#ABB2BF">:</span><span style="color:#E5C07B">this</span><span style="color:#ABB2BF">=</span><span style="color:#C678DD">{</span><span style="color:#E06C75">slider1Modifier</span><span style="color:#C678DD">}</span></span>
<span class="line"><span style="color:#D19A66">  class</span><span style="color:#ABB2BF">=</span><span style="color:#98C379">"modifier slider1"</span></span>
<span class="line"><span style="color:#C678DD">  on</span><span style="color:#ABB2BF">:</span><span style="color:#E5C07B">mousedown</span><span style="color:#ABB2BF">=</span><span style="color:#C678DD">{</span><span style="color:#ABB2BF">(</span><span style="color:#E06C75;font-style:italic">e</span><span style="color:#ABB2BF">) </span><span style="color:#C678DD">=></span><span style="color:#61AFEF"> moveCurrentTargetToModifier</span><span style="color:#ABB2BF">(</span><span style="color:#E5C07B">e</span><span style="color:#ABB2BF">.</span><span style="color:#E06C75">currentTarget</span><span style="color:#ABB2BF">)</span><span style="color:#C678DD">}</span></span>
<span class="line"><span style="color:#C678DD">  on</span><span style="color:#ABB2BF">:</span><span style="color:#E5C07B">keydown</span><span style="color:#ABB2BF">=</span><span style="color:#C678DD">{</span><span style="color:#ABB2BF">(</span><span style="color:#E06C75;font-style:italic">e</span><span style="color:#ABB2BF">) </span><span style="color:#C678DD">=></span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#C678DD">    if</span><span style="color:#ABB2BF"> (</span><span style="color:#61AFEF">isEnterKey</span><span style="color:#ABB2BF">(</span><span style="color:#E5C07B">e</span><span style="color:#ABB2BF">.</span><span style="color:#E06C75">key</span><span style="color:#ABB2BF">)) </span><span style="color:#61AFEF">moveCurrentTargetToModifier</span><span style="color:#ABB2BF">(</span><span style="color:#E5C07B">e</span><span style="color:#ABB2BF">.</span><span style="color:#E06C75">currentTarget</span><span style="color:#ABB2BF">);</span></span>
<span class="line"><span style="color:#ABB2BF">  }</span><span style="color:#C678DD">}</span></span>
<span class="line"><span style="color:#ABB2BF">></span></span>
<span class="line"><span style="color:#ABB2BF">  &#x3C;</span><span style="color:#E06C75">div</span><span style="color:#D19A66"> class</span><span style="color:#ABB2BF">=</span><span style="color:#98C379">"golf-target child-target"</span><span style="color:#ABB2BF"> /></span></span>
<span class="line"><span style="color:#ABB2BF">&#x3C;/</span><span style="color:#E06C75">button</span><span style="color:#ABB2BF">></span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF">&#x3C;</span><span style="color:#E06C75">button</span></span>
<span class="line"><span style="color:#C678DD">  bind</span><span style="color:#ABB2BF">:</span><span style="color:#E5C07B">this</span><span style="color:#ABB2BF">=</span><span style="color:#C678DD">{</span><span style="color:#E06C75">slider2Modifier</span><span style="color:#C678DD">}</span></span>
<span class="line"><span style="color:#D19A66">  class</span><span style="color:#ABB2BF">=</span><span style="color:#98C379">"modifier slider2"</span></span>
<span class="line"><span style="color:#C678DD">  on</span><span style="color:#ABB2BF">:</span><span style="color:#E5C07B">mousedown</span><span style="color:#ABB2BF">=</span><span style="color:#C678DD">{</span><span style="color:#ABB2BF">(</span><span style="color:#E06C75;font-style:italic">e</span><span style="color:#ABB2BF">) </span><span style="color:#C678DD">=></span><span style="color:#61AFEF"> moveCurrentTargetToModifier</span><span style="color:#ABB2BF">(</span><span style="color:#E5C07B">e</span><span style="color:#ABB2BF">.</span><span style="color:#E06C75">currentTarget</span><span style="color:#ABB2BF">)</span><span style="color:#C678DD">}</span></span>
<span class="line"><span style="color:#C678DD">  on</span><span style="color:#ABB2BF">:</span><span style="color:#E5C07B">keydown</span><span style="color:#ABB2BF">=</span><span style="color:#C678DD">{</span><span style="color:#ABB2BF">(</span><span style="color:#E06C75;font-style:italic">e</span><span style="color:#ABB2BF">) </span><span style="color:#C678DD">=></span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#C678DD">    if</span><span style="color:#ABB2BF"> (</span><span style="color:#61AFEF">isEnterKey</span><span style="color:#ABB2BF">(</span><span style="color:#E5C07B">e</span><span style="color:#ABB2BF">.</span><span style="color:#E06C75">key</span><span style="color:#ABB2BF">)) </span><span style="color:#61AFEF">moveCurrentTargetToModifier</span><span style="color:#ABB2BF">(</span><span style="color:#E5C07B">e</span><span style="color:#ABB2BF">.</span><span style="color:#E06C75">currentTarget</span><span style="color:#ABB2BF">);</span></span>
<span class="line"><span style="color:#ABB2BF">  }</span><span style="color:#C678DD">}</span></span>
<span class="line"><span style="color:#ABB2BF">></span></span>
<span class="line"><span style="color:#ABB2BF">  &#x3C;</span><span style="color:#E06C75">div</span><span style="color:#D19A66"> class</span><span style="color:#ABB2BF">=</span><span style="color:#98C379">"golf-target child-target"</span><span style="color:#ABB2BF"> /></span></span>
<span class="line"><span style="color:#ABB2BF">&#x3C;/</span><span style="color:#E06C75">button</span><span style="color:#ABB2BF">></span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF">&#x3C;</span><span style="color:#E06C75">div</span><span style="color:#C678DD"> bind</span><span style="color:#ABB2BF">:</span><span style="color:#E5C07B">this</span><span style="color:#ABB2BF">=</span><span style="color:#C678DD">{</span><span style="color:#E06C75">pulseContainer</span><span style="color:#C678DD">}</span><span style="color:#D19A66"> class</span><span style="color:#ABB2BF">=</span><span style="color:#98C379">"pulse-container"</span><span style="color:#ABB2BF">></span></span>
<span class="line"><span style="color:#ABB2BF">  &#x3C;</span><span style="color:#E06C75">div</span><span style="color:#C678DD"> bind</span><span style="color:#ABB2BF">:</span><span style="color:#E5C07B">this</span><span style="color:#ABB2BF">=</span><span style="color:#C678DD">{</span><span style="color:#E06C75">pulseTemplate</span><span style="color:#C678DD">}</span><span style="color:#D19A66"> class</span><span style="color:#ABB2BF">=</span><span style="color:#98C379">"golf-target pulse-template"</span><span style="color:#ABB2BF"> /></span></span>
<span class="line"><span style="color:#ABB2BF">&#x3C;/</span><span style="color:#E06C75">div</span><span style="color:#ABB2BF">></span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF">&#x3C;</span><span style="color:#E06C75">button</span><span style="color:#D19A66"> class</span><span style="color:#ABB2BF">=</span><span style="color:#98C379">"restart"</span><span style="color:#C678DD"> on</span><span style="color:#ABB2BF">:</span><span style="color:#E5C07B">click</span><span style="color:#ABB2BF">=</span><span style="color:#C678DD">{</span><span style="color:#ABB2BF">() </span><span style="color:#C678DD">=></span><span style="color:#61AFEF"> restart</span><span style="color:#ABB2BF">()</span><span style="color:#C678DD">}</span><span style="color:#ABB2BF">></span></span>
<span class="line"><span style="color:#ABB2BF">  &#x3C;</span><span style="color:#E06C75">span</span><span style="color:#D19A66"> class</span><span style="color:#ABB2BF">=</span><span style="color:#98C379">"material-symbols-outlined"</span><span style="color:#ABB2BF">> replay &#x3C;/</span><span style="color:#E06C75">span</span><span style="color:#ABB2BF">></span></span>
<span class="line"><span style="color:#ABB2BF">&#x3C;/</span><span style="color:#E06C75">button</span><span style="color:#ABB2BF">></span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF">&#x3C;</span><span style="color:#E06C75">style</span><span style="color:#D19A66"> lang</span><span style="color:#ABB2BF">=</span><span style="color:#98C379">"scss"</span><span style="color:#ABB2BF">></span></span>
<span class="line"><span style="color:#E06C75">  button</span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#ABB2BF">    all: </span><span style="color:#D19A66">unset</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#E06C75">    cursor</span><span style="color:#ABB2BF">: </span><span style="color:#D19A66">pointer</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#56B6C2">    -webkit-tap-highlight-color</span><span style="color:#ABB2BF">: </span><span style="color:#D19A66">transparent</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">  }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D19A66">  .modifier</span><span style="color:#56B6C2">:focus-visible</span><span style="color:#ABB2BF">,</span></span>
<span class="line"><span style="color:#D19A66">  .restart</span><span style="color:#56B6C2">:focus-visible</span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#ABB2BF">    outline: </span><span style="color:#D19A66">solid</span><span style="color:#D19A66"> 2</span><span style="color:#E06C75">px</span><span style="color:#D19A66"> white</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">    outline-offset: </span><span style="color:#D19A66">4</span><span style="color:#E06C75">px</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">  }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D19A66">  .restart</span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#ABB2BF">    position: </span><span style="color:#D19A66">absolute</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">    top: </span><span style="color:#D19A66">1</span><span style="color:#E06C75">em</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">    right: </span><span style="color:#D19A66">1</span><span style="color:#E06C75">em</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">  }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D19A66">  .golf-target</span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#ABB2BF">    position: </span><span style="color:#D19A66">absolute</span><span style="color:#ABB2BF">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF">    width: </span><span style="color:#D19A66">35</span><span style="color:#E06C75">px</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">    height: </span><span style="color:#D19A66">35</span><span style="color:#E06C75">px</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">    border: </span><span style="color:#D19A66">solid</span><span style="color:#D19A66"> 3</span><span style="color:#E06C75">px</span><span style="color:#D19A66"> #32cd32</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">    outline: </span><span style="color:#D19A66">dotted</span><span style="color:#D19A66"> 3</span><span style="color:#E06C75">px</span><span style="color:#D19A66"> transparent</span><span style="color:#ABB2BF">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF">    pointer-events: </span><span style="color:#D19A66">none</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">  }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D19A66">  .starting-target</span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#ABB2BF">    top: </span><span style="color:#D19A66">100</span><span style="color:#E06C75">px</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">    left: </span><span style="color:#D19A66">50</span><span style="color:#E06C75">px</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">  }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D19A66">  .child-target</span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#ABB2BF">    opacity: </span><span style="color:#D19A66">0</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">  }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D19A66">  .winner-target</span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#ABB2BF">    opacity: </span><span style="color:#D19A66">0</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">    background-color: limegreen;</span></span>
<span class="line"><span style="color:#ABB2BF">  }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D19A66">  .pulse-template</span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#ABB2BF">    border-color: </span><span style="color:#D19A66">transparent</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">    outline: </span><span style="color:#D19A66">solid</span><span style="color:#D19A66"> 2</span><span style="color:#E06C75">px</span><span style="color:#D19A66"> transparent</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">  }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D19A66">  .modifier</span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#ABB2BF">    position: </span><span style="color:#D19A66">absolute</span><span style="color:#ABB2BF">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF">    width: </span><span style="color:#D19A66">150</span><span style="color:#E06C75">px</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">    height: </span><span style="color:#D19A66">150</span><span style="color:#E06C75">px</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">    border: </span><span style="color:#D19A66">dashed</span><span style="color:#D19A66"> 3</span><span style="color:#E06C75">px</span><span style="color:#ABB2BF"> darkmagenta;</span></span>
<span class="line"><span style="color:#ABB2BF">  }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D19A66">  .spinner</span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#ABB2BF">    top: </span><span style="color:#D19A66">110</span><span style="color:#E06C75">px</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">    left: </span><span style="color:#D19A66">100</span><span style="color:#E06C75">px</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">  }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D19A66">  .slider1</span><span style="color:#ABB2BF">,</span></span>
<span class="line"><span style="color:#D19A66">  .slider2</span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#ABB2BF">    height: </span><span style="color:#D19A66">50</span><span style="color:#E06C75">px</span><span style="color:#ABB2BF">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF">    border-color: </span><span style="color:#D19A66">yellow</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">  }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D19A66">  .slider1</span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#ABB2BF">    top: </span><span style="color:#D19A66">200</span><span style="color:#E06C75">px</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">    right: </span><span style="color:#D19A66">275</span><span style="color:#E06C75">px</span><span style="color:#ABB2BF">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF">    transform: </span><span style="color:#56B6C2">rotate</span><span style="color:#ABB2BF">(</span><span style="color:#D19A66">-45</span><span style="color:#E06C75">deg</span><span style="color:#ABB2BF">);</span></span>
<span class="line"><span style="color:#ABB2BF">  }</span></span>
<span class="line"><span style="color:#D19A66">  .slider2</span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#ABB2BF">    top: </span><span style="color:#D19A66">200</span><span style="color:#E06C75">px</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">    right: </span><span style="color:#D19A66">25</span><span style="color:#E06C75">px</span><span style="color:#ABB2BF">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF">    transform: </span><span style="color:#56B6C2">rotate</span><span style="color:#ABB2BF">(</span><span style="color:#D19A66">225</span><span style="color:#E06C75">deg</span><span style="color:#ABB2BF">);</span></span>
<span class="line"><span style="color:#ABB2BF">  }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D19A66">  .goal</span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#ABB2BF">    width: </span><span style="color:#D19A66">35</span><span style="color:#E06C75">px</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">    height: </span><span style="color:#D19A66">35</span><span style="color:#E06C75">px</span><span style="color:#ABB2BF">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF">    border-style: </span><span style="color:#D19A66">solid</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">    border-color: </span><span style="color:#D19A66">red</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">  }</span></span>
<span class="line"><span style="color:#D19A66">  .goal-0</span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#ABB2BF">    top: </span><span style="color:#D19A66">250</span><span style="color:#E06C75">px</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">    left: </span><span style="color:#D19A66">455</span><span style="color:#E06C75">px</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">    transform: </span><span style="color:#56B6C2">rotate</span><span style="color:#ABB2BF">(</span><span style="color:#D19A66">45</span><span style="color:#E06C75">deg</span><span style="color:#ABB2BF">);</span></span>
<span class="line"><span style="color:#ABB2BF">  }</span></span>
<span class="line"><span style="color:#D19A66">  .goal-1</span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#ABB2BF">    top: </span><span style="color:#D19A66">97</span><span style="color:#E06C75">px</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">    left: </span><span style="color:#D19A66">263</span><span style="color:#E06C75">px</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">    transform: </span><span style="color:#56B6C2">rotate</span><span style="color:#ABB2BF">(</span><span style="color:#D19A66">24</span><span style="color:#E06C75">deg</span><span style="color:#ABB2BF">);</span></span>
<span class="line"><span style="color:#ABB2BF">  }</span></span>
<span class="line"><span style="color:#D19A66">  .goal-2</span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#ABB2BF">    top: </span><span style="color:#D19A66">144</span><span style="color:#E06C75">px</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">    left: </span><span style="color:#D19A66">604</span><span style="color:#E06C75">px</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">    transform: </span><span style="color:#56B6C2">rotate</span><span style="color:#ABB2BF">(</span><span style="color:#D19A66">20</span><span style="color:#E06C75">deg</span><span style="color:#ABB2BF">);</span></span>
<span class="line"><span style="color:#ABB2BF">  }</span></span>
<span class="line"><span style="color:#D19A66">  .goal-3</span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#ABB2BF">    top: </span><span style="color:#D19A66">97</span><span style="color:#E06C75">px</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">    left: </span><span style="color:#D19A66">599</span><span style="color:#E06C75">px</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">    transform: </span><span style="color:#56B6C2">rotate</span><span style="color:#ABB2BF">(</span><span style="color:#D19A66">14</span><span style="color:#E06C75">deg</span><span style="color:#ABB2BF">);</span></span>
<span class="line"><span style="color:#ABB2BF">  }</span></span>
<span class="line"><span style="color:#D19A66">  .goal-4</span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#ABB2BF">    top: </span><span style="color:#D19A66">51</span><span style="color:#E06C75">px</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">    left: </span><span style="color:#D19A66">591</span><span style="color:#E06C75">px</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">    transform: </span><span style="color:#56B6C2">rotate</span><span style="color:#ABB2BF">(</span><span style="color:#D19A66">9</span><span style="color:#E06C75">deg</span><span style="color:#ABB2BF">);</span></span>
<span class="line"><span style="color:#ABB2BF">  }</span></span>
<span class="line"><span style="color:#ABB2BF">&#x3C;/</span><span style="color:#E06C75">style</span><span style="color:#ABB2BF">></span></span>
<span class="line"></span></code></pre>`;
