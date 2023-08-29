import type { ChanUserExtended, ChannelMsg } from "$lib/models/prismaSchema";
import { data } from "$lib/stores";
import type { ComponentProps } from "svelte";
import { get } from "svelte/store";
import type ActionButton from "../../../actionButton.svelte";
import type { Action } from "svelte/action";

export const getChannelMessageWriter = (
  message: ChannelMsg
): ChanUserExtended | undefined => {
  let res: ChanUserExtended | undefined = undefined;
  get(data).myChannels.forEach((chanUsr) => {
    if (chanUsr.channel.id == message.userId) {
      res = chanUsr.channel.channelUsers.find(
        (user) => user.id == message.userId
      );
      return res;
    }
  });
  return res;
};

type action = { label: string; callback: () => void };
type channelActions = ComponentProps<ActionButton>["actions"];
export const getChannelDropDownActions = (
  message: ChannelMsg
): channelActions => {
  const writer = getChannelMessageWriter(message);

  return [
    {
      label: "ban",
      callback: () => console.log("test"),
    },
    {
      label: "kick",
      callback: () => console.log("test2"),
    },
    {
      label: "mute",
      callback: () => console.log("test3"),
    },
  ];
};
