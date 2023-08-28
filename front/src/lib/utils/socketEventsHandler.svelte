<script lang="ts">
  import { onMount } from "svelte";
  import { token, user } from "$lib/stores";
  import { io } from "socket.io-client";
  import { ui } from "$lib/stores/ui";
  import { events } from "$lib/stores/socket";

  // events.set(socket);
</script>
