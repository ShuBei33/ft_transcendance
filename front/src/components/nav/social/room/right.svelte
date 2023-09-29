<script lang="ts">
  import { ui, data, token } from "$lib/stores";
  import { onMount } from "svelte";
  import { io } from "socket.io-client";
  import Message from "./message.svelte";
  import type { Socket } from "socket.io-client";
  import type { ChanUserExtended, ChannelMsg } from "$lib/models/prismaSchema";
  import { goto } from "$app/navigation";
  import { getChannelDropDownActions, getChannelMessageWriter } from "./right";
  import ActionButton from "../../../ActionButton.svelte";
  import Input from "../../../Input.svelte";
  import MessageFeed from "./messageFeed.svelte";
  import RightTemplate from "../rightTemplate.svelte";

  export let chatSocket: Socket;
  let value = "";
  $: chanUsr = $data.myChannels.find((chan) => chan.channel.id == $ui.chat.room.labelFocusId);
  $: messages = chanUsr?.channel.channelMsgs;
  // TODO
  // $: $ui.chat.room.textInputMap.set($ui.chat.room.labelFocusId, value);

  function handleSubmit() {
    if (!value.length) return "";
    chatSocket.emit("messageToRoom", {
      id: String($ui.chat.room.labelFocusId),
      message: value,
    });
    return "";
  }
</script>

<RightTemplate onSubmit={() => handleSubmit()} onChange={(_value) => (value = _value)}>
  <MessageFeed slot="feed" {messages} />
</RightTemplate>

<style lang="scss">
  .channel-message-header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
</style>
