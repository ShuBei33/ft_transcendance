<script lang="ts">
  import { ui } from "$lib/stores/ui";
  import { Game } from "$lib/apiCalls";
  import { axiosInstance } from "$lib/stores";
  import { get } from "svelte/store";
  const handleQueueClick = async () => {
    if ($ui.game.state == "NONE")
      await _Game.join().then(() => ($ui.game.state = "QUEUE"));
    else
      await _Game.leave().then(() => ($ui.game.state = "NONE"));
  };
  const _Game = new Game(get(axiosInstance));
</script>

<main>
  <h1>play page</h1>
  <button on:click={() => handleQueueClick()}
    >{$ui.game.state == "NONE" ? "Queue" : "Leave queue"}</button
  >
</main>

<style lang="scss">
</style>
