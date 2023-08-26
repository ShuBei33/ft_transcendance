import type { ChannelExtended } from "$lib/models/prismaSchema";
import { writableHook } from "./hooks";

interface data {
  channels: ChannelExtended[];
}

export const data = writableHook<data>({
  initialValue: {
    channels: [],
  },
  onSet(value) {
    console.log("!!!!!!!!!! value", value);
  },
});
