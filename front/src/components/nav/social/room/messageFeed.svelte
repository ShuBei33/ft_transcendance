<script lang="ts">
  import type { ChannelMsg, User } from "$lib/models/prismaSchema";
  import { data, ui, user } from "$lib/stores";
  import { DateTime } from "luxon";
  import AvatarFrame from "../avatarFrame.svelte";
  import Typography from "../../../Typography.svelte";
  import { get } from "svelte/store";

  export let messages: ChannelMsg[] = [];
  type oneMessageType = ChannelMsg;
  type oneFeedType = oneMessageType[];
  type feedArrayType = oneFeedType[] | undefined;

  $: index = $data.feedIndexMap.get($ui.chat.room.labelFocusId) || 0;
  $: console.log("index change", index);
  $: console.log("message change", messages);
  $: feedInfo = $data.channelFeedMap.get($ui.chat.room.labelFocusId);
  let feed: feedArrayType = (feedInfo && feedInfo.data) || [];
  $: console.log("feed change", feed);
  // Utils
  const isMessageFromTheSameUser = (feedCtx: oneFeedType, message: oneMessageType) =>
    feedCtx[0].userId == message.userId;
  // Time
  const getMessageTimeStamp = (message: oneMessageType): DateTime => {
    const now = DateTime.now();
    return DateTime.fromISO(String(message.createdAt)).setZone(now.zone);
  };

  const getFollowupTimeStampString = (feedCtx: oneFeedType, message: oneMessageType) => {
    const timeStamp = getMessageTimeStamp(message);
    return `${timeStamp.hour}:${timeStamp.minute}`;
  };

  // Messages
  $: getFeedFromMessages = (initialValue: feedArrayType): feedArrayType => {
    let result: feedArrayType = [];
    // (() => {
    if (initialValue?.length) result = initialValue.map((arr) => arr.slice());
    // })();
    let currentFeed: ChannelMsg[] = [];

    for (; index < messages.length; index++) {
      const currentMessage = messages[index];

      if (currentFeed.length && !isMessageFromTheSameUser(currentFeed, currentMessage)) {
        result.push(currentFeed);
        currentFeed = [];
      }
      currentFeed.push(messages[index]);
    }
    $data.feedIndexMap.set($ui.chat.room.labelFocusId, index);
    if (currentFeed.length) result.push(currentFeed);
    return result;
  };

  const getWriter = (message: oneMessageType) => {
    const chanUsr = $data.myChannels.find(
      (chanUsr) => chanUsr.channel.id == $ui.chat.room.labelFocusId
    );
    const users = chanUsr?.channel.channelUsers;
    const writer = users?.find((_chanUsr) => _chanUsr.user.id == message.userId);
    return writer;
  };
  const saveFeed = (feed: feedArrayType) => {
    if (!feed) return;
    if (feedInfo) {
      feedInfo.data = feed.map((arr) => arr.slice());
      $data.channelFeedMap.set($ui.chat.room.labelFocusId, feedInfo);
    } else {
      $data.channelFeedMap.set($ui.chat.room.labelFocusId, {
        data: feed,
      });
    }
    console.log("saved");
  };
  $: feed = getFeedFromMessages(feed);
  $: saveFeed(feed);
  // $: console.log("!feed", feed);
</script>

{JSON.stringify(feed)}

<!-- {#if feed?.length}
  {#each feed as feedCtx}
    <div class="feed-wrapper">
      {#each feedCtx as message, index}
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
              <Typography class="... timestamp"
                >{getFollowupTimeStampString(feedCtx, message)}</Typography
              >
            </div>
            <Typography class="... content">{message.content}</Typography>
          </div>
        {/if}
      {/each}
    </div>
  {/each}
{/if} -->

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
