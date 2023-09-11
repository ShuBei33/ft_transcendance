import type {
  ChannelExtended,
  ChannelMsg,
  ChanUserExtended,
  Friendship,
  UserExtended,
} from "$lib/models/prismaSchema";
import { writableHook } from "./hooks";

interface channelFeedInfo {
  data: ChannelMsg[][];
}

interface dataType {
  channels: ChannelExtended[];
  myChannels: ChanUserExtended[];
  // lhs = channelId, rhs = feedIndex
  feedIndexMap: Map<number, number>;
  channelFeedMap: Map<number, channelFeedInfo>;
  friends: UserExtended[];
  friendShips: Friendship[];
}

export const data = writableHook<dataType>({
  initialValue: {
    channels: [],
    myChannels: [],
    friends: [],
    friendShips: [],
    feedIndexMap: new Map(),
    channelFeedMap: new Map()
  },
  onSet(value) {
    console.log("++++++++++++++ data change", value);
  },
});
