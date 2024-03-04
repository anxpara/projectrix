<script lang="ts">
  import { getActualClientRect } from 'actual-client-rect';
  import anime from 'animejs';

  let marker: HTMLElement;
  let marked = false;

  export function markOrigin(target: HTMLElement): void {
    const acr = getActualClientRect(target);

    anime.set(marker, {
      width: acr.basis.width,
      height: acr.basis.height,
      top: acr.basis.top,
      left: acr.basis.left,
      matrix3d: acr.matrix3d,
    });

    marked = true;
  }

  export function unmark(): void {
    marked = false;
  }
</script>

<div bind:this={marker} class="marker" class:hide={!marked}>(target origin)</div>

<style lang="scss">
  .marker {
    position: fixed;
    top: 0;
    left: 0;
    outline-style: dotted;
    color: green;
    pointer-events: none;
  }

  .hide {
    opacity: 0;
  }
</style>
