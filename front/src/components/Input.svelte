<script lang="ts">
  import { onMount } from "svelte";
  import type { HTMLInputAttributes } from "svelte/elements";

  export let onChange: (value: string) => void = () => {};
  export let attributes: Omit<HTMLInputAttributes, "value"> = {};
  export let value = "";

  function handleInputChange(event: Event) {
    const target = event.target as HTMLInputElement;
    value = target.value;
    onChange(value);
  }
</script>

<main>
  <input
    class="basic-input"
    {...attributes}
    bind:value
    on:input={handleInputChange}
  />
</main>

<style lang="scss">
  .basic-input {
    border: 0;
    border-radius: 0.5em;
    background-color: rgba(0, 0, 0, 0.3);
    padding: 0.5em;
    color: white;
    &::placeholder {
      color: white;
    }
    &:focus {
      background-color: rgba(0, 0, 0, 0.5);
    }
  }
  /* your styles go here */
</style>
