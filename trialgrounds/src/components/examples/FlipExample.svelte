<script lang="ts">
  import { onDestroy, onMount, tick } from 'svelte';
  import { getProjection } from 'projectrix';
  import anime from 'animejs';

  let elementA: HTMLElement;
  let elementB: HTMLElement;
  let elementC: HTMLElement;

  let tl: anime.AnimeTimelineInstance | undefined = undefined;

  onMount(async () => {
    await tick();

    flip();
    setInterval(flip, 5500);
  });

  onDestroy(() => {
    tl?.pause();
  });

  function flip(): void {
    tl?.pause();

    anime.set(elementC, {
      rotate: '-15deg',
    });

    const projectionOfA = getProjection(elementA, elementB, { transformType: 'matrix3d' });

    anime.set(elementB, {
      ...projectionOfA,
    });

    tl = anime.timeline();

    tl.add({
      targets: elementB,
      delay: 1000,
      duration: 1000,
      easing: 'easeOutQuad',
      matrix3d: projectionOfA.toSubject.matrix3d,
    });
    tl.add({
      targets: elementC,
      delay: 600,
      duration: 2000,
      keyframes: [{ rotate: '-10deg' }, { rotate: '-20deg' }, { rotate: '-15deg' }],
    });
  }
</script>

<div class="example-container">
  <div class="container-d">
    <div bind:this={elementA} class="a">
      <p class="label">A</p>
    </div>
    <p class="label">D</p>
  </div>
  <div bind:this={elementC} class="container-c">
    <div bind:this={elementB} class="b">
      <p class="label">B</p>
    </div>
    <p class="label">C</p>
  </div>
</div>

<style lang="scss">
  .label {
    position: absolute;
    margin: 0;

    right: 1em;
    bottom: 1em;
  }

  .example-container {
    padding: 5em;
  }

  .container-d,
  .container-c {
    outline: dashed 2px;
    width: 20em;
    height: 20em;
  }

  .container-d {
    position: relative;
    color: blue;
    background-color: rgba(0, 0, 1, 0.5);
  }

  .container-c {
    margin-top: 5em;
    color: purple;
    background-color: rgba(0.7, 0, 0.7, 0.5);
    transform: 'rotate(-15deg)';
  }

  .a,
  .b {
    position: relative;
    top: 5em;
    left: 5em;
    width: 5em;
    height: 5em;

    outline: solid 2px;
  }

  .a {
    transform: rotate(15deg);

    color: yellow;

    .label {
      left: 1em;
    }
  }

  .b {
    top: 0;
    left: 0;
    color: green;
  }
</style>
