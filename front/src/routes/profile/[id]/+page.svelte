<script lang="ts">
  import AvatarFrame from "../../../components/nav/social/avatarFrame.svelte";
  import { user as myUser } from "$lib/stores";

  export let data;
  console.log("profile");

  const { id, user } = data;
</script>

<main>
  {#if user && $myUser}
    {#if Number(id) == $myUser?.id}
      <AvatarFrame userId={id} />
    {:else}
      <AvatarFrame userId={id} />
      <button class="generic-button">add friend</button>
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
