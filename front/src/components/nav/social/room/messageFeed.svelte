<script lang="ts">
  import type {
    ChannelMsg,
    DiscussionMsg,
    User,
  } from "$lib/models/prismaSchema";
  import { data, ui, user } from "$lib/stores";
  import { DateTime } from "luxon";
  import AvatarFrame from "../avatarFrame.svelte";
  import Typography from "../../../Typography.svelte";
  import { get } from "svelte/store";
  import { onMount } from "svelte";
  import { getFollowupTimeStampString } from "$lib/utils/time/messages";
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
    const writer = users?.find(
      (_chanUsr) => _chanUsr.user.id == message.userId
    );
    return writer;
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
</script>

{#if sortMessages?.length}
  {#each sortedMessages as feed}
    <div class="feed-wrapper">
      {#each feed.messages as message, index}
        {#if index == 0}
          <div class="feed-initial message">
            <div class="lhs">
              <AvatarFrame
                class="chat-avatar-frame"
                userId={String(message.userId)}
              />
            </div>
            <div class="rhs">
              <Typography>{getWriter(message)?.user.pseudo}</Typography>
              <Typography>{message.content}</Typography>
            </div>
          </div>
        {:else}
          <div class="feed-followup message">
            <div class="lhs">
              <Typography class="... timestamp"
                >{getFollowupTimeStampString(message)}</Typography
              >
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
</style>
