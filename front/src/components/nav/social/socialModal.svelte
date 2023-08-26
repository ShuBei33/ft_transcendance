<script lang="ts">
  import { ui } from "$lib/stores/ui";
  import LeftRoom from "./left-ROOM.svelte";
  const tabsName = ["DM", "ROOM", "FRIEND"] as const;
</script>

<main>
  {#if $ui.chat.toggle}
    <div class="social-modal">
      <div class="header" />
      <div class="left">
        <div class="top-left">
          {#each tabsName as tab}
            <button on:click={() => ($ui.chat.selected = tab)}>
              {tab}
            </button>
          {/each}
        </div>
        <svelte:component this={LeftRoom} />
      </div>
      <div class="right" />
    </div>
  {/if}
</main>

<style lang="scss">
  .social-modal {
    height: 744px;
    width: 875px;
    background-color: lightgrey;
    position: absolute;
    bottom: 3em;
    right: 1em;

    display: grid;
    grid-template-columns: 1.1fr 0.9fr 1fr;
    grid-template-rows: 0.5fr 1.5fr 1fr;
    gap: 0px 0px;
    grid-template-areas:
      "left header header"
      "left right right"
      "left right right";
  }

  .header {
    grid-area: header;
    display: flex;
    flex-direction: row;
    padding: 1em;
  }

  .left {
    grid-area: left;
    padding: 1em;
    display: flex;
    flex-direction: column;
  }

  .right {
    grid-area: right;
  }
  .top-left {
    display: flex;
    flex-direction: row;
    column-gap: 0.5em;
    justify-content: center;
  }
</style>
