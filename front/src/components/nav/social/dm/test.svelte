<script lang="ts">
  import { user } from "$lib/stores";
  import type { User } from "$lib/models/prismaSchema";
  import { data } from "$lib/stores";
  import type { Socket } from "socket.io-client";
  import GenericButton from "../../../genericButton.svelte";

  export let chatSocket: Socket | undefined;
  let selectedFriend: User;
  let value = "";

  type emitMessageType = {
    senderId: string;
    receiverId: string;
    message: string;
  };

  const handleInput = (key: string) => {
    if (key == "Enter") {
      console.log(chatSocket?.connected);
      const payload: emitMessageType = {
        senderId: String($user?.id),
        receiverId: String(selectedFriend.id),
        message: value,
      };
      chatSocket?.emit("message", payload);
      value = "";
    }
  };
</script>

<div class="friend-flex">
  <div class="selectFriend">
    {#each $data.friends as friend}
      <GenericButton
        on:click={() => {
          selectedFriend = friend;
        }}
      >
        {`${friend.pseudo}: ${friend.id}`}
      </GenericButton>
    {/each}
  </div>
  <input bind:value on:keypress={(k) => handleInput(k.key)} />
</div>
