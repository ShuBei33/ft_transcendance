<script lang="ts">
  import type { Friend } from "$lib/apiCalls";
  import type { Friendship, User } from "$lib/models/prismaSchema";
  import { user } from "$lib/stores";
  import GenericButton from "../../../genericButton.svelte";

  export let _Friend: Friend;
  export let data: {
    user?: User;
    friendShip: Friendship;
  };

  const getFriendShipUserContext = (friendShip: Friendship): User => {
    if (friendShip.senderId == $user?.id) return friendShip.receiver;
    return friendShip.sender;
  };

  const handleFriendShipAccept = async (friendShip: Friendship) => {
    await _Friend
      .resolveInvitation({
        accept: true,
        friendShipId: friendShip.id,
      })
      .then(({ data }) => {
        // console.log("accept ok !", data);
      })
      .catch((e) => {
        // console.log("error accept");
      });
  };

  const handleFriendShipDecline = async (friendShip: Friendship) => {
    await _Friend
      .resolveInvitation({
        accept: false,
        friendShipId: friendShip.id,
      })
      .then(({ data }) => {
        // console.log("decline ok !", data);
      })
      .catch((e) => {
        // console.log("error decline");
      });
  };
</script>

{#if data.friendShip}
  <div class="resolve-friend">
    {getFriendShipUserContext(data.friendShip).login}
    {#if data.friendShip.receiverId == $user?.id}
      <GenericButton on:click={() => handleFriendShipAccept(data.friendShip)}>
        accept
      </GenericButton>
      <GenericButton on:click={() => handleFriendShipDecline(data.friendShip)}>
        decline
      </GenericButton>
    {:else}
      {" -> invitation sent"}
    {/if}
  </div>
{/if}

<style lang="scss"></style>
