<script lang="ts">
  import { onMount } from "svelte";
  import { Socket, io } from "socket.io-client";
  import { ui, user } from "$lib/stores";
  import type { DefaultSettings } from "$lib/models/game";
  import draw from "./draw";
  import { goto } from "$app/navigation";
  import { uiInitialValue } from "$lib/stores/ui";

  export let gameId: number = -1;
  export let userId: number = -1;
  let gameData: DefaultSettings | undefined = undefined;
  let _canvas: HTMLCanvasElement;
  let socket: Socket;
  $: context = _canvas != undefined && _canvas.getContext("2d");
  function onKeyPressed(e: { key: string; down: boolean }) {
    if (!socket) return;
    if (!(e.key == $ui.game.controls.up || e.key == $ui.game.controls.down)) return;
    const key = e.key == $ui.game.controls.up ? "a" : "d";
    // console.log("!!!!!!!!!!!!key", key);
    // console.log(e.key);
    socket.emit("keyStroke", { ...e, key });
  }

  onMount(() => {
    socket = io("http://localhost:5500/game")
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
        $ui.game.id = uiInitialValue.game.id;
        $ui.game.state = "NONE";
      });
    if (gameId != uiInitialValue.game.id && userId != -1)
      socket.emit("joinGame", { userId, gameId, chroma: $ui.game.selectedChroma });
  });
</script>

<svelte:window
  on:keydown={(e) => onKeyPressed({ key: e.key, down: true })}
  on:keyup={(e) => onKeyPressed({ key: e.key, down: false })}
/>
{#if gameData}
  <h1>{gameData.playerOnePoints}</h1>
  <div class="pong-table">
    <canvas
      bind:this={_canvas}
      id="game_canvas"
      width={`${gameData.width}px`}
      height={`${gameData.height}px`}
    />
  </div>
  <h1>{gameData.playerTwoPoints}</h1>
{:else}
  <div class="canvas-loading-pulse">
    <div class="pulse-rectangle" />
  </div>
{/if}

<style lang="scss">
  .pong-table {
    display: flex;
    justify-content: center;
    align-items: center;
    transform: rotate(90deg);
  }
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
