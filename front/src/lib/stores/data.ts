import type { DiscussionLite } from "$lib/models/discussion";
import type {
  ChannelExtended,
  ChannelMsg,
  ChanUserExtended,
  Discussion,
  Friendship,
  User,
  UserExtended,
} from "$lib/models/prismaSchema";
import { get } from "svelte/store";
import { writableHook } from "./hooks";
import { user } from ".";

interface channelFeedInfo {
  data: ChannelMsg[][];
}

interface dataType {
  // lhs = channelId, rhs = feedIndex
  feedIndexMap: Map<number, number>;
  channels: ChannelExtended[];
  myChannels: ChanUserExtended[];
  discussions: DiscussionLite[];
  channelFeedMap: Map<number, channelFeedInfo>;
  friends: User[];
  friendShips: Friendship[];
}

export const chanFocusMap = writableHook<Map<number, boolean>>({
  initialValue: new Map(),
});

export const data = writableHook<dataType>({
  initialValue: {
    channels: [],
    myChannels: [],
    friends: [],
    friendShips: [],
    discussions: [],
    feedIndexMap: new Map(),
    channelFeedMap: new Map(),
  },
  onSet(value) {
    console.log("📊", value);
  },
});
