<script lang="ts">
  import Button from "./Button.svelte";
  import Typography from "./Typography.svelte";

  export let actions: { label: string; callback: () => void }[] = [];
  export let showMenu = false;
</script>

<div class="action-button-wrapper">
  {#if showMenu}
    <div class="action-button-menu">
      {#each actions as action}
        <Button  class="... dropdownBtn" on:click={() => action.callback()}>
          <Typography>
            {action.label}
          </Typography>
        </Button>
      {/each}
    </div>
  {/if}
  <button class="action-button-toggle" on:click={() => (showMenu = !showMenu)}>
    <slot />
  </button>
</div>

<style lang="scss">
  @import '../../src/lib/style/colors.scss';
  .action-button-wrapper {
    position: relative;
    display: box;
    flex-direction: row;
  }
  .action-button-menu {
    position: absolute;
    transform: translate(-3em, 1em);
   background-color: darken($slateMarine, 4%);
    float: right;
    padding-top: 1em;
    padding-bottom: 1em;
    border: 1px solid black;
    border-radius: 0.3em;
    overflow-x: hidden;
    padding: 0.2em;
    display: flex;
    flex-direction: column;
    row-gap: 0.2em;
  }
  .action-button-toggle,
  .action-button {
    all: unset;
    &:focus {
      outline: invert;
    }
    cursor: pointer;
  }
  .action-button {
    padding-left: 1em;
    padding-right: 1em;
    background-color: whitesmoke;
    width: 100%;
    &:hover {
      background-color: lightgrey;
    }
    &:active {
      background-color: grey;
    }
  }
  :global(.dropdownBtn) {
    width: 100%;
  }
</style>
