<script lang="ts">
  import { getProjection, setInlineStyles } from 'projectrix';

  let marker: HTMLElement;
  let marked = false;

  export function markOrigin(target: HTMLElement): void {
    const { toSubject } = getProjection(target, marker, {
      useBorder: 'target',
    });
    setInlineStyles(marker, toSubject);

    marked = true;
  }

  export function unmark(): void {
    marked = false;
  }
</script>

<div bind:this={marker} class="marker" class:hide={!marked}>(target origin)</div>

<style lang="scss">
  .marker {
    position: absolute;
    top: 0;
    left: 0;
    border: dotted 3px green;
    color: green;
    pointer-events: none;
  }

  .hide {
    opacity: 0;
  }
</style>
