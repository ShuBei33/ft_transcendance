<script lang="ts">
  import { ui, data } from "$lib/stores";
  import LeftRoom from "./room/left.svelte";
  import RightRoom from "./room/right.svelte";
  import FriendContent from "./friend/content.svelte";
  import Tabs from "./tabs.svelte";
  import type { Socket } from "socket.io-client";
  import Test from "./dm/test.svelte";
  import Header from "./room/header.svelte";

  export let chatSocket: Socket | undefined;
</script>

<main>
  {#if $ui.chat.toggle && chatSocket}
    {#if $ui.chat.selected == "FRIEND"}
      <svelte:component this={FriendContent} />
    {:else}
      <div class="social-modal">
        <div class="header">
          {#if $ui.chat.selected == "ROOM"}
            <svelte:component this={Header} />
          {/if}
        </div>
        <div class="left">
          <div class="top-left">
            <Tabs />
          </div>
          {#if $ui.chat.selected == "ROOM"}
            <svelte:component this={LeftRoom} />
          {:else}{/if}
        </div>
        <div class="right">
          {#if $ui.chat.selected == "ROOM"}
            <svelte:component this={RightRoom} {chatSocket} />
          {:else}
            <svelte:component this={Test} {chatSocket} />
          {/if}
        </div>
      </div>
    {/if}
  {/if}
</main>

<style lang="scss">
  @import "../../../lib/style/colors.scss";
  .social-modal {
    height: 80vh;
    width: 875px;
    background-color: $shipsOfficer;
    border: 2px solid black;
    position: absolute;
    border-radius: 0.5em;
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
    height: calc(100% - 2em);
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
