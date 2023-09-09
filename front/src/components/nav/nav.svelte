<script lang="ts">
  import NavButton from "./navButton.svelte";
  import type { ComponentProps } from "svelte";

  export let navItems: ComponentProps<NavButton>[] = [];
</script>

<nav class="mainNav">
  <span class="nav-buttons">
    {#each navItems as item}
      <NavButton name={item.name} href={item.href} />
    {/each}
  </span>
</nav>

<style lang="scss">
  .mainNav {
    display: flex;
    flex-direction: row;
    column-gap: 1em;
    justify-content: center;
  }

  .nav-buttons {
    display: flex;
    column-gap: 1em;
  }
  /* your styles go here */
</style>
