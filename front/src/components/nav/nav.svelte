<script lang="ts">
  import NavButton from "./navButton.svelte";
  import type { ComponentProps } from "svelte";

  export let navItems: ComponentProps<NavButton>[] = [];
</script>

<nav class="mainNav">
  {#each navItems as item}
    <NavButton name={item.name} href={item.href} />
  {/each}
</nav>

<style lang="scss">
  .mainNav {
    display: flex;
    flex-direction: row;
    column-gap: 1em;
  }
  /* your styles go here */
</style>
