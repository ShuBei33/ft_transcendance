<script lang="ts">
  import { ui } from "$lib/stores/ui";
  import { Game } from "$lib/apiCalls";
  import GameInstance from "./gameInstance.svelte";
  import { axiosInstance } from "$lib/stores";
  import { get } from "svelte/store";
  import { user } from "$lib/stores";
  const handleQueueClick = async () => {
    if ($ui.game.state == "NONE")
      await _Game
        .join()
        .then(() => ($ui.game.state = "QUEUE"))
        .catch((e) => {
          console.log("queue error happened", e);
        });
    else
      await _Game
        .leave()
        .then(() => ($ui.game.state = "NONE"))
        .catch((e) => {
          console.log("leave queue error happened", e);
        });
  };
  const _Game = new Game(get(axiosInstance));
</script>

<main>
  <h1>play page</h1>
  {#if $ui.game.state == "PLAYING"}
    <svelte:component
      this={GameInstance}
      userId={$user && $user.id}
      gameId={$ui.game.id}
    />
  {:else}
    <button on:click={() => handleQueueClick()}
      >{$ui.game.state == "NONE" ? "Queue" : "Leave queue"}</button
    >
  {/if}
</main>

<style lang="scss">
</style>
