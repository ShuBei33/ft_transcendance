<script lang="ts">
  import AvatarFrame from "../../../components/nav/social/avatarFrame.svelte";
  import { user as myUser } from "$lib/stores";
  import { Friend } from "$lib/apiCalls";
  import { data as dataStore } from "$lib/stores";

  export let data;
  const _Friend = new Friend();
  console.log("profile");

  const handleAddFriend = async (receiverId: number) => {
    console.log("+++++id is", id);
    await _Friend
      .sendInvitation(receiverId)
      .then(({ data }) => {
        $dataStore.friendShips = [...$dataStore.friendShips, data.data];
        // console.log("ok friendship", friendship);
      })
      .catch((e) => {
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
