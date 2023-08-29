<script lang="ts">
  import { ui, data, token } from "$lib/stores";
  import { onMount } from "svelte";
  import { io } from "socket.io-client";
  import Message from "../../message.svelte";
  import type { Socket } from "socket.io-client";

  export let chatSocket: Socket;
  let value = "";
  $: chanUsr = $data.myChannels.find(
    (chan) => chan.channel.id == $ui.chat.room.labelFocusId
  );
  $: messages = chanUsr?.channel.channelMsgs;
  $: $ui.chat.room.textInputMap.set($ui.chat.room.labelFocusId, value);
  console.log($data.myChannels);
  const handleInput = (key: string) => {
    if (key == "Enter") {
      console.log(chatSocket.connected);
      chatSocket.emit("messageToRoom", {
        id: String($ui.chat.room.labelFocusId),
        message: value,
      });
      value = "";
    }
  };
</script>

<div class="messages-container">
  <div class="messages-section">
    {#if messages}
      {#each messages as message}
        <Message content={message.content} />
      {/each}
    {/if}
  </div>
  <div class="input-section">
    <input bind:value on:keypress={(k) => handleInput(k.key)} />
  </div>
</div>

<style lang="scss">
  .messages-container {
    background-color: whitesmoke;
    height: 100%;
    display: grid;
    grid-template-rows: 6fr 1fr;
    overflow: hidden;
  }
  .messages-section {
    overflow-y: scroll;
    height: 100%;
    padding: 1em;
  }
  .input-section {
    background-color: lightgrey;
    padding-top: 1em;
    // padding: 1em;
  }
  input {
    height: 100%;
    width: 100%;
  }
  /* your styles go here */
</style>
