<script lang="ts">
  import type {
    ChanUserExtended,
    ChannelExtended,
    ChannelMsg,
    User,
  } from "$lib/models/prismaSchema";
  import { data } from "$lib/stores";
  import AvatarFrame from "../avatarFrame.svelte";

  console.log($data.myChannels);
  export let message: ChannelMsg;

  // Get message Writer for channel

  // let writer: ChanUserExtended | undefined = getChannelMessageWriter();
  // $: console.log("writer", writer);
</script>

<div class="container">
  <div class="avatar-section">
    <AvatarFrame height={"5em"} width={"5em"} userId={String(message.userId)} />
  </div>
  <div class="message-section">
    <div class="message-header" />
    <slot />
    <div class="message-content">
      {message.content}
    </div>
  </div>
</div>

<!-- <div><p>{message.content}</p></div> -->

<style>
  .container {
    display: flex;
    height: auto;
    margin-bottom: 1em;
    column-gap: 0.5em;
  }
  .message-section {
    background-color: lightgrey;
    height: 100%;
    width: 100%;
    padding: 0.5em;
  }
</style>
