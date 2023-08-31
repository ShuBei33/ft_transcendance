<script lang="ts">
  import type { HTMLInputAttributes } from "svelte/elements";
  export let setter: (this: void, value: string) => any;
  export let attributes: Omit<HTMLInputAttributes, "value"> = {};
  let value = "";
  $: console.log(value);
  $: setter(value);
  // $: value = testval === value ? value : testval;
  // your script goes here
</script>

<main>
  <input {...attributes} bind:value />
</main>

<style lang="scss">
  /* your styles go here */
</style>
