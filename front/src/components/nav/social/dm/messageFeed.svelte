<script lang="ts">
  import type { DiscussionLite } from "$lib/models/discussion";
  import type { Discussion, DiscussionMsg } from "$lib/models/prismaSchema";
  import { data, user } from "$lib/stores";
  import { getFollowupTimeStampString } from "$lib/utils/time/messages";
  import Typography from "../../../Typography.svelte";
  import UserLink from "../../../UserLink.svelte";
  import AvatarFrame from "../avatarFrame.svelte";

  export let messages: DiscussionMsg[] = [];

  interface feed {
    userId: number;
    messages: DiscussionMsg[];
  }
  const sortMessages = (messages: DiscussionMsg[]): feed[] => {
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

  const getWriter = (message: DiscussionMsg) => {
    if (message.userId == $user?.id) return $user;

    return $data.friends.find((user) => user.id == message.userId);
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
              <AvatarFrame class="chat-avatar-frame" userId={String(message.userId)} />
            </div>
            <div class="rhs">
              <!-- <Typography>{getWriter(message)?.pseudo}</Typography> -->
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
</style>
