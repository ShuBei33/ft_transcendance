<script lang="ts">
  export let name = "";
  export let href = "";

  console.log(href);
</script>

<main>
  <a {href}>{name}</a>
</main>

<style lang="scss">
  a {
    text-decoration: none;
    color: inherit;
    cursor: pointer;
  }
</style>
