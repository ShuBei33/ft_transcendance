<script lang="ts">
  import { onMount } from "svelte";
  import { Socket, io } from "socket.io-client";
  import type { DefaultSettings } from "$lib/models/game";
  import draw from "./draw";

  export let gameId: number = -1;
  export let userId: number = -1;
  let gameData: DefaultSettings | undefined = undefined;
  let _canvas: HTMLCanvasElement;
  let socket: Socket;
  $: context = _canvas != undefined && _canvas.getContext("2d");
  function onKeyPressed(e: { key: string; down: boolean }) {
    if (!socket || (e.key != "a" && e.key != "d")) return;
    socket.emit("keyStroke", e);
    // switch (e.key) {
    //   case "a":
    //     socket.emit("moveLeft");
    //     break;
    //   case "d":
    //     socket.emit("moveRight");
    //     break;
    //   default:
    //     break;
    // }
  }

  onMount(() => {
    socket = io("http://localhost:5500")
      .emit("identification", { userId, gameId })
      .on(`game: ${String(gameId)}`, (data) => {
        switch (data.expect) {
          case "update":
            gameData = data.data;
            draw(_canvas, context, gameData);
            break;
          default:
            break;
        }
      })
      .on("disconnect", () => {
        gameData = undefined;
      });
    if (gameId != -1 && userId != -1)
      socket.emit("joinGame", { userId, gameId });
  });
</script>

<svelte:window
  on:keydown={(e) => onKeyPressed({ key: e.key, down: true })}
  on:keyup={(e) => onKeyPressed({ key: e.key, down: false })}
/>
{#if gameData}
  <h1>{gameData.playerOnePoints}</h1>
  <canvas
    bind:this={_canvas}
    id="game_canvas"
    width={`${gameData.width}px`}
    height={`${gameData.height}px`}
  />
  <h1>{gameData.playerTwoPoints}</h1>
{:else}
  <div class="canvas-loading-pulse">
    <div class="pulse-rectangle" />
  </div>
{/if}

<style lang="scss">
  .canvas-loading-pulse {
    position: relative;
    background-color: lightgray;
    height: 600px;
    width: 800px;
    overflow: hidden;
  }

  .pulse-rectangle {
    position: absolute;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      to right,
      rgba(255, 255, 255, 0) 0%,
      rgb(255, 255, 255) 50%,
      rgba(255, 255, 255, 0) 100%
    );
    animation: pulseAnimation 1.5s linear infinite;
  }

  @keyframes pulseAnimation {
    0% {
      transform: translateX(-100%);
    }
    100% {
      transform: translateX(100%);
    }
  }
</style>
