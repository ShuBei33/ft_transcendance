<script lang="ts">
  import { ui } from "$lib/stores/ui";
  import { Game } from "$lib/apiCalls";
  import GameInstance from "./gameInstance.svelte";
  import { axiosInstance } from "$lib/stores";
  import { get } from "svelte/store";
  import { user } from "$lib/stores";
  import Typography from "../../components/Typography.svelte";
  import Button from "../../components/Button.svelte";
  import ChromaSelector from "./chromaSelector.svelte";
  const handleQueueClick = async () => {
    if ($ui.game.state == "NONE")
      await _Game
        .joinQueue()
        .then(() => ($ui.game.state = "QUEUE"))
        .catch((e) => {
          // console.log("queue error happened", e);
        });
    else
      await _Game
        .leaveQueue()
        .then(() => ($ui.game.state = "NONE"))
        .catch((e) => {
          // console.log("leave queue error happened", e);
        });
  };
  const _Game = new Game();
</script>

<main>
  <Typography big class="... title"><h1>{"Lobby"}</h1></Typography>
  {#if $ui.game.state == "PLAYING"}
    <svelte:component this={GameInstance} userId={$user && $user.id} gameId={$ui.game.id} />
  {:else}
    <svelte:component this={ChromaSelector} />
    <span class="playBtn">
      <Button on:click={() => handleQueueClick()}
        ><Typography>
          {$ui.game.state == "NONE" ? "Queue" : "Leave queue"}
        </Typography></Button
      >
    </span>
    {#if $ui.game.state == "COUNTDOWN"}
      <Typography>{`Game starts in ${$ui.game.countDown.data.secondsLeft}`}</Typography>
      {:else}
        <h1>{"wtf im doing here ?!"}</h1>
    {/if}
  {/if}
</main>

<style lang="scss">
  // $: console.log("!hsitory", history);
  main {
    display: flex;
    justify-content: center;
    flex-direction: column;
  }
  .title {
    display: flex;
  }
  .playBtn {
    position: absolute;
    bottom: 4em;
    left: 50vw;
  }
</style>
