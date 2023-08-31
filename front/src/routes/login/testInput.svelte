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
  <input {...attributes} bind:value on:input={handleInputChange} />
</main>

<style lang="scss">
  /* your styles go here */
</style>
