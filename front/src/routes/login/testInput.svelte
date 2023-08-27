<script lang="ts">
  import type { Field } from "svelte-forms/types";
  import type { HTMLInputAttributes } from "svelte/elements";
  import type { Writable } from "svelte/store";
  export let setter: (this: void, value: string) => any;
  export let attributes: Omit<HTMLInputAttributes, "value"> = {};
  let value = "";
  $: setter(value);
  // your script goes here
</script>

<main>
    <input class="large-rectangle-input" {...attributes} bind:value />
</main>

<style lang="scss">

</style>
