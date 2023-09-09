<script lang="ts">
  import type { Game as GameType } from "$lib/models/prismaSchema";
  import AvatarFrame from "../../../components/nav/social/avatarFrame.svelte";
  export let history: GameType[] = [];
  export let profileOfUserId: string;
  $: console.log("!hsitory", history);
</script>

<div class="match-history-wrapper">
  {#each history as match}
    <div class="one-match">
      <AvatarFrame userId={String(match.lhsPlayerId)} />
      <AvatarFrame userId={String(match.rhsPlayerId)} />
    </div>
  {/each}
</div>

<style lang="scss">
  .one-match {
    display: flex;
    background-color: red;
  }
</style>
