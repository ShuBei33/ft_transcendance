<script lang="ts">
  import type { Socket } from "socket.io-client";
  import MessageFeed from "./messageFeed.svelte";
  import RightTemplate from "../rightTemplate.svelte";
  import { data, ui } from "$lib/stores";
  import { onMount } from "svelte";
  let chatSocket: Socket;
  let value = "";

  function handleSubmit() {
    return "";
  }

  $: discussion = (() => {
    if ($ui.chat.dm.labelFocusId == -1) return $data.discussions[0];
    return $data.discussions.find(
      (disc) => disc.id == $ui.chat.dm.labelFocusId
    );
  })();
  $: console.log("T+T++T+T+T+T", discussion);
</script>

<RightTemplate
  onSubmit={() => handleSubmit()}
  onChange={(_value) => (value = _value)}
>
  <MessageFeed slot="feed" />
</RightTemplate>
