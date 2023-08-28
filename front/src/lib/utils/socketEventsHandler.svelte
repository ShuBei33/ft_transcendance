<script lang="ts">
  import { onMount } from "svelte";
  import { token, user } from "$lib/stores";
  import { io } from "socket.io-client";
  import { ui } from "$lib/stores/ui";
  import { events } from "$lib/stores/socket";

  onMount(() => {
    if ($events) return;
    const socket = io("http://localhost:5500/chat", {
      auth: {
        token: $token,
      },
    }).on("connect", () => {
        console.log("connect ok");
      })
      .on("message", (data: any) => {
        console.log("message received", data);
      });
    $events = socket;
    // .on(String($user?.id!), (data: { expect: string; data: any }) => {
    //   switch (data.expect) {
    //     case "GAME_ID":
    //       $ui.game.id = Number(data.data);
    //       break;
    //     default:
    //       break;
    //   }
    // })
    // .on("message", (data: any) => {
    //   console.log("message received", data);
    // });
  });
  // $: myEvent = String($user?.id) || "";
</script>
