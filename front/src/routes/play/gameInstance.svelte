<script lang="ts">
  import { onMount } from "svelte";
  import { io } from "socket.io-client";

  export let gameId: number = -1;
  export let userId: number = -1;
  onMount(() => {
    const socket = io("http://localhost:5500");
    if (gameId != -1 && userId != -1)
      socket.emit("joinGame", { userId, gameId });
  });
</script>

<h1>Game</h1>

<style lang="scss">
</style>
