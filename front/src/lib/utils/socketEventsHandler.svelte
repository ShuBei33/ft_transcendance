<script lang="ts">
  import { onMount } from "svelte";
  import { token, user } from "$lib/stores";
  import { io } from "socket.io-client";
  import { ui } from "$lib/stores/ui";
  import { events } from "$lib/stores/socket";

  onMount(() => {
    events.set(
      io("http://localhost:5500", {
        auth: {
          token: $token,
        },
      })
        .on("connect", () => {
          console.log("connect ok");
        })
        .on("disconnect", () => {
          console.log("I identify as disconnected");
        })
        .on("message", (data: any) => {
          console.log("message received", data);
        })
    );
  });
</script>
