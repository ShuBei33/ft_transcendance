<script lang="ts">
  export let actions: { label: string; callback: () => void }[] = [];
  export let showMenu = false;
</script>

<div class="action-button-wrapper">
  {#if showMenu}
    <div class="action-button-menu">
      {#each actions as action}
        <button class="action-button" on:click={() => action.callback()}
          >{action.label}</button
        >
      {/each}
    </div>
  {/if}
  <button class="action-button-toggle" on:click={() => (showMenu = !showMenu)}>
    <slot />
  </button>
</div>

<style lang="scss">
  .action-button-wrapper {
    position: relative;
    display: box;
    flex-direction: row;
  }
  .action-button-menu {
    position: absolute;
    transform: translate(-3em, 1em);
    background-color: whitesmoke;
    float: right;
    padding-top: 1em;
    padding-bottom: 1em;
    border: 1px solid black;
    overflow-x: hidden;
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
</style>
