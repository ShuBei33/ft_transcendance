<script lang="ts">
  import { onMount } from "svelte";
  import type { HTMLInputAttributes } from "svelte/elements";

  let className: string | undefined = undefined;
  export { className as class };

  onMount(() => {
    if (className == undefined) className = "basic-input";
  });

  type onSubmitType = (value?: string) => string;
  export let onChange: (value: string) => void = () => {};
  export let onSubmit: onSubmitType | undefined = undefined;
  export let attributes: Omit<HTMLInputAttributes, "value"> = {};
  export let value = "";

  function handleInputChange(event: Event) {
    const target = event.target as HTMLInputElement;
    value = target.value;
    onChange(value);
  }

  function handleKeyPress(key: string) {
    if (key != "Enter") return;
    value = onSubmit!(value);
  }
</script>

{#if onSubmit}
  <input
    class={className}
    {...attributes}
    bind:value
    on:input={handleInputChange}
    on:keypress={(k) => handleKeyPress(k.key)}
  />
{:else}
  <input
    class={className}
    {...attributes}
    bind:value
    on:input={handleInputChange}
  />
{/if}

<style lang="scss">
  @use "../lib/style/mixins.scss" as mix;
  .basic-input {
    @include mix.input-style();
  }
  /* your styles go here */
</style>
