<script lang="ts">
  import type { ChannelMsg, User } from "$lib/models/prismaSchema";
  import { data, ui, user } from "$lib/stores";
  import { DateTime } from "luxon";
  import AvatarFrame from "../avatarFrame.svelte";
  import Typography from "../../../Typography.svelte";
  import { get } from "svelte/store";
  import { onMount } from "svelte";
  interface feed {
    userId: number;
    messages: ChannelMsg[];
  }
  export let messages: ChannelMsg[] = [];
  let sortedMessages: feed[] = [];

  const getWriter = (message: ChannelMsg) => {
    const chanUsr = $data.myChannels.find(
      (chanUsr) => chanUsr.channel.id == $ui.chat.room.labelFocusId
    );
    const users = chanUsr?.channel.channelUsers;
    const writer = users?.find((_chanUsr) => _chanUsr.user.id == message.userId);
    return writer;
  };
  const getMessageTimeStamp = (message: ChannelMsg): DateTime => {
    const now = DateTime.now();
    return DateTime.fromISO(String(message.createdAt)).setZone(now.zone);
  };

  const getFollowupTimeStampString = (message: ChannelMsg) => {
    const timeStamp = getMessageTimeStamp(message);
    return `${timeStamp.hour}:${timeStamp.minute}`;
  };

  const sortMessages = (messages: ChannelMsg[]): feed[] => {
    if (!messages) return [];
    let result: feed[] = [];
    let currentFeed: feed | undefined = undefined;
    for (let i = 0; i < messages.length; i++) {
      const message = messages[i];
      if (currentFeed && currentFeed.userId != message.userId) {
        result.push(currentFeed);
        currentFeed = undefined;
      }
      if (!currentFeed) {
        currentFeed = {
          userId: message.userId,
          messages: [],
        };
      }
      currentFeed.messages.push(message);
    }
    if (currentFeed) result.push(currentFeed);
    return result;
  };
  $: sortedMessages = sortMessages(messages);
  $: console.log("sorted", sortedMessages);
</script>

{#if sortMessages?.length}
  {#each sortedMessages as feed}
    <div class="feed-wrapper">
      {#each feed.messages as message, index}
        {#if index == 0}
          <div class="feed-initial message">
            <div class="lhs">
              <AvatarFrame class="chat-avatar-frame" userId={String(message.userId)} />
            </div>
            <div class="rhs">
              <Typography>{getWriter(message)?.user.pseudo}</Typography>
              <Typography>{message.content}</Typography>
            </div>
          </div>
        {:else}
          <div class="feed-followup message">
            <div class="lhs">
              <Typography class="... timestamp">{getFollowupTimeStampString(message)}</Typography>
            </div>
            <Typography class="... content">{message.content}</Typography>
          </div>
        {/if}
      {/each}
    </div>
  {/each}
{/if}

<style lang="scss">
  @use "../../../../lib/style/colors.scss";

  :global(.chat-avatar-frame) {
    height: 3em;
    width: 3em;
  }

  .feed-followup .lhs {
    :global(.timestamp) {
      font-size: smaller;
    }
    // display: flex;
  }

  // .followup {
  //   &-lhs {
  //     // display: none;
  //   }
  //   :gloal(.) {

  //   }
  // }
  // :global(.followup) {
  //   // margin-left: 3.5em;
  // }

  .feed-wrapper {
    display: flex;
    flex-direction: column;
    height: auto;
    width: 100%;
  }

  .feed-initial {
    display: flex;
    column-gap: 0.5em;
    .rhs {
      display: flex;
      flex-direction: column;
    }
  }

  .feed-followup {
    display: flex;
    column-gap: 1em;
  }
  .message {
    &:hover {
      background-color: darken(colors.$slateMarine, 2%);
    }
    padding: 0.2em;
  }
</style>
