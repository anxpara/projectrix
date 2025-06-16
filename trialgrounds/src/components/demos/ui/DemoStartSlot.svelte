<script lang="ts">
  let slotSubect: HTMLElement;
  let showing = false;

  export function show(): void {
    slotSubect.style.opacity = '1';
    showing = true;
  }

  export function hide(): void {
    slotSubect.style.opacity = '0';
    showing = false;
  }

  export function isShowing(): boolean {
    return showing;
  }

  export function getSlotSubject(): HTMLElement {
    return slotSubect;
  }
</script>

<div bind:this={slotSubect} class="corner right target-slot slot-1"></div>

<style lang="scss">
  .corner {
    position: absolute;

    width: 3em;
    height: 3.55em;

    transform: skew(-34deg);
  }
  .right {
    left: unset;
    right: 1.2em;
    bottom: 0px;
    height: calc(100% + -5px);

    color: coral;
    background-color: coral;
  }
  .target-slot {
    border: solid 3px limegreen;
    width: calc(2em - 6px);

    opacity: 0;
    color: transparent;
    background-color: transparent;
    
    cursor: default;
  }
  .slot-1 {
    right: calc(-3.3em + 1px);

    pointer-events: none;
    cursor: default;
  }
</style>
