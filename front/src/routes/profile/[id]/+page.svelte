<script lang="ts">
  export let data;
  console.log("profile");

  const { id, user } = data;
</script>

<main>
  {#if user}
    <h1>Profile page {user?.pseudo}</h1>
  {:else}
    <h1>{`User not found`}</h1>
  {/if}
</main>

<style lang="text/scss"></style>
