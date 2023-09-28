<script lang="ts">
  import type { Socket } from "socket.io-client";
  import MessageFeed from "./messageFeed.svelte";
  import RightTemplate from "../rightTemplate.svelte";
  import { data, ui, user } from "$lib/stores";
  import { onMount } from "svelte";
  import type { DiscussionLite } from "$lib/models/discussion";
  import Typography from "../../../Typography.svelte";
  export let chatSocket: Socket;
  let value = "";

  type emitMessageType = {
    senderId: string;
    receiverId: string;
    message: string;
  };

  $: handleSubmit = () => {
    const receiverId = String(
      discussion?.userId1 == $user?.id
        ? discussion?.userId2
        : discussion?.userId1
    );
    const payload: emitMessageType = {
      senderId: String($user?.id),
      receiverId,
      message: value,
    };
    chatSocket?.emit("message", payload);
    value = "";
    return value;
  };

  $: discussion = (() => {
    if ($ui.chat.dm.labelFocusId == -1 && $data.discussions.length) {
      if ($data.discussions[0].discussionsMsgs.length)
        $ui.chat.dm.labelFocusId = $data.discussions[0].id;
    }
    return $data.discussions.find(
      (disc) => disc.id == $ui.chat.dm.labelFocusId
    );
  })();
  $: messages = discussion?.discussionsMsgs;
  $: console.log("+!+! messages", messages);
</script>

<RightTemplate
  onSubmit={() => handleSubmit()}
  onChange={(_value) => (value = _value)}
  showPlaceHolder={$ui.chat.dm.labelFocusId == -1}
>
  <MessageFeed slot="feed" {messages} />
  <img slot="placeholder" src="/images/nocontent.gif" />
  <!-- <Typography slot="placeholder">{"test"}</Typography> -->
</RightTemplate>
