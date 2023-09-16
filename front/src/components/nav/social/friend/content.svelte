<script lang="ts">
  import { data, user } from "$lib/stores";
  import { onMount } from "svelte";
  import Tabs from "../tabs.svelte";
  import FriendCard from "./friendCard.svelte";
  import { Friend } from "$lib/apiCalls";
  import { StatusInv, UserStatus } from "$lib/models/prismaSchema";
  import AvatarFrame from "../avatarFrame.svelte";
  import Divider from "../../../divider.svelte";
  import Typography from "../../../Typography.svelte";
  import Button from "../../../Button.svelte";
  import { handle } from "./handlers";

  const handler = new handle();
  // Pending
  $: pending = $data.friendShips.filter(
    (friendship) => friendship.inviteStatus == StatusInv.PENDING
  );
  $: countReceivedInvites = pending.filter(
    (friendship) => friendship.receiverId == $user?.id
  ).length;
  $: countSentInvites = pending.filter((friendship) => friendship.receiverId != $user?.id).length;
  // Accepted
  $: onlineFriends = $data.friends.filter((user) => user.status == UserStatus.ONLINE);
  $: blocked = $data.friendShips.filter(
    (friendship) => friendship.inviteStatus == StatusInv.BLOCKED
  );
  $: console.log(pending, blocked);
</script>

<div class="social-modal-friend-content">
  <div class="top">
    <div class="tabs">
      <Tabs />
    </div>
  </div>
  <div class="friend-content">
    <div class="content">
      <!-- Pending -->
      {#if pending.length && countReceivedInvites}
        <Divider>
          <Typography slot="title">
            {`pending ${countReceivedInvites}`}
          </Typography>
        </Divider>
        {#each pending as friendship}
          {#if friendship.receiverId == $user?.id}
            <div class="friend-card">
              <AvatarFrame userId={String(friendship.senderId)} />
              <div class="actions">
                <Button variant="success" on:click={() => handler.FriendshipAccept(friendship)}>
                  <Typography>{"Accept"}</Typography>
                </Button>
                <Button variant="error" on:click={() => handler.FriendshipDecline(friendship)}>
                  <Typography>{"Decline"}</Typography>
                </Button>
              </div>
            </div>
          {/if}
        {/each}
      {/if}
      <!-- Accepted -->
      <!-- Online -->
      {#if onlineFriends.length}
        <Divider>
          <Typography slot="title">
            {`online ${onlineFriends.length}`}
          </Typography>
        </Divider>
        {#each onlineFriends as friend}
          <div class="friend-card">
            <AvatarFrame userId={String(friend.id)} />
            <div class="actions">
              <Button>
                <Typography>{"Send message"}</Typography>
              </Button>
            </div>
          </div>
        {/each}
      {/if}
    </div>
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

  .content {
    display: flex;
    flex-direction: column;
    // width: inherit;
    height: 100%;
    // background-color: red;
  }

  .friend-content {
    padding: 1em;
    display: flex;
    flex-direction: column;
    grid-area: right;
  }
  .top {
    grid-area: left;
    padding: 1em;
    .tabs {
      display: flex;
      flex-direction: row;
      column-gap: 0.5em;
      justify-content: center;
    }
  }

  .friend-card {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: 0.5em;
    .actions {
      display: flex;
      flex-direction: row;
      column-gap: 0.5em;
      padding: inherit;
    }
  }
</style>
