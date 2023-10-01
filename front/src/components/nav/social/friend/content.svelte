<script lang="ts">
  import { data, ui, user } from "$lib/stores";
  import { onMount } from "svelte";
  import type { ComponentProps } from "svelte";
  import Tabs from "../tabs.svelte";
  import FriendCard from "./friendCard.svelte";
  import { Friend } from "$lib/apiCalls";
  import { StatusInv, UserStatus, type User } from "$lib/models/prismaSchema";
  import AvatarFrame from "../avatarFrame.svelte";
  import Divider from "../../../divider.svelte";
  import Typography from "../../../Typography.svelte";
  import Button from "../../../Button.svelte";
  import { handle } from "./handlers";
  import ActionButton from "../../../ActionButton.svelte";
  import { addAnnouncement } from "$lib/stores/session";
  const handler = new handle();
  const dropDown = class {
    friend(_friend: User): ComponentProps<ActionButton>["actions"] {
      return [
        {
          label: "unfriend",
          callback: async () => await handler.FriendshipRemove(_friend.id),
        },
        {
          label: "block",
          callback: async () => await handler.FriendShipBlock(_friend.id),
        },
      ];
    }
  };
  const actions = new dropDown();

  const sendMessage = (friend: User) => {
    const discussion = $data.discussions.find(
      (disc) => disc.userId1 == friend.id || disc.userId2 == friend.id
    );
    if (!discussion) {
      addAnnouncement({
        level: "error",
        message: "An unexpected error occurred",
      });
      return;
    }
    $ui.chat.dm.labelFocusId = discussion.id;
    $ui.chat.selected = "DM";
  };
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

  // Blocked
  $: allBlocked = $data.friendShips.filter(
    (friendship) => friendship.inviteStatus == StatusInv.BLOCKED
  );
  $: hasBlocked = allBlocked.filter((friendship) => {
    const isUserSender = friendship.senderId == $user?.id;
    if (isUserSender) return friendship.receiverIsBlocked;
    return friendship.senderIsBlocked;
  });
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
              <Button on:click={() => sendMessage(friend)}>
                <Typography>{"Send message"}</Typography>
              </Button>
              <ActionButton actions={actions.friend(friend)}>
                <Typography>{"..."}</Typography>
              </ActionButton>
            </div>
          </div>
        {/each}
      {/if}
      <!-- Blocked -->
      {#if hasBlocked.length}
        <Divider>
          <Typography slot="title">
            {`blocked ${hasBlocked.length}`}
          </Typography>
        </Divider>
        {#each hasBlocked as friendship}
          <div class="friend-card">
            <AvatarFrame userId={String(friendship.receiverId)} />
            <div class="actions">
              <Button variant="error" on:click={() => handler.FriendShipUnBlock(friendship)}>
                <Typography>{"Unblock"}</Typography>
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
