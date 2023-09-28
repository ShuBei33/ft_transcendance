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

interface channelFeedInfo {
  data: ChannelMsg[][];
}

interface dataType {
  // lhs = channelId, rhs = feedIndex
  feedIndexMap: Map<number, number>;
  discToggleMap: Map<number, boolean>;
  channels: ChannelExtended[];
  myChannels: ChanUserExtended[];
  discussions: DiscussionLite[];
  channelFeedMap: Map<number, channelFeedInfo>;
  friends: User[];
  friendShips: Friendship[];
}

export const isDiscToggle = (key: number): boolean => {
  const _data = get(data);
  if (!_data)
    return false;
  return _data.discToggleMap.get(key) == true;
}

export const toggleDisc = (key: number, value: boolean) => {
  const _data = get(data);
  if (!_data)
    return;
  let newMap = _data.discToggleMap;
  newMap.set(key, value);
  data.update(prev => {
    prev.discToggleMap = newMap
    return prev;
  });
}

export const data = writableHook<dataType>({
  initialValue: {
    channels: [],
    myChannels: [],
    friends: [],
    friendShips: [],
    discussions: [],
    feedIndexMap: new Map(),
    discToggleMap: new Map(),
    channelFeedMap: new Map(),
  },
  onSet(value) {
  },
});
