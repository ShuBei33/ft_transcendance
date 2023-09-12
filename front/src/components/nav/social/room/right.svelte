<script lang="ts">
  import { ui, data, token } from "$lib/stores";
  import { onMount } from "svelte";
  import { io } from "socket.io-client";
  import Message from "./message.svelte";
  import type { Socket } from "socket.io-client";
  import type { ChanUserExtended, ChannelMsg } from "$lib/models/prismaSchema";
  import { goto } from "$app/navigation";
  import { getChannelDropDownActions, getChannelMessageWriter } from "./right";
  import ActionButton from "../../../actionButton.svelte";
  import Input from "../../../Input.svelte";
  import MessageFeed from "./messageFeed.svelte";

  export let chatSocket: Socket;
  let value = "";
  $: chanUsr = $data.myChannels.find((chan) => chan.channel.id == $ui.chat.room.labelFocusId);
  $: messages = chanUsr?.channel.channelMsgs;
  $: $ui.chat.room.textInputMap.set($ui.chat.room.labelFocusId, value);

  function handleSubmit() {
    chatSocket.emit("messageToRoom", {
      id: String($ui.chat.room.labelFocusId),
      message: value,
    });
    return "";
  }
</script>

<div class="messages-container">
  <div class="messages-section">
    <MessageFeed {messages} />
  </div>
  <div class="input-section">
    <Input
      attributes={{
        id: "chatInput",
        type: "text",
        placeholder: "",
        name: "chatInput",
      }}
      class="chat-input"
      onChange={(_value) => (value = _value)}
      onSubmit={handleSubmit}
    />
    <!-- <input bind:value on:keypress={(k) => handleInput(k.key)} /> -->
  </div>
</div>

<style lang="scss">
  @use "../../../../lib/style/colors.scss";
  @use "../../../../lib/style/mixins.scss" as mix;
  .messages-container {
    background-color: colors.$slateMarine;
    height: 100%;
    display: grid;
    grid-template-rows: 6fr auto;
    overflow: hidden;
  }
  .messages-section {
    overflow-y: scroll;
    height: 100%;
  }
  .input-section {
    background-color: colors.$slateMarine;
    display: flex;
    justify-content: center;
    padding: 0.5em;
    max-height: 3em;
  }
  .channel-message-header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
  .message-user-pseudo {
    all: unset;
    &:focus {
      outline: revert;
    }
    &:hover {
      color: grey;
    }
    cursor: pointer;
  }
</style>
