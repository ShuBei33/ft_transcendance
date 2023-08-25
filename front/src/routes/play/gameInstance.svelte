<script lang="ts">
  import { onMount } from "svelte";
  import { io } from "socket.io-client";
  import type { DefaultSettings } from "$lib/models/game";
  import draw from "./draw";

  export let gameId: number = -1;
  export let userId: number = -1;
  let gameData: DefaultSettings | undefined = undefined;
  let _canvas: HTMLCanvasElement;
  $: context = _canvas != undefined && _canvas.getContext("2d");

  onMount(() => {
    const socket = io("http://localhost:5500")
      .emit("identification", { userId, gameId })
      .on(`game: ${String(gameId)}`, (data) => {
        switch (data.expect) {
          case "update":
            gameData = data.data;
            draw(_canvas, context, gameData);
            console.log(data);
            break;
          default:
            break;
        }
      });
    if (gameId != -1 && userId != -1)
      socket.emit("joinGame", { userId, gameId });
  });
</script>

<h1>Game</h1>
{#if gameData}
  <canvas
    bind:this={_canvas}
    id="game_canvas"
    width={`${gameData.width}px`}
    height={`${gameData.height}px`}
  />
{:else}
  <h1>No game data</h1>
{/if}

<style lang="scss">
</style>
