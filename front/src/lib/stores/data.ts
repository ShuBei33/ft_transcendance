import type { ChannelExtended } from "$lib/models/prismaSchema";
import { writableHook } from "./hooks";

interface dataType {
  channels: ChannelExtended[];
}

export const data = writableHook<dataType>({
  initialValue: {
    channels: [],
  },
  onSet(value) {
    console.log("!!!!!!!!!! value", value);
  },
});
