import type { ChannelExtended, ChanUserExtended } from "$lib/models/prismaSchema";
import { writableHook } from "./hooks";

interface dataType {
  channels: ChannelExtended[];
  myChannels: ChanUserExtended[]
}

export const data = writableHook<dataType>({
  initialValue: {
    channels: [],
    myChannels: []
  },
  onSet(value) {
    console.log("!!!!!!!!!! value", value);
  },
});
