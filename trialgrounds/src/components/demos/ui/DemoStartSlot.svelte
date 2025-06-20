<script lang="ts">
  type Props = {
    showing: boolean;
  };
  let { showing }: Props = $props();

  let slotSubect: HTMLElement;

  export function show(): void {
    showing = true;
  }

  export function hide(): void {
    showing = false;
  }

  export function isShowing(): boolean {
    return showing;
  }

  export function getSlotSubject(): HTMLElement {
    return slotSubect;
  }
</script>

<div bind:this={slotSubect} class="slot-subject" class:showing></div>

<style lang="scss">
  .slot-subject {
    position: absolute;
    left: unset;
    right: calc(-3.3em + 1px);
    bottom: 0px;

    border: solid 3px limegreen;
    width: calc(2em - 6px);
    height: calc(100% + -5px);

    opacity: 0;
    color: transparent;
    background-color: transparent;
    transform: skew(-34deg);

    pointer-events: none;
    cursor: default;
  }
  .showing {
    opacity: 1;
  }
</style>
