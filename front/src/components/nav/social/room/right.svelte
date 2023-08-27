<script lang="ts">
  import { ui, data } from "$lib/stores";
  import { onMount } from "svelte";
  let value = "";
  onMount(() => {
    if ($ui.chat.room.labelFocusId == -1 && $data.channels.length)
      $ui.chat.room.labelFocusId = $data.channels[0].id;
  });
  const handleInputSubmit = () => {
    console.log(value);
  };
</script>

<div class="messages-container">
  <div class="messages-section" />
  <div class="input-section">
    <input
      role="textbox"
      bind:value
      on:keypress={(k) => k.key == "Enter" && handleInputSubmit()}
    />
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
