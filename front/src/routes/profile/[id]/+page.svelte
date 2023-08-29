<script lang="ts">
  import AvatarFrame from "../../../components/nav/social/avatarFrame.svelte";

  export let data;
  console.log("profile");

  const { id, user } = data;
</script>

<main>
  {#if user}
    <AvatarFrame userId={id} />
  {:else}
    <h1>{`User not found`}</h1>
  {/if}
</main>

<style lang="text/scss"></style>
