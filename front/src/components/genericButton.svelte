<script lang="ts">
  let className = "generic-button";

  // creates a `class` property, even
  // though it is a reserved word
  export { className as class };
</script>

<button class={className} on:click|preventDefault>
  <slot />
</button>

<style lang="scss">
  .generic-button {
    padding: 0.5em;
  }
</style>
