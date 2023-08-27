<script lang="ts">
  import { ui, data } from "$lib/stores";
  import { onMount } from "svelte";
  import { events } from "$lib/stores/socket";
  let value = "";

  $: $ui.chat.room.textInputMap.set($ui.chat.room.labelFocusId, value);
  $: console.log(value);
  $: chatSocket = $events;
  $: console.log(chatSocket);

  const handleInput = (key: string) => {
    if (key == "Enter") {
      chatSocket!.emit("messageToRoom", {
        id: String($ui.chat.room.labelFocusId),
        message: value,
      });
      value = "";
    }
  };
</script>

<div class="messages-container">
  <div class="messages-section" />
  <div class="input-section">
    {#if chatSocket}
      <input
        role="textbox"
        bind:value
        on:keypress={(k) => handleInput(k.key)}
      />
    {/if}
  </div>
</div>

<style lang="scss">
  .messages-container {
    background-color: whitesmoke;
    height: 100%;
    display: grid;
    grid-template-rows: 6fr 1fr;
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
