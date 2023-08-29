<script lang="ts">
  import { ui, data } from "$lib/stores";
  import LeftRoom from "./room/left.svelte";
  import RightRoom from "./room/right.svelte";
  import { classNames, type ClassNamesObject } from "$lib/utils/classNames/";
  import { onMount } from "svelte";
  import type { Socket } from "socket.io-client";

  export let chatSocket: Socket | undefined;
  const tabsName = ["DM", "ROOM", "FRIEND"] as const;

  $: tabClassNameObject = (name: string): ClassNamesObject => {
    return {
      "tab-toggle": true,
      active: $ui.chat.selected == name,
    };
  };
</script>

<main>
  {#if $ui.chat.toggle && chatSocket}
    <div class="social-modal">
      <div class="header" />
      <div class="left">
        <div class="top-left">
          {#each tabsName as tab}
            <button
              class={classNames(tabClassNameObject(tab))}
              on:click={() => ($ui.chat.selected = tab)}
            >
              {tab}
            </button>
          {/each}
        </div>
        {#if $ui.chat.selected == "ROOM"}
          <svelte:component this={LeftRoom} />
        {:else if false}
          <!-- else if content here -->
        {:else}
          <!-- else content here -->
        {/if}
      </div>
      <div class="right">
        {#if $ui.chat.selected == "ROOM"}
          <svelte:component this={RightRoom} {chatSocket} />
        {:else if false}
          <!-- else if content here -->
        {:else}
          <!-- else content here -->
        {/if}
      </div>
    </div>
  {/if}
</main>

<style lang="scss">
  .social-modal {
    height: 80vh;
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
    gap: 0.5em;
  }

  .right {
    grid-area: right;
    padding: 1em;
  }
  .top-left {
    display: flex;
    flex-direction: row;
    column-gap: 0.5em;
    justify-content: center;
  }

  .tab-toggle {
    cursor: pointer;
    padding: 0.5em;
    &:hover {
      background-color: grey;
    }
  }

  .active {
    background-color: grey;
  }
</style>
