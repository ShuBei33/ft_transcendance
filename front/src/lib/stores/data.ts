import type {
  ChannelExtended,
  ChanUserExtended,
  Friendship,
  UserExtended,
} from "$lib/models/prismaSchema";
import { writableHook } from "./hooks";

interface dataType {
  channels: ChannelExtended[];
  myChannels: ChanUserExtended[];
  friends: UserExtended[];
  friendShips: Friendship[];
}

export const data = writableHook<dataType>({
  initialValue: {
    channels: [],
    myChannels: [],
    friends: [],
    friendShips: [],
  },
  onSet(value) {
    console.log("!!!!!!!!!! value", value);
  },
});
