<script lang="ts">
  import { onMount } from "svelte";
  import { Channel, Discussion, Friend } from "$lib/apiCalls";
  import { data as dataStore } from "$lib/stores/data";
  import { ui } from "$lib/stores";
  import {
    StatusInv,
    type ChannelMsg,
    type Friendship,
    type UserExtended,
  } from "$lib/models/prismaSchema";
  import type { AxiosResponse } from "axios";
  import { addAnnouncement } from "$lib/stores/session";
  import Page from "../../routes/+page.svelte";

  onMount(async () => {
    const _Channel = new Channel();
    const _Friend = new Friend();
    const _Discussion = new Discussion();

    // Channel
    await _Channel
      .mine()
      .then(async ({ data }) => {
        const myChannels = data.data;
        const myChannelsIds: number[] = myChannels.map((chanusr) => chanusr.channel.id);
        const myChannelsMessages = myChannelsIds.map((chanId) => _Channel.msgs(chanId));

        // Retrieve every channel messages and append then to the channels object
        await Promise.all(myChannelsMessages).then((ChannelMessages) => {
          ChannelMessages.forEach((message, index) => {
            const { data } = message;
            if (data.data.length) myChannels[index].channel.channelMsgs = data.data;
          });
        });
        $dataStore.myChannels = myChannels;
      })
      .catch((e) => {});
    // Friend
    try {
      await _Friend.getFriends(StatusInv.ACCEPTED).then(({ data }) => {
        $dataStore.friends = data.data as UserExtended[];
      });
      Promise.all([
        _Friend.getFriends(StatusInv.PENDING, false),
        _Friend.getFriends(StatusInv.BLOCKED, false),
      ]).then(([pending, blocked]) => {
        const pendingData = pending.data.data as Friendship[];
        const blockedData = blocked.data.data as Friendship[];

        $dataStore.friendShips = pendingData.concat(blockedData);
      });
    } catch (e) {
      addAnnouncement({
        message: "An error occured while retrieving your friendlist.",
        level: "error",
      });
      // $dataStore.friends = [];
      // $dataStore.friendShips = [];
    }
    // Discussion
    await _Discussion.all().then(({ data }) => {
      $dataStore.discussions = data.data;
      console.log("💬", data.data);
    });
    // .then(({ data }) => {
    //   console.log("user disc !", data);
    // })
    // .catch((e) => {});
  });
</script>
