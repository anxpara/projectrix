<script lang="ts">
  import type { Options } from '$lib/options';
  import { createCheckbox, melt } from '@melt-ui/svelte';
  import { getContext } from 'svelte';
  import type { Writable } from 'svelte/store';

  export let name: string;
  export let irrelevant: boolean = false;

  const options = getContext<Writable<Options>>('options');

  const {
    elements: { root, input },
  } = createCheckbox({
    defaultChecked: $options[name],
    onCheckedChange: ({ curr, next }) => {
      if (next === 'indeterminate') return curr;
      $options[name] = next;
      return next;
    },
  });
</script>

<div class="check-container {name}">
  <button
    use:melt={$root}
    class="check-button {name}"
    class:checked={$options[name]}
    class:irrelevant
    id="checkbox-{name}"
  >
    <input use:melt={$input} />
  </button>
  <label for="checkbox-{name}" class="check-label" class:irrelevant> {name} </label>
</div>

<style lang="scss">
  .check-container {
    display: flex;
    align-items: center;
    gap: 0.5em;

    font-weight: 600;
  }

  .check-button {
    width: 1.4em;
    height: 1.4em;
    border: solid 3px coral;
    padding: 0;

    background-color: #111521;
    cursor: pointer;
  }

  .check-button.checked {
    background-color: rgba(255, 127, 80, 0.6);
  }

  .check-button.irrelevant {
    border-color: rgba(100, 100, 100, 1);
  }
  .check-button.checked.check-button.irrelevant {
    background-color: rgba(100, 100, 100, 0.6);
  }
  label.irrelevant {
    color: rgba(100, 100, 100, 1);
  }

  .check-label {
    cursor: pointer;
  }

  .hideUI {
    color: red;
    border-color: red;
  }
</style>
