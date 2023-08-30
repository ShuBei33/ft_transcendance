<script lang="ts">
  import AvatarFrame from "../../../components/nav/social/avatarFrame.svelte";
  import { user as myUser } from "$lib/stores";
  import { Friend } from "$lib/apiCalls";
  import { data as dataStore } from "$lib/stores";
  import { addAnnouncement } from "$lib/stores/session";

  export let data;
  const _Friend = new Friend();
  console.log("profile");

  const handleAddFriend = async (receiverId: number) => {
    await _Friend
      .sendInvitation(receiverId)
      .then(({ data }) => {
        $dataStore.friendShips = [...$dataStore.friendShips, data.data];
        addAnnouncement({
          message: "Friend request sent",
          level: "success",
        });
      })
      .catch((e) => {
        addAnnouncement({
          message: "Failed to send friend request",
          level: "error",
        });
        console.log("error happened", e);
      });
  };
  const { id, user } = data;
</script>

<main>
  {#if user && $myUser}
    {#if Number(id) == $myUser?.id}
      <AvatarFrame userId={id} />
    {:else}
      <AvatarFrame userId={id} />
      <button
        class="generic-button"
        on:click={() => handleAddFriend(Number(id))}>add friend</button
      >
      <button
        class="generic-button"
        on:click={() =>
          addAnnouncement({
            message: "test",
            level: "success",
          })}
      >
        test notify
      </button>
      {user.id}
    {/if}
  {:else}
    <h1>{`User not found`}</h1>
  {/if}
</main>

<style lang="text/scss">
  .generic-button {
    padding: 0.5em;
  }
</style>
