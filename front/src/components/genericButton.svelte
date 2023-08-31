<script lang="ts">
</script>

<button class="generic-button" on:click|preventDefault>
  <slot />
</button>

<style lang="scss">
  .generic-button {
    padding: 0.5em;
  }
</style>
