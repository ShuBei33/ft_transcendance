<script lang="ts">
  import { data } from "$lib/stores";
  import { onMount } from "svelte";
  import Tabs from "../tabs.svelte";
  import FriendCard from "./friendCard.svelte";
  import { Friend } from "$lib/apiCalls";

  const _Friend = new Friend();
  onMount(() => {
    console.log("friend data !", $data);
  });
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
  .social-modal-friend-content {
    height: 80vh;
    width: 875px;
    background-color: lightgrey;
    position: absolute;
    bottom: 3em;
    right: 1em;
  }

  .friend-content {
    padding: 1em;
    display: flex;
    flex-direction: column;
  }
  .top {
    display: flex;
  }
</style>
