<script lang="ts">
  import Typography from "../Typography.svelte";

  export let name = "";
  export let href = "";
</script>

<main>
  <a {href}
    ><Typography big preventDefaultToggle={false}>
      {name}
    </Typography></a
  >
</main>

<style lang="scss">
  @use "../../lib/style/mixins.scss" as mix;
  a {
    text-decoration: none;
    color: inherit;
    cursor: pointer;
    @include mix.button-style(rgba(255, 255, 255, 0.1));
  }
</style>
