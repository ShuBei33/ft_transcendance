<script lang="ts">
  import { onMount } from "svelte";
  import { user } from "$lib/stores";
  import { io } from "socket.io-client";
  import { ui } from "$lib/stores/ui";

  type expectGameId = string;

  onMount(() => {
    const events = io("http://localhost:5500");
    events.on(String($user?.id!), (data: { expect: string; data: any }) => {
      switch (data.expect) {
        case "GAME_ID":
          $ui.game.id = Number(data.data);
          break;
        default:
          break;
      }
    });
  });
  // $: myEvent = String($user?.id) || "";
</script>
