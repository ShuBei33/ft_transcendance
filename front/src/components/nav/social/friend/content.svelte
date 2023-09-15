<script lang="ts">
  import { data } from "$lib/stores";
  import { onMount } from "svelte";
  import Tabs from "../tabs.svelte";
  import FriendCard from "./friendCard.svelte";
  import { Friend } from "$lib/apiCalls";

  const _Friend = new Friend();
</script>

<div class="social-modal-friend-content">
  <div class="friend-content">
    <div class="top">
      <Tabs />
    </div>
    {#each $data.friendShips as friendShip}
      <FriendCard
        data={{
          friendShip,
        }}
        {_Friend}
      />
    {/each}
  </div>
</div>

<style lang="scss">
  @import "../../../../lib/style/colors.scss";
  .social-modal-friend-content {
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
      "right right right"
      "right right right";
  }

  .friend-content {
    padding: 1em;
    display: flex;
    flex-direction: column;
  }
  .top {
    display: flex;
    flex-direction: row;
    column-gap: 0.5em;
    justify-content: center;
  }
</style>
