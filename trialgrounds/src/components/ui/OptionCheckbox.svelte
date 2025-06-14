<script lang="ts">
  import type { Options } from '$lib/options';
  import type { Store } from '$lib/stores/Store';
  import { Checkbox, Label } from 'bits-ui';
  import { getContext } from 'svelte';

  interface Props {
    name: string;
    irrelevant?: boolean;
  }
  let { name, irrelevant = false }: Props = $props();

  const optionsStore: Store<Options> = getContext('optionsStore');
</script>

<div class="check-container {name}" class:irrelevant>
  <Checkbox.Root
    id="checkbox-{name}"
    aria-labelledby="label-{name}"
    bind:checked={optionsStore.value[name]}
    class="check-button {name}"
  ></Checkbox.Root>
  <Label.Root id="label-{name}" for="checkbox-{name}" class="check-label {name}">
    {name}
  </Label.Root>
</div>

<style lang="scss">
  .check-container {
    display: flex;
    align-items: center;
    gap: 0.5em;

    font-weight: 600;

    > :global(.check-button) {
      width: 1.4em;
      height: 1.4em;
      border: solid 3px coral;
      padding: 0;

      background-color: #111521;
      cursor: pointer;
    }
    > :global(.check-button[data-state='checked']) {
      background-color: rgba(255, 127, 80, 0.6);
    }

    > :global(.check-label) {
      cursor: pointer;
    }

    > :global(.hideUI) {
      color: red;
      border-color: red;
    }
  }

  .check-container.irrelevant {
    > :global(.check-button) {
      border-color: rgba(100, 100, 100, 1);
    }
    > :global(.check-button[data-state='checked']) {
      background-color: rgba(100, 100, 100, 0.6);
    }

    > :global(.check-label) {
      color: rgba(100, 100, 100, 1);
    }
  }
</style>
